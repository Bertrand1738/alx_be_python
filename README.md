# 🔐 Secure Medical Image Upload System for Wix

A comprehensive, HIPAA-compliant secure upload system for medical images with client-side encryption, audit logging, and admin dashboard.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Velo JS)     │────│   (JSW)         │────│   Collections   │
│                 │    │                 │    │                 │
│ • File Upload   │    │ • Media Manager │    │ • UploadLogs    │
│ • Encryption    │    │ • Data Storage  │    │ • AuditLogs     │
│ • Validation    │    │ • Security      │    │ • User Data     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 File Structure

```
/
├── secure-upload.js          # Main frontend upload logic
├── backend/
│   └── uploadHandler.jsw     # Backend upload processing
├── admin-dashboard.js        # Admin interface
├── enhanced-security.js      # Security utilities
└── README.md                # This documentation
```

## 🚀 Quick Setup Guide

### Step 1: Enable Velo Development Mode
1. Go to your Wix Dashboard
2. Click **Dev Mode** → **Turn on Dev Mode**
3. This enables custom JavaScript and backend functionality

### Step 2: Install Required Packages
In Velo Sidebar → Packages → Add npm Package:
```bash
crypto-js
crypto-hash
```

### Step 3: Create Database Collections

#### UploadLogs Collection
| Field Name | Type | Description |
|------------|------|-------------|
| `fileId` | Text | Unique file identifier |
| `fileName` | Text | Original filename |
| `secureFileName` | Text | Encrypted filename |
| `fileUrl` | Text | Wix Media Manager URL |
| `sha256Hash` | Text | File integrity hash |
| `originalSize` | Number | File size in bytes |
| `originalMimeType` | Text | Original MIME type |
| `userEmail` | Text | Uploader email |
| `uploadTime` | Date | Upload timestamp |
| `ipAddress` | Text | Client IP address |
| `status` | Text | Upload status |
| `encrypted` | Boolean | Encryption flag |

#### AuditLogs Collection (Optional - HIPAA Compliance)
| Field Name | Type | Description |
|------------|------|-------------|
| `timestamp` | Date | Action timestamp |
| `action` | Text | Action performed |
| `resourceId` | Text | File/resource ID |
| `userId` | Text | User identifier |
| `ipAddress` | Text | Client IP |
| `sessionId` | Text | Session identifier |
| `complianceVersion` | Text | Compliance standard |

### Step 4: Create Pages and Add Elements

#### Upload Page Elements
| Element | ID | Type | Purpose |
|---------|----|----- |---------|
| File Upload | `#uploadButton1` | Upload Button | File selection |
| Submit Button | `#submitButton` | Button | Trigger upload |
| Status Text | `#statusText` | Text | Status messages |
| Email Input | `#userEmail` | Input | User identification |

#### Admin Dashboard Elements
| Element | ID | Type | Purpose |
|---------|----|----- |---------|
| Logs Display | `#logsDisplay` | HTML | Upload logs table |
| Stats Display | `#statsDisplay` | Text | Statistics |
| Search Input | `#searchInput` | Input | Search functionality |
| Search Button | `#searchButton` | Button | Search trigger |
| Refresh Button | `#refreshButton` | Button | Refresh data |
| Navigation | `#prevButton`, `#nextButton` | Button | Pagination |
| Page Info | `#pageInfo` | Text | Page information |

## 🔧 Implementation Details

### Frontend Security Features

#### 1. File Validation
```javascript
// File type validation
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];

// File size limit (50MB)
if (file.size > 50 * 1024 * 1024) {
  // Handle error
}
```

#### 2. Client-Side Encryption
```javascript
// AES encryption with CryptoJS
const encrypted = CryptoJS.AES.encrypt(base64Data, ENCRYPTION_KEY).toString();
```

#### 3. Integrity Verification
```javascript
// SHA-256 hash generation
const hash = await sha256(base64Data);
```

### Backend Security Features

#### 1. Secure File Upload
- Files stored as encrypted text documents
- Unique file IDs generated
- Comprehensive audit logging

#### 2. Access Control
- User authentication verification
- Role-based permissions
- Session management

#### 3. Data Encryption
- Per-user encryption keys
- Key rotation capabilities
- Metadata encryption

## 🛡️ Security Features

### 🔐 Encryption
- **Algorithm**: AES-256-CBC
- **Key Management**: Per-user keys with rotation
- **Integrity**: SHA-256 hashing
- **Metadata**: Encrypted with timestamp verification

### 🔍 Audit Logging
- All file access logged
- HIPAA-compliant audit trails
- User action tracking
- IP address and session logging

### 🚫 Access Control
- Member authentication required
- Role-based permissions
- Session timeout enforcement
- IP-based restrictions

### 📊 File Validation
- MIME type verification
- File size limits (configurable)
- Malicious file detection
- Extension validation

## 📈 Admin Dashboard Features

### 📋 Upload Management
- Real-time upload monitoring
- File status tracking
- Search and filter capabilities
- Pagination for large datasets

### 🔍 File Operations
- **View**: Decrypt and preview images
- **Download**: Secure file download
- **Search**: Find files by ID, name, or user
- **Statistics**: Upload success/failure rates

### 📊 Analytics
- Upload volume tracking
- User activity monitoring
- Error rate analysis
- Performance metrics

## 🏥 HIPAA Compliance Features

### 📝 Audit Requirements
- Complete access logging
- User identification tracking
- Action timestamping
- Data anonymization

### 🔒 Security Controls
- Encryption at rest and in transit
- Access control enforcement
- Session management
- Data integrity verification

### 📋 Administrative Safeguards
- User access reviews
- Security incident logging
- Regular security assessments
- Staff training documentation

## ⚙️ Configuration Options

### Security Settings
```javascript
const SECURITY_CONFIG = {
  keyRotationInterval: 24 * 60 * 60 * 1000, // 24 hours
  maxFileSize: 100 * 1024 * 1024,           // 100MB
  sessionTimeout: 30 * 60 * 1000,           // 30 minutes
  auditLogEnabled: true
};
```

### Allowed File Types
```javascript
allowedMimeTypes: [
  'image/jpeg', 'image/png', 'image/gif', 
  'image/bmp', 'image/webp', 'image/tiff',
  'image/svg+xml', 'application/dicom'
]
```

## 🔄 API Reference

### Frontend Functions

#### `uploadEncryptedImage(blob, filename, hash, email, size, type)`
Uploads encrypted file to backend
- **Parameters**: File data and metadata
- **Returns**: Upload result with file ID

### Backend Functions

#### `uploadEncryptedImage(fileBlob, filename, hash, userEmail, fileSize, mimeType)`
Processes and stores encrypted files
- **Parameters**: Encrypted file data
- **Returns**: Storage result and file ID

#### `decryptImage(fileId, decryptionKey)`
Decrypts stored files for authorized access
- **Parameters**: File ID and decryption key
- **Returns**: Decrypted file data

#### `getUploadStats()`
Retrieves upload statistics
- **Returns**: Statistics summary

### Security Functions

#### `generateUserEncryptionKey(userId, masterKey)`
Creates per-user encryption keys
- **Parameters**: User ID and master key
- **Returns**: User-specific encryption key

#### `validateSecureFile(file)`
Validates file security
- **Parameters**: File object
- **Returns**: Validation result

## 🚨 Security Considerations

### ⚠️ Important Notes

1. **Encryption Keys**: Replace hardcoded keys with Wix Secrets Manager
2. **User Authentication**: Implement proper user verification
3. **Rate Limiting**: Add upload rate limiting
4. **Virus Scanning**: Consider integrating antivirus scanning
5. **Backup Strategy**: Implement secure backup procedures

### 🔧 Production Deployment

1. **Environment Variables**: Use Wix Secrets for sensitive data
2. **SSL/TLS**: Ensure HTTPS is enforced
3. **Monitoring**: Set up security monitoring
4. **Compliance**: Regular security audits
5. **Documentation**: Maintain security procedures

## 🆘 Troubleshooting

### Common Issues

#### Upload Fails
- Check file size limits
- Verify MIME type support
- Confirm user permissions
- Review network connectivity

#### Decryption Errors
- Verify encryption key consistency
- Check file integrity
- Confirm user authorization
- Review audit logs

#### Performance Issues
- Monitor file sizes
- Check encryption overhead
- Review database queries
- Optimize media storage

## 📞 Support & Maintenance

### Regular Tasks
- [ ] Monitor audit logs
- [ ] Review user access
- [ ] Update encryption keys
- [ ] Check system performance
- [ ] Backup encrypted data

### Security Reviews
- [ ] Quarterly access audits
- [ ] Annual security assessments
- [ ] Regular penetration testing
- [ ] Compliance certification updates
- [ ] Staff security training

## 📜 License & Compliance

This implementation is designed to support HIPAA compliance requirements but requires proper configuration and ongoing maintenance. Consult with legal and compliance experts for production deployment in healthcare environments.

---

**Version**: 2.0  
**Last Updated**: 2024  
**Compliance**: HIPAA-Ready  
**Platform**: Wix Velo