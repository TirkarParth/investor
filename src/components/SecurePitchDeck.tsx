import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Trash2, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface PitchDeckFile {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  accessCount: number;
  lastAccessed?: Date;
}

const SecurePitchDeck: React.FC = () => {
  const [files, setFiles] = useState<PitchDeckFile[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const adminPasswordRef = useRef<HTMLInputElement>(null);

  // Load files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('pitchDeckFiles');
    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles));
      } catch (error) {
        console.error('Error loading saved files:', error);
      }
    }
  }, []);

  // Save files to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem('pitchDeckFiles', JSON.stringify(files));
  }, [files]);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Create file object
      const newFile: PitchDeckFile = {
        id: generateSecureId(),
        name: file.name,
        size: file.size,
        uploadDate: new Date(),
        accessCount: 0
      };

      // Store file data (in production, this would upload to a server)
      const fileData = await file.arrayBuffer();
      localStorage.setItem(`pitchDeck_${newFile.id}`, JSON.stringify({
        name: file.name,
        data: Array.from(new Uint8Array(fileData)),
        type: file.type
      }));

      setFiles(prev => [...prev, newFile]);
    }

    setIsUploading(false);
    setUploadProgress(0);
    setMessage(`${selectedFiles.length} file(s) uploaded successfully`);
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileDownload = (fileId: string) => {
    const fileData = localStorage.getItem(`pitchDeck_${fileId}`);
    if (!fileData) return;

    try {
      const { name, data, type } = JSON.parse(fileData);
      const blob = new Blob([new Uint8Array(data)], { type });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);

      // Update access count and last accessed
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, accessCount: file.accessCount + 1, lastAccessed: new Date() }
          : file
      ));

      setMessage('File downloaded successfully');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error downloading file');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFileDelete = (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      // Remove file data
      localStorage.removeItem(`pitchDeck_${fileId}`);
      
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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

  const generateSecureToken = (fileId: string) => {
    // Generate a complex, non-guessable token
    const timestamp = Date.now();
    const randomHash = Math.random().toString(36).substr(2, 15);
    const secureToken = btoa(`${fileId}_${timestamp}_${randomHash}`).replace(/[^a-zA-Z0-9]/g, '');
    
    return secureToken;
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
              <p className="text-gray-300">Secure upload and access management for investor materials</p>
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

        {/* Upload Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Upload New Files</h2>
          
          <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">Drag and drop files here or click to browse</p>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {isUploading ? 'Uploading...' : 'Select Files'}
            </button>

            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-gray-300 mt-2">{uploadProgress}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Uploaded Files</h2>
          
          {files.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No files uploaded yet</p>
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
                        <span>Uploaded: {formatDate(file.uploadDate)}</span>
                        <span>Downloads: {file.accessCount}</span>
                        {file.lastAccessed && (
                          <span>Last: {formatDate(file.lastAccessed)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                                             <button
                         onClick={() => {
                           const secureToken = generateSecureToken(file.id);
                           const secureLink = generateSecureLink(file.id);
                           copyToClipboard(secureLink);
                         }}
                         className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                         title="Copy secure link"
                       >
                         <Eye className="w-4 h-4" />
                         <span>Copy Link</span>
                       </button>
                      
                      <button
                        onClick={() => handleFileDownload(file.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
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
