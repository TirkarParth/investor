import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Trash2, Eye, EyeOff, Lock, Unlock, Link, Copy, FileText, FolderOpen } from 'lucide-react';

interface PitchDeckFile {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  accessCount: number;
  lastAccessed?: Date;
  serverPath?: string;
  secureToken?: string;
  fileUrl?: string; // Direct file URL for already uploaded files
  isLocalFile?: boolean; // Indicates if it's a local PDF file
}

const SecurePitchDeck: React.FC = () => {
  const [files, setFiles] = useState<PitchDeckFile[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileName, setNewFileName] = useState('');
  
  const adminPasswordRef = useRef<HTMLInputElement>(null);

  // Server configuration
  const SERVER_CONFIG = {
    baseUrl: 'https://dayone-mediagroup.com',
    apiEndpoint: '/api/pitch-deck',
    filesEndpoint: '/api/files'
  };

  // Available local PDF files (manually specified)
  const availableLocalPDFs = [
    'Pich Deck English.pdf'
  ];

  // Load files from server on component mount
  useEffect(() => {
    if (isAdmin) {
      loadFilesFromServer();
    }
  }, [isAdmin]);

  const loadFilesFromServer = useCallback(async () => {
    try {
      setIsLoadingFiles(true);
      
      // First try to load from server
      const serverFiles = await fetchFilesFromServer();
      
      if (serverFiles && serverFiles.length > 0) {
        setFiles(serverFiles);
        // Also save to local storage as backup
        localStorage.setItem('pitchDeckFiles', JSON.stringify(serverFiles));
        sessionStorage.setItem('pitchDeckFiles', JSON.stringify(serverFiles));
      } else {
        // Fallback to local storage if server is not available
        const loadFiles = () => {
          try {
            const savedFiles = sessionStorage.getItem('pitchDeckFiles');
            if (savedFiles) {
              const parsedFiles = JSON.parse(savedFiles);
              const filesWithDates = parsedFiles.map((file: any) => ({
                ...file,
                uploadDate: file.uploadDate ? new Date(file.uploadDate) : new Date(),
                lastAccessed: file.lastAccessed ? new Date(file.lastAccessed) : undefined
              }));
              setFiles(filesWithDates);
            }
            
            const localFiles = localStorage.getItem('pitchDeckFiles');
            if (localFiles) {
              const parsedLocalFiles = JSON.parse(localFiles);
              const localFilesWithDates = parsedLocalFiles.map((file: any) => ({
                ...file,
                uploadDate: file.uploadDate ? new Date(file.uploadDate) : new Date(),
                lastAccessed: file.lastAccessed ? new Date(file.lastAccessed) : undefined
              }));
              
              setFiles(prev => {
                const merged = [...prev];
                localFilesWithDates.forEach((localFile: any) => {
                  if (!merged.find(f => f.id === localFile.id)) {
                    merged.push(localFile);
                  }
                });
                return merged;
              });
            }
          } catch (error) {
            console.error('Error loading saved files:', error);
          }
        };

        loadFiles();
      }
    } catch (error) {
      console.error('Error loading files from server:', error);
      // Fallback to local storage
      const savedFiles = sessionStorage.getItem('pitchDeckFiles');
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        const filesWithDates = parsedFiles.map((file: any) => ({
          ...file,
          uploadDate: file.uploadDate ? new Date(file.uploadDate) : new Date(),
          lastAccessed: file.lastAccessed ? new Date(file.lastAccessed) : undefined
        }));
        setFiles(filesWithDates);
      }
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  const fetchFilesFromServer = async (): Promise<PitchDeckFile[]> => {
    try {
      // For now, we'll simulate server communication
      // In production, this would make actual HTTP requests to your server
      
      // Check if we're in a deployed environment
      if (window.location.hostname === 'dayone-mediagroup.com' || 
          window.location.hostname === 'www.dayone-mediagroup.com') {
        
        // Try to fetch from server
        const response = await fetch(`${SERVER_CONFIG.baseUrl}${SERVER_CONFIG.filesEndpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const serverFiles = await response.json();
          return serverFiles.map((file: any) => ({
            ...file,
            uploadDate: file.uploadDate ? new Date(file.uploadDate) : new Date(),
            lastAccessed: file.lastAccessed ? new Date(file.lastAccessed) : undefined
          }));
        }
      }
      
      // Return empty array if server is not available
      return [];
    } catch (error) {
      console.error('Error fetching files from server:', error);
      return [];
    }
  };

  const addExistingFile = () => {
    if (!newFileUrl.trim() || !newFileName.trim()) {
      setMessage('Please provide both file name and URL');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const newFile: PitchDeckFile = {
      id: generateSecureId(),
      name: newFileName.trim(),
      size: 0, // Unknown size for external files
      uploadDate: new Date(),
      accessCount: 0,
      fileUrl: newFileUrl.trim(),
      secureToken: generateSecureToken(),
      isLocalFile: false
    };

    // Add to files list
    setFiles(prev => [...prev, newFile]);
    
    // Save to storage
    const fileMetadata = {
      id: newFile.id,
      name: newFile.name,
      size: newFile.size,
      uploadDate: newFile.uploadDate.toISOString(),
      accessCount: newFile.accessCount,
      fileUrl: newFile.fileUrl,
      secureToken: newFile.secureToken
    };

    localStorage.setItem(`pitchDeck_${newFile.id}`, JSON.stringify(fileMetadata));
    sessionStorage.setItem(`pitchDeck_${newFile.id}`, JSON.stringify(fileMetadata));

    // Update server files list
    updateServerFilesList([...files, newFile]);

    // Clear form
    setNewFileUrl('');
    setNewFileName('');
    
    setMessage('File added successfully');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  const updateServerFilesList = async (filesList: PitchDeckFile[]) => {
    try {
      if (window.location.hostname === 'dayone-mediagroup.com' || 
          window.location.hostname === 'www.dayone-mediagroup.com') {
        
        const response = await fetch(`${SERVER_CONFIG.baseUrl}${SERVER_CONFIG.apiEndpoint}/files`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
                      body: JSON.stringify({
              files: filesList.map(file => ({
                id: file.id,
                name: file.name,
                size: file.size,
                uploadDate: file.uploadDate.toISOString(),
                accessCount: file.accessCount,
                fileUrl: file.fileUrl,
                secureToken: file.secureToken,
                isLocalFile: file.isLocalFile
              })),
              adminToken: 'TRADEFOOX_SECURE_2024'
            }),
        });
        
        if (!response.ok) {
          console.error('Failed to update server files list');
        }
      }
    } catch (error) {
      console.error('Error updating server files list:', error);
    }
  };

  const addLocalPDF = (fileName: string) => {
    const fileUrl = `/images/pdf/${fileName}`;
    const newFile: PitchDeckFile = {
      id: generateSecureId(),
      name: fileName.replace('.pdf', '').replace(/_/g, ' '),
      size: 0, // Unknown size for local files
      uploadDate: new Date(),
      accessCount: 0,
      fileUrl: fileUrl,
      secureToken: generateSecureToken(),
      isLocalFile: true
    };

    // Add to files list
    setFiles(prev => [...prev, newFile]);
    
    // Save to storage
    const fileMetadata = {
      id: newFile.id,
      name: newFile.name,
      size: newFile.size,
      uploadDate: newFile.uploadDate.toISOString(),
      accessCount: newFile.accessCount,
      fileUrl: newFile.fileUrl,
      secureToken: newFile.secureToken,
      isLocalFile: newFile.isLocalFile
    };

    localStorage.setItem(`pitchDeck_${newFile.id}`, JSON.stringify(fileMetadata));
    sessionStorage.setItem(`pitchDeck_${newFile.id}`, JSON.stringify(fileMetadata));

    // Update server files list
    updateServerFilesList([...files, newFile]);

    setMessage(`Local PDF "${newFile.name}" added successfully`);
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  // Check if admin password is correct
  const checkAdminPassword = (password: string) => {
    // For now, use a simple password check for testing
    // In production, implement proper authentication
    const correctPassword = 'TRADEFOOX_SECURE_2024';
    
    // Debug: log the password for troubleshooting
    console.log('Password entered:', password);
    console.log('Expected password:', correctPassword);
    console.log('Password match:', password === correctPassword);
    
    return password === correctPassword;
  };

  const handleAdminLogin = () => {
    if (checkAdminPassword(adminPassword)) {
      setIsAdmin(true);
      setAdminPassword('');
      setMessage('Admin access granted');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Invalid admin password');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFileDownload = (fileId: string) => {
    const fileData = localStorage.getItem(`pitchDeck_${fileId}`);
    if (!fileData) return;

    try {
      const { name, fileUrl } = JSON.parse(fileData);
      
      if (fileUrl) {
        // For external files, open in new tab
        window.open(fileUrl, '_blank');
      } else {
        // Fallback to local download if available
        const localFileData = localStorage.getItem(`pitchDeck_${fileId}`);
        if (localFileData) {
          const { data, type } = JSON.parse(localFileData);
          const blob = new Blob([new Uint8Array(data)], { type });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          URL.revokeObjectURL(url);
        }
      }

      // Update access count and last accessed
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, accessCount: file.accessCount + 1, lastAccessed: new Date() }
          : file
      ));

      setMessage('File accessed successfully');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error accessing file');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFileDelete = (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      // Remove file data from both storages
      localStorage.removeItem(`pitchDeck_${fileId}`);
      sessionStorage.removeItem(`pitchDeck_${fileId}`);
      
      // Remove from files list
      setFiles(prev => prev.filter(file => file.id !== fileId));
      
      setMessage('File deleted successfully');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const generateSecureId = () => {
    return 'pitch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const generateSecureToken = () => {
    const timestamp = Date.now();
    const randomHash = Math.random().toString(36).substr(2, 15);
    return btoa(`${timestamp}_${randomHash}`).replace(/[^a-zA-Z0-9]/g, '');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date | string | undefined) => {
    try {
      // Handle different date formats safely
      let dateObj: Date;
      
      if (typeof date === 'string') {
        dateObj = new Date(date);
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        return 'Unknown date';
      }
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid date';
    }
  };

  const generateSecureLink = (fileId: string) => {
    // Generate a complex, non-guessable URL
    const timestamp = Date.now();
    const randomHash = Math.random().toString(36).substr(2, 15);
    const secureToken = btoa(`${fileId}_${timestamp}_${randomHash}`).replace(/[^a-zA-Z0-9]/g, '');
    
    const baseUrl = window.location.origin;
    const securePath = `/#/pitch-deck-access/${secureToken}/${fileId}`;
    
    return baseUrl + securePath;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage('Link copied to clipboard');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    }).catch(() => {
      setMessage('Failed to copy link');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Secure Access</h1>
            <p className="text-gray-300">Enter admin credentials to access pitch deck management</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                ref={adminPasswordRef}
                type={showPassword ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={handleAdminLogin}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Access Admin Panel
            </button>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              messageType === 'success' ? 'bg-green-500/20 text-green-300' :
              messageType === 'error' ? 'bg-red-500/20 text-red-300' :
              'bg-blue-500/20 text-blue-300'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
                          <div>
                <h1 className="text-3xl font-bold text-white mb-2">Pitch Deck Management</h1>
                <p className="text-gray-300">Manage sharing links for pitch deck files (local PDFs and external files)</p>
              </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <span>← Back to Main Site</span>
              </button>
              
              <button
                onClick={() => setIsAdmin(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add External File Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Add External File</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">File Name</label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="e.g., TRADEFOOX Series A Pitch Deck"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">File URL</label>
              <input
                type="url"
                value={newFileUrl}
                onChange={(e) => setNewFileUrl(e.target.value)}
                placeholder="https://example.com/file.pdf"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            onClick={addExistingFile}
            disabled={!newFileName.trim() || !newFileUrl.trim()}
            className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Link className="w-5 h-5" />
            <span>Add External File</span>
          </button>
          
          <p className="text-gray-400 text-sm mt-2">
            Add files that are already uploaded elsewhere (Google Drive, Dropbox, etc.) to generate secure sharing links.
          </p>
        </div>

        {/* Local PDF Files Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FolderOpen className="w-6 h-6 mr-2 text-blue-400" />
            Local PDF Files
          </h2>
          <p className="text-gray-300 text-sm mb-4">
            Add local PDF files that are hosted on your server.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableLocalPDFs.map((fileName, index) => (
              <button
                key={index}
                onClick={() => addLocalPDF(fileName)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-left flex items-center justify-between"
              >
                <span>{fileName}</span>
                <FileText className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Managed Files</h2>
          
          {isLoadingFiles ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No files added yet. Add your first file above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{file.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <span>{formatFileSize(file.size)}</span>
                        <span>Added: {formatDate(file.uploadDate)}</span>
                        <span>Accesses: {file.accessCount}</span>
                        {file.lastAccessed && (
                          <span>Last: {formatDate(file.lastAccessed)}</span>
                        )}
                        {file.fileUrl && (
                          <span className="text-blue-400">External File</span>
                        )}
                        {file.isLocalFile && (
                          <span className="text-green-400">Local File</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const secureLink = generateSecureLink(file.id);
                          copyToClipboard(secureLink);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        title="Copy secure link"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </button>
                      
                      <button
                        onClick={() => handleFileDownload(file.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        title="Access file"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Access</span>
                      </button>
                      
                      <button
                        onClick={() => handleFileDelete(file.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Display */}
        {message && (
          <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg ${
            messageType === 'success' ? 'bg-green-500 text-white' :
            messageType === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurePitchDeck;
