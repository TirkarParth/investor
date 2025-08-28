import React, { useState, useEffect, useCallback } from 'react';
import { Download, AlertTriangle, CheckCircle, FileText, Server, ExternalLink, Eye } from 'lucide-react';

interface SecureFileAccessProps {
  fileId: string;
  secureToken: string;
}

interface FileData {
  name: string;
  data?: number[];
  type?: string;
  serverPath?: string;
  fileUrl?: string; // External file URL
  isLocalFile?: boolean; // Indicates if it's a local PDF file
}

const SecureFileAccess: React.FC<SecureFileAccessProps> = ({ fileId, secureToken }) => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [isExternalFile, setIsExternalFile] = useState(false);
  const [isLocalFile, setIsLocalFile] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  // Server configuration
  const SERVER_CONFIG = {
    baseUrl: 'https://dayone-mediagroup.com',
    apiEndpoint: '/api/pitch-deck',
    downloadEndpoint: '/api/download'
  };

  const validateAndLoadFile = useCallback(async () => {
    try {
      // First try to get file from server
      const serverFileData = await fetchFileFromServer(fileId, secureToken);
      
      if (serverFileData) {
        setFileData(serverFileData);
        setIsExternalFile(!!serverFileData.fileUrl);
        setIsLocalFile(!!serverFileData.isLocalFile);
        setIsLoading(false);
        return;
      }

      // Fallback to local storage if server is not available
      let storedFileData = localStorage.getItem(`pitchDeck_${fileId}`);
      
      if (!storedFileData) {
        storedFileData = sessionStorage.getItem(`pitchDeck_${fileId}`);
      }
      
      if (!storedFileData) {
        setError('File not found or access denied');
        setIsLoading(false);
        return;
      }

      // Parse the file data
      const parsedData = JSON.parse(storedFileData);
      
      // Basic validation of the secure token
      if (!isValidToken(secureToken, fileId)) {
        setError('Invalid or expired access token');
        setIsLoading(false);
        return;
      }

      setFileData(parsedData);
      setIsExternalFile(!!parsedData.fileUrl);
      setIsLocalFile(!!parsedData.isLocalFile);
      setIsLoading(false);
    } catch (err) {
      setError('Error loading file data');
      setIsLoading(false);
    }
  }, [fileId, secureToken]);

  const fetchFileFromServer = async (fileId: string, secureToken: string): Promise<FileData | null> => {
    try {
      // Check if we're in a deployed environment
      if (window.location.hostname === 'dayone-mediagroup.com' || 
          window.location.hostname === 'www.dayone-mediagroup.com') {
        
        // Try to fetch file from server
        const response = await fetch(`${SERVER_CONFIG.baseUrl}${SERVER_CONFIG.downloadEndpoint}/${fileId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${secureToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const serverFileData = await response.json();
          return {
            name: serverFileData.name,
            data: serverFileData.data,
            type: serverFileData.type,
            serverPath: serverFileData.serverPath,
            fileUrl: serverFileData.fileUrl,
            isLocalFile: serverFileData.isLocalFile
          };
        }
      }
      
      // Return null if server is not available
      return null;
    } catch (error) {
      console.error('Error fetching file from server:', error);
      return null;
    }
  };

  useEffect(() => {
    // Validate the secure token and retrieve file data
    validateAndLoadFile();
  }, [validateAndLoadFile]);

  const isValidToken = (token: string, fileId: string): boolean => {
    // Basic token validation
    // In production, implement proper JWT or server-side validation
    if (!token || token.length < 20) return false;
    
    // Check if token contains the file ID (basic validation)
    return token.includes(fileId) || token.length > 30;
  };

  const handleAccessFile = async () => {
    if (!fileData) return;

    try {
      setDownloadStarted(true);
      
      if (isLocalFile && fileData.fileUrl) {
        // For local PDF files, show PDF viewer
        setShowPDFViewer(true);
        
        // Update access count
        updateAccessCount();
        
        setTimeout(() => {
          setDownloadStarted(false);
        }, 2000);
        
      } else if (isExternalFile && fileData.fileUrl) {
        // For external files, redirect to the actual file URL
        window.open(fileData.fileUrl, '_blank');
        
        // Update access count
        updateAccessCount();
        
        setTimeout(() => {
          setDownloadStarted(false);
        }, 2000);
        
      } else if (fileData.data) {
        // For local files, try to download from server first
        if (fileData.serverPath && window.location.hostname === 'dayone-mediagroup.com') {
          const downloadSuccess = await downloadFromServer(fileId, secureToken, fileData.name);
          if (downloadSuccess) {
            // Update access count
            updateAccessCount();
            setTimeout(() => setDownloadStarted(false), 2000);
            return;
          }
        }
        
        // Fallback to local download
        const blob = new Blob([new Uint8Array(fileData.data)], { type: fileData.type || 'application/octet-stream' });
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
        
        // Update access count
        updateAccessCount();
        
        // Show success message
        setTimeout(() => {
          setDownloadStarted(false);
        }, 2000);
      }
      
    } catch (err) {
      setError('Error accessing file');
      setDownloadStarted(false);
    }
  };

  const downloadFromServer = async (fileId: string, secureToken: string, fileName: string): Promise<boolean> => {
    try {
      const response = await fetch(`${SERVER_CONFIG.baseUrl}${SERVER_CONFIG.downloadEndpoint}/${fileId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secureToken}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error downloading from server:', error);
      return false;
    }
  };

  const updateAccessCount = () => {
    try {
      // Update access count in both localStorage and sessionStorage
      const updateStorage = (storage: Storage) => {
        const savedFiles = storage.getItem('pitchDeckFiles');
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
          storage.setItem('pitchDeckFiles', JSON.stringify(updatedFiles));
        }
      };

      // Update both storages
      updateStorage(localStorage);
      updateStorage(sessionStorage);
    } catch (err) {
      console.error('Error updating access count:', err);
    }
  };

  // PDF Viewer Component
  const PDFViewer = () => {
    if (!fileData?.fileUrl) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gray-100 px-6 py-4 rounded-t-lg flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">{fileData.name}</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  // Download the PDF
                  const link = document.createElement('a');
                  link.href = fileData.fileUrl!;
                  link.download = fileData.name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={() => setShowPDFViewer(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
          
          {/* PDF Content */}
          <div className="flex-1 bg-gray-50 rounded-b-lg overflow-hidden">
            <iframe
              src={`${fileData.fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full border-0"
              title={fileData.name}
            />
          </div>
        </div>
      </div>
    );
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

  // Show PDF viewer if requested
  if (showPDFViewer) {
    return <PDFViewer />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-lg w-full border border-white/20">
        <div className="text-center mb-8">
          {isLocalFile ? (
            <FileText className="w-16 h-16 text-green-400 mx-auto mb-4" />
          ) : isExternalFile ? (
            <ExternalLink className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          ) : (
            <FileText className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          )}
          <h1 className="text-2xl font-bold text-white mb-2">Secure File Access</h1>
          <p className="text-gray-300">
            {isLocalFile ? 'Your PDF is ready to view' : 
             isExternalFile ? 'Your file is ready to access' : 
             'Your file is ready for download'}
          </p>
        </div>

        {/* File Information */}
        <div className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">File Details</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">File Name:</span>
              <span className="text-white font-medium">{fileData.name}</span>
            </div>
            
            {!isExternalFile && !isLocalFile && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">File Type:</span>
                  <span className="text-white">{fileData.type || 'Unknown'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white">
                    {fileData.data ? formatFileSize(fileData.data.length) : 'Unknown'}
                  </span>
                </div>
              </>
            )}
            
            {isLocalFile && (
              <div className="flex justify-between">
                <span className="text-gray-400">File Location:</span>
                <span className="text-green-400">Local PDF</span>
              </div>
            )}
            
            {isExternalFile && !isLocalFile && (
              <div className="flex justify-between">
                <span className="text-gray-400">File Location:</span>
                <span className="text-blue-400">External Source</span>
              </div>
            )}
          </div>
        </div>

        {/* Access Button */}
        <div className="text-center">
          {downloadStarted ? (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-300 font-medium">
                {isLocalFile ? 'PDF Viewer Opening!' : 
                 isExternalFile ? 'File Opened!' : 
                 'Download Started!'}
              </p>
              <p className="text-green-400 text-sm">
                {isLocalFile ? 'PDF will display in browser' : 
                 isExternalFile ? 'Check your browser tabs' : 
                 'Check your downloads folder'}
              </p>
            </div>
          ) : (
            <button
              onClick={handleAccessFile}
              className={`font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-3 mx-auto ${
                isLocalFile 
                  ? 'bg-green-400 hover:bg-green-500 text-white' 
                  : isExternalFile 
                    ? 'bg-blue-400 hover:bg-blue-500 text-white' 
                    : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
              }`}
            >
              {isLocalFile ? (
                <>
                  <Eye className="w-6 h-6" />
                  <span>View PDF</span>
                </>
              ) : isExternalFile ? (
                <>
                  <ExternalLink className="w-6 h-6" />
                  <span>Open File</span>
                </>
              ) : (
                <>
                  <Download className="w-6 h-6" />
                  <span>Download File</span>
                </>
              )}
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
