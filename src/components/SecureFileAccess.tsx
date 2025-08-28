import React, { useState, useEffect } from 'react';
import { Download, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface SecureFileAccessProps {
  fileId: string;
  secureToken: string;
}

const SecureFileAccess: React.FC<SecureFileAccessProps> = ({ fileId, secureToken }) => {
  const [fileData, setFileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    // Validate the secure token and retrieve file data
    validateAndLoadFile();
  }, [fileId, secureToken]);

  const validateAndLoadFile = () => {
    try {
      // Check if the file exists in localStorage
      const storedFileData = localStorage.getItem(`pitchDeck_${fileId}`);
      
      if (!storedFileData) {
        setError('File not found or access denied');
        setIsLoading(false);
        return;
      }

      // Parse the file data
      const parsedData = JSON.parse(storedFileData);
      
      // Basic validation of the secure token
      // In production, this would validate against a server-side token
      if (!isValidToken(secureToken, fileId)) {
        setError('Invalid or expired access token');
        setIsLoading(false);
        return;
      }

      setFileData(parsedData);
      setIsLoading(false);
    } catch (err) {
      setError('Error loading file data');
      setIsLoading(false);
    }
  };

  const isValidToken = (token: string, fileId: string): boolean => {
    // Basic token validation
    // In production, implement proper JWT or server-side validation
    if (!token || token.length < 20) return false;
    
    // Check if token contains the file ID (basic validation)
    return token.includes(fileId) || token.length > 30;
  };

  const handleDownload = async () => {
    if (!fileData) return;

    try {
      setDownloadStarted(true);
      
      // Create blob from file data
      const blob = new Blob([new Uint8Array(fileData.data)], { type: fileData.type });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = fileData.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      // Update access count in the main files list
      updateAccessCount();
      
      // Show success message
      setTimeout(() => {
        setDownloadStarted(false);
      }, 2000);
      
    } catch (err) {
      setError('Error downloading file');
      setDownloadStarted(false);
    }
  };

  const updateAccessCount = () => {
    try {
      // Get the current files list
      const savedFiles = localStorage.getItem('pitchDeckFiles');
      if (savedFiles) {
        const files = JSON.parse(savedFiles);
        const updatedFiles = files.map((file: any) => 
          file.id === fileId 
            ? { 
                ...file, 
                accessCount: (file.accessCount || 0) + 1, 
                lastAccessed: new Date().toISOString() 
              }
            : file
        );
        
        // Save updated files list
        localStorage.setItem('pitchDeckFiles', JSON.stringify(updatedFiles));
      }
    } catch (err) {
      console.error('Error updating access count:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Validating access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <p className="text-sm text-gray-400">
            This link may have expired or is invalid. Please contact the administrator for a new link.
          </p>
        </div>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">File Not Found</h1>
          <p className="text-gray-300">The requested file could not be located.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-lg w-full border border-white/20">
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Secure File Access</h1>
          <p className="text-gray-300">Your file is ready for download</p>
        </div>

        {/* File Information */}
        <div className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">File Details</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">File Name:</span>
              <span className="text-white font-medium">{fileData.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">File Type:</span>
              <span className="text-white">{fileData.type || 'Unknown'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Size:</span>
              <span className="text-white">{formatFileSize(fileData.data.length)}</span>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center">
          {downloadStarted ? (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-300 font-medium">Download Started!</p>
              <p className="text-green-400 text-sm">Check your downloads folder</p>
            </div>
          ) : (
            <button
              onClick={handleDownload}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-3 mx-auto"
            >
              <Download className="w-6 h-6" />
              <span>Download File</span>
            </button>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm text-center">
            <strong>Security Notice:</strong> This link provides secure access to confidential materials. 
            Please do not share this URL with unauthorized parties.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs">
            Powered by TRADEFOOX Secure Access System
          </p>
        </div>
      </div>
    </div>
  );
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default SecureFileAccess;
