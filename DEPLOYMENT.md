# Deployment Guide - ALL-INKL.COM

## GitHub Actions Setup

This project uses GitHub Actions to automatically deploy to ALL-INKL.COM when you push to the main branch.

### Required Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

#### **ALL_INKL_HOST**
- Your ALL-INKL.COM server hostname
- Example: `your-server.all-inkl.com`

#### **ALL_INKL_USERNAME**
- Your ALL-INKL.COM username
- Example: `w00ac8e2`

#### **ALL_INKL_PASSWORD**
- Your ALL-INKL.COM password
- The password for your hosting account

#### **ALL_INKL_SSH_KEY** (Optional - Alternative method)
- Your SSH private key for key-based authentication
- Only needed if you prefer SSH key authentication over password

### How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret with the exact names above

### Deployment Process

1. **Push to main branch** - Triggers automatic deployment
2. **GitHub Actions builds** - Runs `npm run build`
3. **Files uploaded** - Deployed to `/dayone-mediagroup.com/`
4. **Site updated** - Available at `https://dayone-mediagroup.com`

### Manual Deployment

You can also trigger deployment manually:
1. Go to **Actions** tab in GitHub
2. Select **Deploy to ALL-INKL.COM** workflow
3. Click **Run workflow**

### Troubleshooting

- Check **Actions** tab for deployment logs
- Verify secrets are correctly set
- Ensure ALL-INKL.COM credentials are valid
- Check file permissions on server 