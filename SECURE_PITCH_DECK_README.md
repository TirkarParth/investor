# Secure Pitch Deck System - TRADEFOOX

A secure, hidden system for uploading and sharing pitch deck materials with investors. This system is designed to be completely invisible to regular website visitors while providing secure access to confidential materials.

## 🔒 Security Features

- **Hidden from regular visitors** - No links or references on the main website
- **Complex, non-guessable URLs** - Secure tokens with timestamps and random hashes
- **Admin authentication** - Password-protected admin panel
- **No indexing** - Admin pages are marked with `noindex, nofollow`
- **Secure file access** - Files are only accessible via generated secure links

## 🚀 Quick Start

### 1. Access Admin Panel

**Option A: Direct URL (Recommended for admins)**
```
https://yourdomain.com/admin.html
```

**Option B: React Route**
```
https://yourdomain.com/admin
```

### 2. Admin Login

Use the admin password to access the pitch deck management system.

**Default Admin Password:** `TRADEFOOX_SECURE_2024`

> **⚠️ Security Note:** Change this password immediately after first login in production!

### 3. Upload Files

- Drag and drop or click to select files
- Supported formats: PDF, PPT, PPTX, DOC, DOCX
- Files are stored securely with unique IDs

### 4. Generate Secure Links

- Click "Copy Link" for any uploaded file
- Each link contains a unique, non-guessable token
- Links can be shared via email with investors

## 📁 File Management

### Uploading Files
1. Access admin panel
2. Click "Select Files" or drag files to the upload area
3. Wait for upload completion
4. File appears in the files list

### File Information Tracked
- File name and type
- Upload date and time
- File size
- Download count
- Last accessed timestamp

### Managing Files
- **Download**: Test files or download for local use
- **Copy Link**: Generate secure access link for sharing
- **Delete**: Remove files permanently

## 🔗 Secure Link Structure

### URL Format
```
https://yourdomain.com/pitch-deck-access/{SECURE_TOKEN}/{FILE_ID}
```

### Example
```
https://dayone-mediagroup.com/pitch-deck-access/aBcDeF1234567890XyZ/pitch_1703123456789_abc123def
```

### Security Features
- **Non-guessable tokens**: Base64 encoded with timestamps and random hashes
- **Unique per file**: Each file gets a different token
- **Time-based**: Tokens include upload timestamps
- **Random elements**: Additional random hash prevents pattern recognition

## 📧 Email Integration

### For Investors
Include secure links in your emails:

```
Subject: TRADEFOOX Investment Materials

Dear Investor,

Thank you for your interest in TRADEFOOX. Please find our pitch deck and additional materials at the secure link below:

📊 Pitch Deck: [SECURE_LINK_HERE]

This link provides secure access to confidential materials. Please do not share this URL with unauthorized parties.

Best regards,
TRADEFOOX Team
```

### Link Management
- Generate new links for each investor if needed
- Track download counts to monitor engagement
- Links remain active until files are deleted

## 🛡️ Security Best Practices

### 1. Password Management
- Use a strong, unique password
- Change password regularly
- Don't share admin credentials
- Consider implementing 2FA for production

### 2. File Security
- Only upload necessary materials
- Remove outdated files
- Monitor access logs
- Use descriptive file names for tracking

### 3. Link Sharing
- Send links via secure channels (email, encrypted messaging)
- Don't post links on public forums
- Consider link expiration for highly sensitive materials
- Monitor unusual access patterns

## 🔧 Technical Implementation

### Frontend Components
- `SecureAccess.tsx` - Main routing component
- `SecurePitchDeck.tsx` - Admin panel interface
- `SecureFileAccess.tsx` - Secure file download interface

### Storage
- **Development**: Files stored in localStorage (for testing)
- **Production**: Implement server-side storage with proper authentication

### Routing
- Client-side routing using URL parameters
- No server-side routing required
- Handles browser navigation (back/forward)

## 🚨 Production Considerations

### Server-Side Implementation
```javascript
// Example server-side token validation
const validateToken = (token, fileId) => {
  // Decode JWT token
  // Verify expiration
  // Check file access permissions
  // Log access attempts
  return isValid;
};
```

### File Storage
- Use cloud storage (AWS S3, Google Cloud Storage)
- Implement proper access controls
- Enable file encryption at rest
- Set up CDN for fast downloads

### Authentication
- Replace simple password with JWT tokens
- Implement session management
- Add rate limiting for login attempts
- Enable audit logging

### Monitoring
- Track file access patterns
- Monitor for suspicious activity
- Set up alerts for unusual downloads
- Regular security audits

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized file upload experience
- Mobile-optimized secure links

## 🔍 Troubleshooting

### Common Issues

**File won't upload**
- Check file format (PDF, PPT, PPTX, DOC, DOCX)
- Ensure file size is reasonable
- Check browser console for errors

**Can't access admin panel**
- Verify admin password
- Check if you're on the correct URL
- Clear browser cache and cookies

**Secure link not working**
- Link may have expired
- File may have been deleted
- Check URL format and parameters

**Download issues**
- Check browser download settings
- Ensure sufficient disk space
- Try different browser

### Debug Information
- Check browser console for error messages
- Verify localStorage contents
- Test with different file types
- Check network requests

## 📋 File Format Support

| Format | Extension | Notes |
|--------|-----------|-------|
| PDF | .pdf | Best for sharing, universal compatibility |
| PowerPoint | .ppt, .pptx | Native presentation format |
| Word | .doc, .docx | Text-based documents |

## 🔐 Advanced Security Options

### Token Expiration
```javascript
// Add expiration to secure tokens
const generateSecureToken = (fileId, expirationHours = 24) => {
  const expiresAt = Date.now() + (expirationHours * 60 * 60 * 1000);
  const token = btoa(`${fileId}_${expiresAt}_${randomHash}`);
  return token;
};
```

### Access Logging
```javascript
// Log all access attempts
const logAccess = (fileId, ipAddress, userAgent, success) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    fileId,
    ipAddress,
    userAgent,
    success,
    token: currentToken
  };
  // Send to logging service
};
```

### Rate Limiting
```javascript
// Prevent brute force attacks
const checkRateLimit = (ipAddress) => {
  const attempts = getRecentAttempts(ipAddress);
  return attempts.length < 5; // Max 5 attempts per hour
};
```

## 📞 Support

For technical support or security concerns:
- **Email**: invest@tradefoox.com
- **Security**: security@tradefoox.com
- **Emergency**: +49 [PHONE_NUMBER]

## 📄 License

This secure pitch deck system is proprietary to TRADEFOOX and DayOne Media Group. All rights reserved.

---

**⚠️ Security Reminder:** This system handles confidential business materials. Always follow security best practices and never share admin credentials or secure links publicly.
