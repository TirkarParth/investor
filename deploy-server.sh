#!/bin/bash

# TRADEFOOX Secure File Server Deployment Script
# This script deploys the secure file server to your ALL-INKL.COM hosting

echo "🚀 Starting TRADEFOOX Secure File Server Deployment..."

# Configuration
FTP_HOST="${ALL_INKL_HOST:-your-server.all-inkl.com}"
FTP_USER="${ALL_INKL_USERNAME:-w00ac8e2}"
FTP_PASS="${ALL_INKL_PASSWORD:-your-password}"
REMOTE_DIR="/www/htdocs/w00ac8e2/dayone-mediagroup.com/secure-files"
LOCAL_DIR="./server-files"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
if [ -z "$ALL_INKL_HOST" ] || [ -z "$ALL_INKL_USERNAME" ] || [ -z "$ALL_INKL_PASSWORD" ]; then
    print_warning "Environment variables not set. Using default values from script."
    print_warning "Please set ALL_INKL_HOST, ALL_INKL_USERNAME, and ALL_INKL_PASSWORD"
fi

# Create local server files directory
print_status "Creating local server files directory..."
mkdir -p "$LOCAL_DIR"

# Copy server files
print_status "Copying server files..."
cp server.js "$LOCAL_DIR/"
cp server-package.json "$LOCAL_DIR/package.json"

# Create uploads directory
mkdir -p "$LOCAL_DIR/uploads"

# Create .htaccess for security (hide uploads directory)
cat > "$LOCAL_DIR/.htaccess" << 'EOF'
# Secure file access
<Files "files-db.json">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>

# Protect uploads directory
<Directory "uploads">
    Order allow,deny
    Deny from all
</Directory>

# Allow only specific file types
<FilesMatch "\.(pdf|ppt|pptx|doc|docx)$">
    Order allow,deny
    Allow from all
</FilesMatch>
EOF

# Create server startup script
cat > "$LOCAL_DIR/start-server.sh" << 'EOF'
#!/bin/bash
echo "Starting TRADEFOOX Secure File Server..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install Node.js on your server."
    exit 1
fi

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "Installing dependencies..."
    npm install --production
fi

# Start the server
echo "Starting server on port 3001..."
node server.js
EOF

chmod +x "$LOCAL_DIR/start-server.sh"

# Create PM2 ecosystem file for production deployment
cat > "$LOCAL_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [{
    name: 'tradefoox-secure-server',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p "$LOCAL_DIR/logs"

# Create README for server
cat > "$LOCAL_DIR/README.md" << 'EOF'
# TRADEFOOX Secure File Server

This server provides secure access to pitch deck files for TRADEFOOX investors.

## Setup

1. Install Node.js (v16 or higher)
2. Run: `npm install`
3. Start server: `node server.js`

## API Endpoints

- `GET /api/files` - List all files
- `POST /api/upload` - Upload new file (admin only)
- `GET /api/download/:fileId` - Get file metadata
- `GET /api/download/:fileId/download` - Download file
- `DELETE /api/files/:fileId` - Delete file (admin only)

## Security

- Admin token required for uploads/deletions
- Secure tokens for file access
- File type validation
- Size limits (50MB max)

## Files

- `uploads/` - Stored files
- `files-db.json` - File database
- `logs/` - Server logs
EOF

# Create deployment verification script
cat > "$LOCAL_DIR/verify-deployment.sh" << 'EOF'
#!/bin/bash
echo "Verifying TRADEFOOX Secure File Server deployment..."

# Check if server is running
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Server is running and healthy"
else
    echo "❌ Server is not responding"
fi

# Check if uploads directory exists
if [ -d "uploads" ]; then
    echo "✅ Uploads directory exists"
else
    echo "❌ Uploads directory missing"
fi

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "✅ Package.json exists"
else
    echo "❌ Package.json missing"
fi

echo "Deployment verification complete."
EOF

chmod +x "$LOCAL_DIR/verify-deployment.sh"

print_status "Local server files prepared in: $LOCAL_DIR"

# Deploy to FTP server
print_status "Deploying to FTP server: $FTP_HOST"

# Use lftp for better FTP handling
if command -v lftp &> /dev/null; then
    print_status "Using lftp for deployment..."
    
    lftp -c "
        set ssl:verify-certificate no
        open -u $FTP_USER,$FTP_PASS $FTP_HOST
        mkdir -p $REMOTE_DIR
        cd $REMOTE_DIR
        mirror --reverse --delete --verbose $LOCAL_DIR .
        bye
    "
    
    if [ $? -eq 0 ]; then
        print_status "✅ Server deployed successfully to FTP!"
    else
        print_error "❌ FTP deployment failed"
        exit 1
    fi
else
    # Fallback to curl for FTP upload
    print_warning "lftp not found, using curl fallback..."
    
    # Upload files one by one
    for file in $(find "$LOCAL_DIR" -type f); do
        remote_path="${file#$LOCAL_DIR/}"
        print_status "Uploading: $remote_path"
        
        curl -T "$file" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST$REMOTE_DIR/$remote_path"
        
        if [ $? -eq 0 ]; then
            print_status "✅ Uploaded: $remote_path"
        else
            print_error "❌ Failed to upload: $remote_path"
        fi
    done
fi

print_status "🎉 Deployment complete!"
print_status "Server files deployed to: $REMOTE_DIR"
print_status ""
print_status "Next steps:"
print_status "1. SSH into your server: ssh $FTP_USER@$FTP_HOST"
print_status "2. Navigate to: $REMOTE_DIR"
print_status "3. Run: chmod +x start-server.sh"
print_status "4. Start server: ./start-server.sh"
print_status ""
print_status "Or use PM2 for production:"
print_status "1. Install PM2: npm install -g pm2"
print_status "2. Start: pm2 start ecosystem.config.js"
print_status "3. Monitor: pm2 monit"
print_status ""
print_status "Verify deployment: ./verify-deployment.sh"
