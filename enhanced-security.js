import CryptoJS from 'crypto-js';
import { sha256 } from 'crypto-hash';
import { currentMember } from 'wix-members';
import { getSecret } from 'wix-secrets-backend';

// Enhanced security configuration
const SECURITY_CONFIG = {
  keyRotationInterval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedMimeTypes: [
    'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp',
    'image/tiff', 'image/svg+xml', 'application/dicom'
  ],
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  auditLogEnabled: true
};

// Generate per-user encryption key
export async function generateUserEncryptionKey(userId, masterKey) {
  const timestamp = Date.now();
  const keyMaterial = `${userId}-${masterKey}-${Math.floor(timestamp / SECURITY_CONFIG.keyRotationInterval)}`;
  return await sha256(keyMaterial);
}

// Enhanced encryption with metadata
export function encryptWithMetadata(data, encryptionKey, metadata = {}) {
  const timestamp = Date.now();
  const nonce = CryptoJS.lib.WordArray.random(16);
  
  const encryptionData = {
    data: data,
    metadata: {
      ...metadata,
      timestamp: timestamp,
      nonce: nonce.toString(),
      version: '2.0'
    }
  };
  
  const dataString = JSON.stringify(encryptionData);
  const encrypted = CryptoJS.AES.encrypt(dataString, encryptionKey, {
    iv: nonce,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return {
    encrypted: encrypted.toString(),
    nonce: nonce.toString(),
    timestamp: timestamp
  };
}

// Enhanced decryption with verification
export function decryptWithVerification(encryptedData, encryptionKey, expectedMetadata = {}) {
  try {
    const nonce = CryptoJS.enc.Hex.parse(encryptedData.nonce);
    
    const decrypted = CryptoJS.AES.decrypt(encryptedData.encrypted, encryptionKey, {
      iv: nonce,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptedString);
    
    // Verify metadata
    if (expectedMetadata.userId && decryptedData.metadata.userId !== expectedMetadata.userId) {
      throw new Error('User verification failed');
    }
    
    // Check timestamp validity (not older than 30 days)
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    if (Date.now() - decryptedData.metadata.timestamp > maxAge) {
      throw new Error('Data expired');
    }
    
    return {
      success: true,
      data: decryptedData.data,
      metadata: decryptedData.metadata
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// HIPAA compliance utilities
export const HIPAACompliance = {
  
  // Audit logging for HIPAA requirements
  async logAccess(action, resourceId, userId, additionalData = {}) {
    if (!SECURITY_CONFIG.auditLogEnabled) return;
    
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action: action, // 'view', 'download', 'upload', 'delete', 'decrypt'
      resourceId: resourceId,
      userId: userId,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId(),
      additionalData: additionalData,
      complianceVersion: 'HIPAA-2024'
    };
    
    try {
      await insert("AuditLogs", auditEntry);
    } catch (error) {
      console.error("Failed to log audit entry:", error);
    }
  },
  
  // Generate session ID for tracking
  getSessionId() {
    let sessionId = sessionStorage.getItem('hipaa-session-id');
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('hipaa-session-id', sessionId);
    }
    return sessionId;
  },
  
  // Get client IP (placeholder - implement based on Wix capabilities)
  getClientIP() {
    return 'auto-detected';
  },
  
  // Validate user permissions
  async validateUserPermissions(userId, action, resourceId) {
    try {
      // Check if user is authenticated
      const member = await currentMember.getMember();
      if (!member) {
        throw new Error('User not authenticated');
      }
      
      // Check user roles/permissions
      // Implement your role-based access control here
      
      return {
        allowed: true,
        userId: member._id,
        roles: member.roles || []
      };
      
    } catch (error) {
      return {
        allowed: false,
        error: error.message
      };
    }
  },
  
  // Anonymize sensitive data for logging
  anonymizeData(data) {
    const sensitiveFields = ['email', 'phone', 'ssn', 'patientId', 'medicalId'];
    const anonymized = { ...data };
    
    sensitiveFields.forEach(field => {
      if (anonymized[field]) {
        const value = anonymized[field].toString();
        anonymized[field] = value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
      }
    });
    
    return anonymized;
  }
};

// Secure file validation
export function validateSecureFile(file) {
  const validation = {
    valid: true,
    errors: []
  };
  
  // Check file size
  if (file.size > SECURITY_CONFIG.maxFileSize) {
    validation.valid = false;
    validation.errors.push(`File size exceeds maximum allowed (${SECURITY_CONFIG.maxFileSize / 1024 / 1024}MB)`);
  }
  
  // Check MIME type
  if (!SECURITY_CONFIG.allowedMimeTypes.includes(file.type)) {
    validation.valid = false;
    validation.errors.push('File type not allowed');
  }
  
  // Check file name for suspicious patterns
  const suspiciousPatterns = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js'];
  const fileName = file.name.toLowerCase();
  if (suspiciousPatterns.some(pattern => fileName.includes(pattern))) {
    validation.valid = false;
    validation.errors.push('Suspicious file detected');
  }
  
  return validation;
}

// Secure random string generator
export function generateSecureToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomArray[i] % chars.length];
  }
  
  return result;
}

// Data integrity verification
export async function verifyDataIntegrity(originalHash, decryptedData) {
  const computedHash = await sha256(decryptedData);
  return originalHash === computedHash;
}

// Secure key management
export const KeyManager = {
  
  // Store key securely in Wix Secrets
  async storeKey(keyName, keyValue) {
    try {
      // In production, use Wix Secrets Manager
      // This is a placeholder implementation
      const encryptedKey = CryptoJS.AES.encrypt(keyValue, 'master-key').toString();
      sessionStorage.setItem(`secure_key_${keyName}`, encryptedKey);
      return true;
    } catch (error) {
      console.error('Failed to store key:', error);
      return false;
    }
  },
  
  // Retrieve key securely
  async retrieveKey(keyName) {
    try {
      // In production, retrieve from Wix Secrets Manager
      const encryptedKey = sessionStorage.getItem(`secure_key_${keyName}`);
      if (!encryptedKey) {
        throw new Error('Key not found');
      }
      
      const decryptedKey = CryptoJS.AES.decrypt(encryptedKey, 'master-key').toString(CryptoJS.enc.Utf8);
      return decryptedKey;
    } catch (error) {
      console.error('Failed to retrieve key:', error);
      return null;
    }
  },
  
  // Rotate encryption keys
  async rotateKeys() {
    try {
      const newMasterKey = generateSecureToken(64);
      await this.storeKey('master', newMasterKey);
      
      // Update rotation timestamp
      sessionStorage.setItem('last_key_rotation', Date.now().toString());
      
      return true;
    } catch (error) {
      console.error('Key rotation failed:', error);
      return false;
    }
  },
  
  // Check if keys need rotation
  shouldRotateKeys() {
    const lastRotation = sessionStorage.getItem('last_key_rotation');
    if (!lastRotation) return true;
    
    const timeSinceRotation = Date.now() - parseInt(lastRotation);
    return timeSinceRotation > SECURITY_CONFIG.keyRotationInterval;
  }
};

// Export security configuration for reference
export { SECURITY_CONFIG };