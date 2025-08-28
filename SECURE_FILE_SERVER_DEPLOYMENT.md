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
- Stores files on your FTP server
- Provides secure API endpoints for file access
- Manages file permissions and access tokens
- Allows all users to access uploaded files

## 📋 Prerequisites

1. **ALL-INKL.COM hosting account** with SSH access
2. **Node.js support** on your hosting (check with your provider)
3. **FTP credentials** (already configured in your GitHub Actions)
4. **Domain access** to `dayone-mediagroup.com`

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
  "filesCount": 0
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

1. **File Type Validation**: Only allows PDF, PPT, PPTX, DOC, DOCX files
2. **Size Limits**: Maximum 50MB per file
3. **Admin Authentication**: Required for uploads/deletions
4. **Secure Tokens**: Unique access tokens for each file
5. **Directory Protection**: Uploads directory is hidden from direct access

## 📱 Testing the System

### 1. Test File Upload

```bash
# Test admin authentication
curl -X POST http://localhost:3001/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test-file.pdf" \
  -F "adminToken=TRADEFOOX_SECURE_2024"
```

### 2. Test File Access

```bash
# Get file list
curl http://localhost:3001/api/files

# Test file download (replace with actual fileId and token)
curl http://localhost:3001/api/download/FILE_ID \
  -H "Authorization: Bearer SECURE_TOKEN"
```

## 🔄 Integration with Frontend

The React frontend has been updated to:

1. **Upload files to server** instead of local storage
2. **Fetch files from server** when available
3. **Fallback to local storage** for development
4. **Use secure tokens** for file access

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

### Files Not Uploading

```bash
# Check uploads directory permissions
ls -la uploads/

# Check server logs
tail -f logs/out.log

# Test API endpoint
curl -X GET http://localhost:3001/api/files
```

### Access Denied Errors

1. **Check if server is running**: `curl http://localhost:3001/health`
2. **Verify file exists**: Check `files-db.json`
3. **Check token validity**: Verify secure token in database
4. **Check file permissions**: Ensure files are readable

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

### Backup Files

```bash
# Backup uploads directory
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Backup database
cp files-db.json files-db-backup-$(date +%Y%m%d).json
```

## 📈 Performance Optimization

1. **File Compression**: Consider compressing large files
2. **CDN Integration**: Use CloudFlare or similar for file delivery
3. **Database Optimization**: For large file counts, consider using a proper database
4. **Caching**: Implement Redis for session management

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

✅ **Files are stored on server** instead of browser storage  
✅ **All users can access uploaded files** via secure links  
✅ **No more "Access Denied" errors** for valid links  
✅ **Centralized file management** for admins  
✅ **Secure file access** with proper authentication  
✅ **Professional investor experience** maintained  

## 🚀 Next Steps

1. **Deploy the server** using the script above
2. **Test file uploads** and downloads
3. **Share secure links** with investors
4. **Monitor usage** and access patterns
5. **Scale as needed** for growing investor base

---

**Built with ❤️ for TRADEFOOX investors**

*This deployment will resolve your current access issues and provide a robust, scalable solution for secure file sharing.*
