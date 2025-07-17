# 🚀 Deployment Guide - Secure Upload System

This guide walks you through the complete deployment process for the Wix secure upload system.

## 📋 Pre-Deployment Checklist

- [ ] Wix Premium plan (required for Velo)
- [ ] Wix Editor access
- [ ] Basic understanding of JavaScript
- [ ] Medical compliance requirements understood
- [ ] Backup plan for existing site

## 🎯 Step-by-Step Deployment

### 1. Enable Velo Development Mode

1. **Access Wix Dashboard**
   - Log into your Wix account
   - Navigate to your site dashboard

2. **Enable Dev Mode**
   ```
   Dashboard → Dev Mode → Turn on Dev Mode
   ```
   - Click "Start Coding"
   - Accept the developer terms

3. **Verify Setup**
   - Check that Velo sidebar appears
   - Confirm code editor is accessible

### 2. Install Required NPM Packages

1. **Open Package Manager**
   ```
   Velo Sidebar → Packages & Apps
   ```

2. **Install Dependencies**
   ```
   Search: crypto-js
   Install: crypto-js (latest version)
   
   Search: crypto-hash  
   Install: crypto-hash (latest version)
   ```

3. **Verify Installation**
   - Check packages appear in installed list
   - No error messages during installation

### 3. Create Database Collections

#### Create UploadLogs Collection

1. **Access Collections**
   ```
   Velo Sidebar → Database → Add Collection
   ```

2. **Configure UploadLogs**
   ```
   Collection Name: UploadLogs
   Collection ID: UploadLogs
   ```

3. **Add Fields**
   | Field Name | Type | Settings |
   |------------|------|----------|
   | `fileId` | Text | Required |
   | `fileName` | Text | Required |
   | `secureFileName` | Text | Optional |
   | `fileUrl` | Text | Required |
   | `sha256Hash` | Text | Required |
   | `originalSize` | Number | Optional |
   | `originalMimeType` | Text | Optional |
   | `userEmail` | Text | Required |
   | `uploadTime` | Date & Time | Required, Default: Now |
   | `ipAddress` | Text | Optional |
   | `status` | Text | Required |
   | `encrypted` | Boolean | Default: true |

4. **Set Permissions**
   ```
   Create: Form submissions
   Read: Admin only
   Update: Admin only
   Delete: Admin only
   ```

#### Create AuditLogs Collection (Optional)

1. **Add Collection**
   ```
   Collection Name: AuditLogs
   Collection ID: AuditLogs
   ```

2. **Add Fields**
   | Field Name | Type | Settings |
   |------------|------|----------|
   | `timestamp` | Date & Time | Required, Default: Now |
   | `action` | Text | Required |
   | `resourceId` | Text | Required |
   | `userId` | Text | Required |
   | `ipAddress` | Text | Optional |
   | `sessionId` | Text | Optional |
   | `complianceVersion` | Text | Default: "HIPAA-2024" |

### 4. Create Upload Page

#### Add New Page

1. **Create Page**
   ```
   Pages Panel → Add Page → Blank Page
   Page Name: Secure Upload
   Page URL: /secure-upload
   ```

2. **Design Layout**
   ```
   Add Header: "Secure Medical Image Upload"
   Add Subtitle: "HIPAA-compliant encrypted upload"
   ```

#### Add Page Elements

1. **File Upload Element**
   ```
   Element: Upload Button
   ID: uploadButton1
   Settings:
   - Accept: image/*
   - Multiple files: No
   - Button text: "Select Medical Image"
   ```

2. **User Email Input**
   ```
   Element: Text Input
   ID: userEmail  
   Placeholder: "Enter your email (optional)"
   Type: Email
   ```

3. **Submit Button**
   ```
   Element: Button
   ID: submitButton
   Text: "Upload Securely"
   Style: Primary/Action color
   ```

4. **Status Display**
   ```
   Element: Text
   ID: statusText
   Initial text: "Ready to upload. Please select an image file."
   Style: Regular text, center aligned
   ```

#### Add Page Code

1. **Open Code Panel**
   ```
   Velo Sidebar → Code Files → Page Code → secure-upload.js
   ```

2. **Paste Frontend Code**
   - Copy content from `secure-upload.js`
   - Paste into page code editor
   - Save file

### 5. Create Backend Handler

1. **Create Backend File**
   ```
   Velo Sidebar → Backend → Add Web Module
   Filename: uploadHandler.jsw
   ```

2. **Add Backend Code**
   - Copy content from `backend/uploadHandler.jsw`
   - Paste into backend file
   - Save file

3. **Test Backend Connection**
   ```javascript
   // Add test function
   export function testConnection() {
     return { status: "Backend connected" };
   }
   ```

### 6. Create Admin Dashboard (Optional)

#### Create Admin Page

1. **Add Admin Page**
   ```
   Pages Panel → Add Page → Blank Page
   Page Name: Upload Dashboard
   Page URL: /admin/dashboard
   ```

2. **Add Admin Elements**
   
   **Dashboard Header**
   ```
   Element: Text
   ID: dashboardTitle
   Text: "📊 Secure Upload Dashboard"
   Style: Heading 1
   ```

   **Statistics Display**
   ```
   Element: Text  
   ID: statsDisplay
   Text: "Loading statistics..."
   Style: Regular text, multiline
   ```

   **Upload Logs Display**
   ```
   Element: HTML Embed
   ID: logsDisplay
   HTML: <div>Loading upload logs...</div>
   ```

   **Search Controls**
   ```
   Element: Text Input
   ID: searchInput
   Placeholder: "Search by file ID, name, or email"
   
   Element: Button
   ID: searchButton
   Text: "🔍 Search"
   ```

   **Action Buttons**
   ```
   Element: Button
   ID: refreshButton
   Text: "🔄 Refresh"
   
   Element: Button  
   ID: statsButton
   Text: "📊 Stats"
   ```

   **Pagination Controls**
   ```
   Element: Button
   ID: prevButton
   Text: "← Previous"
   
   Element: Text
   ID: pageInfo
   Text: "Page 1 of 1"
   
   Element: Button
   ID: nextButton  
   Text: "Next →"
   ```

   **Status Display**
   ```
   Element: Text
   ID: statusText
   Text: "Dashboard ready"
   ```

3. **Add Dashboard Code**
   - Copy content from `admin-dashboard.js`
   - Paste into page code
   - Save file

### 7. Security Configuration

#### Setup Encryption Keys

1. **Access Secrets Manager**
   ```
   Velo Sidebar → Secrets Manager
   ```

2. **Add Master Key**
   ```
   Secret Name: MASTER_ENCRYPTION_KEY
   Value: [Generate 64-character random string]
   ```

3. **Update Code References**
   ```javascript
   // Replace hardcoded keys with:
   const encryptionKey = await getSecret("MASTER_ENCRYPTION_KEY");
   ```

#### Configure Security Settings

1. **Update Security Config**
   ```javascript
   const SECURITY_CONFIG = {
     keyRotationInterval: 24 * 60 * 60 * 1000, // 24 hours  
     maxFileSize: 50 * 1024 * 1024,            // 50MB
     sessionTimeout: 30 * 60 * 1000,           // 30 minutes
     auditLogEnabled: true
   };
   ```

2. **Set File Restrictions**
   ```javascript
   const allowedMimeTypes = [
     'image/jpeg', 'image/png', 'image/gif',
     'image/bmp', 'image/webp', 'image/tiff'
   ];
   ```

### 8. Testing & Validation

#### Test Upload Functionality

1. **Basic Upload Test**
   - Navigate to upload page
   - Select test image file
   - Enter email address
   - Click upload
   - Verify success message

2. **Database Verification**
   ```
   Database → UploadLogs → View Data
   Confirm new entry appears
   ```

3. **File Storage Check**
   ```
   Media Manager → EncryptedImages folder
   Verify encrypted file stored
   ```

#### Test Admin Dashboard

1. **Access Dashboard**
   - Navigate to `/admin/dashboard`
   - Verify data loads
   - Test search functionality

2. **File Operations**
   - Test view file functionality
   - Test download capability
   - Verify decryption works

#### Security Testing

1. **Upload Validation**
   - Test file size limits
   - Test invalid file types
   - Test malicious file detection

2. **Access Control**
   - Test unauthorized access
   - Verify encryption strength
   - Check audit logging

### 9. Production Configuration

#### Performance Optimization

1. **Enable Caching**
   ```
   Site Settings → Performance → Caching
   Enable: Static content caching
   ```

2. **Optimize Images**
   ```
   Media Settings → Image Optimization
   Enable: Automatic optimization
   ```

#### Security Hardening

1. **SSL Configuration**
   ```
   Domain Settings → SSL Certificate
   Force HTTPS: Enabled
   ```

2. **Access Restrictions**
   ```
   Site Permissions → Member Restrictions
   Upload Page: Members only
   Admin Dashboard: Admin role only
   ```

3. **Rate Limiting**
   ```javascript
   // Add to upload handler
   const rateLimiter = {
     maxUploads: 10,
     timeWindow: 60000 // 1 minute
   };
   ```

### 10. Compliance Setup

#### HIPAA Compliance

1. **Business Associate Agreement**
   - Review Wix BAA requirements
   - Configure data processing settings

2. **Audit Configuration**
   ```javascript
   const auditConfig = {
     enabled: true,
     retention: 365, // days
     anonymization: true
   };
   ```

3. **Data Backup**
   ```
   Site Backups → Automatic Backups
   Frequency: Daily
   Retention: 30 days
   ```

## 🔧 Post-Deployment Tasks

### Monitoring Setup

1. **Performance Monitoring**
   - Monitor upload success rates
   - Track response times
   - Review error logs

2. **Security Monitoring**
   - Review audit logs weekly
   - Monitor failed access attempts
   - Check encryption key rotation

### Maintenance Schedule

#### Daily Tasks
- [ ] Check upload statistics
- [ ] Review error logs
- [ ] Monitor system performance

#### Weekly Tasks  
- [ ] Review audit logs
- [ ] Check user access
- [ ] Update documentation

#### Monthly Tasks
- [ ] Security assessment
- [ ] Key rotation review
- [ ] Backup verification
- [ ] Compliance audit

## 🆘 Troubleshooting

### Common Deployment Issues

#### Velo Not Available
```
Solution: Upgrade to Wix Premium plan
Verify: Business/VIP plan required
```

#### Package Installation Fails
```
Solution: Check internet connection
Verify: Package names are correct
Retry: Clear cache and reinstall
```

#### Database Connection Errors
```
Solution: Check collection permissions
Verify: Field types match code
Update: Collection ID references
```

#### Upload Failures
```
Solution: Check file size limits
Verify: MIME type validation
Review: Network connectivity
```

## 📞 Support Resources

### Wix Documentation
- [Velo API Reference](https://www.wix.com/velo/reference)
- [Database Collections](https://www.wix.com/velo/reference/wix-data)
- [Media Manager](https://www.wix.com/velo/reference/wix-media-backend)

### Security Resources
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa)
- [Encryption Best Practices](https://owasp.org/www-project-cryptographic-storage-cheat-sheet/)
- [Audit Logging Standards](https://www.nist.gov/cybersecurity)

---

**Deployment Version**: 2.0  
**Platform**: Wix Velo  
**Last Updated**: 2024