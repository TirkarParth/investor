# TRADEFOOX Secure File Server Deployment Guide

## 🚀 Overview

This guide will help you deploy the secure file server to your ALL-INKL.COM hosting to resolve the "Access Denied" errors that users are experiencing when trying to access pitch deck files.

## 🔍 Problem Analysis

**Current Issue:** Users get "Access Denied" errors because:
- Files are stored only in browser localStorage/sessionStorage
- No server-side file storage
- Files uploaded by admin on one device are not accessible to other users
- No centralized file management system

**Solution:** Deploy a secure file server that:
- **Manages external file URLs** (Google Drive, Dropbox, etc.)
- Provides secure API endpoints for file access
- Manages file permissions and access tokens
- Allows all users to access files via secure links
- **No file storage needed** - files remain on external services

## 🎯 New Approach: External File Management

**Key Change:** Instead of uploading files to your server, you now:
1. **Upload files elsewhere** (Google Drive, Dropbox, OneDrive, etc.)
2. **Add file metadata** to this server (name + URL)
3. **Generate secure links** for investors
4. **Server redirects** users to actual files

**Benefits:**
- ✅ No server storage needed
- ✅ No file size limits
- ✅ Use existing cloud services
- ✅ Instant access for all users
- ✅ Professional sharing experience

## 📋 Prerequisites

1. **ALL-INKL.COM hosting account** with SSH access
2. **Node.js support** on your hosting (check with your provider)
3. **FTP credentials** (already configured in your GitHub Actions)
4. **Domain access** to `dayone-mediagroup.com`
5. **External file hosting** (Google Drive, Dropbox, etc.)

## 🛠️ Deployment Steps

### Step 1: Prepare Local Environment

```bash
# Clone your repository if not already done
git clone https://github.com/yourusername/investor.git
cd investor

# Make deployment script executable
chmod +x deploy-server.sh
```

### Step 2: Set Environment Variables

```bash
# Set your ALL-INKL.COM credentials
export ALL_INKL_HOST="your-server.all-inkl.com"
export ALL_INKL_USERNAME="w00ac8e2"
export ALL_INKL_PASSWORD="your-actual-password"
```

**⚠️ Security Note:** Never commit these credentials to your repository. Use environment variables or GitHub Secrets.

### Step 3: Deploy Server Files

```bash
# Run the deployment script
./deploy-server.sh
```

This script will:
- Create a `server-files/` directory with all necessary files
- Upload everything to `/www/htdocs/w00ac8e2/dayone-mediagroup.com/secure-files/` on your server
- Set up proper file permissions and security

### Step 4: SSH into Your Server

```bash
ssh w00ac8e2@your-server.all-inkl.com
```

### Step 5: Navigate to Server Directory

```bash
cd /www/htdocs/w00ac8e2/dayone-mediagroup.com/secure-files
ls -la
```

You should see:
```
server.js
package.json
start-server.sh
ecosystem.config.js
README.md
uploads/
logs/
.htaccess
```

### Step 6: Install Dependencies

```bash
# Install Node.js dependencies
npm install --production

# Or if you prefer yarn
yarn install --production
```

### Step 7: Start the Server

**Option A: Direct Start (for testing)**
```bash
chmod +x start-server.sh
./start-server.sh
```

**Option B: PM2 Production Deployment (recommended)**
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on server reboot
pm2 startup
```

### Step 8: Verify Deployment

```bash
# Check if server is running
./verify-deployment.sh

# Or manually check
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX...",
  "filesCount": 0,
  "externalFiles": 0,
  "localFiles": 0
}
```

## 🌐 Domain Configuration

### Option A: Subdomain (Recommended)

Create a subdomain like `files.dayone-mediagroup.com` that points to your server on port 3001.

### Option B: Proxy Configuration

Add this to your main domain's `.htaccess` file:

```apache
# Proxy secure file server requests
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
```

### Option C: Port Forwarding

Configure your hosting provider to forward port 3001 to your domain.

## 🔒 Security Configuration

The server includes several security measures:

1. **Admin Authentication**: Required for file management
2. **Secure Tokens**: Unique access tokens for each file
3. **No File Storage**: Files remain on external services
4. **Access Tracking**: Monitor who accesses what and when
5. **Token Validation**: Secure link generation and validation

## 📱 Testing the System

### 1. Test Adding External File

```bash
# Test admin authentication
curl -X POST http://localhost:3001/api/files \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Pitch Deck",
    "fileUrl": "https://drive.google.com/file/d/example/view",
    "adminToken": "TRADEFOOX_SECURE_2024"
  }'
```

### 2. Test File Access

```bash
# Get file list
curl http://localhost:3001/api/files

# Test file access (replace with actual fileId and token)
curl http://localhost:3001/api/download/FILE_ID \
  -H "Authorization: Bearer SECURE_TOKEN"
```

## 🔄 Integration with Frontend

The React frontend has been updated to:

1. **Add external files** instead of uploading
2. **Fetch file metadata** from server
3. **Generate secure links** for sharing
4. **Handle external redirects** to actual files

## 🚨 Troubleshooting

### Server Won't Start

```bash
# Check Node.js version
node --version

# Check if port is in use
netstat -tulpn | grep :3001

# Check logs
tail -f logs/err.log
```

### Files Not Accessible

```bash
# Check if server is running
curl http://localhost:3001/health

# Check files database
cat files-db.json

# Test API endpoints
curl http://localhost:3001/api/files
```

### Access Denied Errors

1. **Check if server is running**: `curl http://localhost:3001/health`
2. **Verify file exists**: Check `files-db.json`
3. **Check token validity**: Verify secure token in database
4. **Check external URL**: Ensure file URL is accessible

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill process if needed
kill -9 PID_NUMBER

# Or change port in server.js and ecosystem.config.js
```

## 📊 Monitoring

### PM2 Monitoring

```bash
# View all processes
pm2 list

# Monitor in real-time
pm2 monit

# View logs
pm2 logs tradefoox-secure-server

# Restart server
pm2 restart tradefoox-secure-server
```

### Health Checks

```bash
# Manual health check
curl http://localhost:3001/health

# Check file count
curl http://localhost:3001/api/files | jq length
```

## 🔄 Updates and Maintenance

### Update Server

```bash
# Pull latest changes
git pull origin main

# Redeploy
./deploy-server.sh

# Restart server
pm2 restart tradefoox-secure-server
```

### Backup Database

```bash
# Backup files database
cp files-db.json files-db-backup-$(date +%Y%m%d).json

# Backup to external location
scp files-db.json user@backup-server:/backups/
```

## 📈 Performance Optimization

1. **No File Storage**: Server only manages metadata
2. **Fast Redirects**: Instant file access via external URLs
3. **Minimal Resources**: Lightweight Node.js server
4. **CDN Integration**: Use CloudFlare for additional performance

## 🔐 Production Security Checklist

- [ ] Change default admin token
- [ ] Implement proper JWT authentication
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Monitor access logs
- [ ] Regular security updates

## 📞 Support

If you encounter issues:

1. **Check server logs**: `tail -f logs/err.log`
2. **Verify configuration**: Check all environment variables
3. **Test endpoints**: Use curl commands above
4. **Check permissions**: Ensure proper file/directory permissions

## 🎯 Expected Results

After successful deployment:

✅ **No file uploads needed** - use existing cloud services  
✅ **All users can access files** via secure links  
✅ **No more "Access Denied" errors** for valid links  
✅ **Centralized file management** for admins  
✅ **Secure file access** with proper authentication  
✅ **Professional investor experience** maintained  
✅ **Instant file access** via external redirects  

## 🚀 Next Steps

1. **Deploy the server** using the script above
2. **Upload files to cloud services** (Google Drive, Dropbox, etc.)
3. **Add file metadata** to the server
4. **Generate secure sharing links**
5. **Share links with investors**
6. **Monitor usage** and access patterns

## 🔄 Workflow Example

### For Each Pitch Deck:

1. **Upload to Google Drive**
   - Create shareable link
   - Set appropriate permissions

2. **Add to Server**
   - File name: "TRADEFOOX Series A Pitch Deck"
   - File URL: "https://drive.google.com/file/d/.../view"

3. **Generate Secure Link**
   - Server creates: `https://dayone-mediagroup.com/#/pitch-deck-access/TOKEN/FILE_ID`

4. **Share with Investors**
   - Send secure link via email
   - Link works for all users immediately

5. **Track Access**
   - Monitor who accessed what
   - Track access counts and timestamps

---

**Built with ❤️ for TRADEFOOX investors**

*This deployment will resolve your current access issues and provide a robust, scalable solution for secure file sharing without the need for server storage.*
