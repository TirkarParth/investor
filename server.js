const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// File storage configuration
const uploadDir = path.join(__dirname, 'uploads');
const filesDbPath = path.join(__dirname, 'files-db.json');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Initialize files database
let filesDatabase = [];
if (fs.existsSync(filesDbPath)) {
  try {
    filesDatabase = JSON.parse(fs.readFileSync(filesDbPath, 'utf8'));
  } catch (error) {
    console.error('Error reading files database:', error);
    filesDatabase = [];
  }
}

// Save files database
const saveFilesDatabase = () => {
  try {
    fs.writeFileSync(filesDbPath, JSON.stringify(filesDatabase, null, 2));
  } catch (error) {
    console.error('Error saving files database:', error);
  }
};

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const adminToken = req.headers.authorization || req.body.adminToken;
  
  if (adminToken === 'TRADEFOOX_SECURE_2024') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

// Generate secure token
const generateSecureToken = (fileId) => {
  const timestamp = Date.now();
  const randomHash = crypto.randomBytes(16).toString('hex');
  return Buffer.from(`${fileId}_${timestamp}_${randomHash}`).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
};

// Routes

// Get all files
app.get('/api/files', (req, res) => {
  try {
    const files = filesDatabase.map(file => ({
      id: file.id,
      name: file.name,
      size: file.size,
      uploadDate: file.uploadDate,
      accessCount: file.accessCount,
      lastAccessed: file.lastAccessed,
      serverPath: file.serverPath,
      secureToken: file.secureToken,
      fileUrl: file.fileUrl,
      isLocalFile: file.isLocalFile || false
    }));
    
    res.json(files);
  } catch (error) {
    console.error('Error getting files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add external file (no file upload, just metadata)
app.post('/api/files', authenticateAdmin, (req, res) => {
  try {
    const { name, fileUrl, adminToken, isLocalFile } = req.body;
    
    if (!name || !fileUrl) {
      return res.status(400).json({ error: 'File name and URL are required' });
    }

    const fileId = 'pitch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const secureToken = generateSecureToken(fileId);
    
    const newFile = {
      id: fileId,
      name: name,
      size: 0, // Unknown size for external files
      uploadDate: new Date().toISOString(),
      accessCount: 0,
      fileUrl: fileUrl,
      secureToken: secureToken,
      isLocalFile: isLocalFile || false
    };

    // Add to database
    filesDatabase.push(newFile);
    saveFilesDatabase();

    res.json({
      success: true,
      fileId: newFile.id,
      secureToken: newFile.secureToken,
      message: isLocalFile ? 'Local PDF added successfully' : 'External file added successfully'
    });

  } catch (error) {
    console.error('Error adding file:', error);
    res.status(500).json({ error: 'Failed to add file' });
  }
});

// Update files list
app.post('/api/pitch-deck/files', authenticateAdmin, (req, res) => {
  try {
    const { files } = req.body;
    
    if (Array.isArray(files)) {
      filesDatabase = files;
      saveFilesDatabase();
      res.json({ success: true, message: 'Files list updated' });
    } else {
      res.status(400).json({ error: 'Invalid files data' });
    }
  } catch (error) {
    console.error('Error updating files list:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Get file metadata
app.get('/api/download/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const { authorization } = req.headers;
    
    const file = filesDatabase.find(f => f.id === fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Basic token validation (in production, implement proper JWT validation)
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid authorization' });
    }

    const token = authorization.replace('Bearer ', '');
    if (token !== file.secureToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Return file metadata
    res.json({
      name: file.name,
      type: file.isLocalFile ? 'application/pdf' : (file.fileUrl ? 'external' : 'application/octet-stream'),
      serverPath: file.serverPath,
      fileUrl: file.fileUrl,
      isLocalFile: file.isLocalFile || false,
      size: file.size
    });

  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download file (for local files only)
app.get('/api/download/:fileId/download', (req, res) => {
  try {
    const { fileId } = req.params;
    const { authorization } = req.headers;
    
    const file = filesDatabase.find(f => f.id === fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Basic token validation
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid authorization' });
    }

    const token = authorization.replace('Bearer ', '');
    if (token !== file.secureToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // For external files, redirect to the URL
    if (file.fileUrl && !file.isLocalFile) {
      return res.redirect(file.fileUrl);
    }

    // For local PDF files, serve them directly
    if (file.isLocalFile && file.fileUrl) {
      // Extract the file path from the URL
      const filePath = path.join(__dirname, 'public', file.fileUrl);
      
      if (fs.existsSync(filePath)) {
        // Set appropriate headers for PDF viewing
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);
        
        // Stream the PDF file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        return;
      }
    }

    // For local files, check if they exist on server
    if (!file.serverPath) {
      return res.status(404).json({ error: 'File not available for download' });
    }

    const filePath = path.join(uploadDir, file.serverPath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Update access count
    file.accessCount = (file.accessCount || 0) + 1;
    file.lastAccessed = new Date().toISOString();
    saveFilesDatabase();

    // Send file
    res.download(filePath, file.name);

  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Delete file
app.delete('/api/files/:fileId', authenticateAdmin, (req, res) => {
  try {
    const { fileId } = req.params;
    
    const fileIndex = filesDatabase.findIndex(f => f.id === fileId);
    
    if (fileIndex === -1) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = filesDatabase[fileIndex];
    
    // Remove file from disk if it's a local file
    if (file.serverPath && !file.fileUrl) {
      const filePath = path.join(uploadDir, file.serverPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove from database
    filesDatabase.splice(fileIndex, 1);
    saveFilesDatabase();

    res.json({ success: true, message: 'File deleted' });

  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    filesCount: filesDatabase.length,
    externalFiles: filesDatabase.filter(f => f.fileUrl && !f.isLocalFile).length,
    localFiles: filesDatabase.filter(f => f.isLocalFile).length,
    serverFiles: filesDatabase.filter(f => !f.fileUrl).length
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`TRADEFOOX Secure File Server running on port ${PORT}`);
  console.log(`Upload directory: ${uploadDir}`);
  console.log(`Files database: ${filesDbPath}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Mode: External file management + Local PDF support`);
});

module.exports = app;
