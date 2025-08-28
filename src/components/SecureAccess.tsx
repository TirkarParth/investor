import React, { useEffect, useState } from 'react';
import SecurePitchDeck from './SecurePitchDeck';
import SecureFileAccess from './SecureFileAccess';

const SecureAccess: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<'admin' | 'file-access' | null>(null);
  const [routeParams, setRouteParams] = useState<{ fileId?: string; secureToken?: string }>({});

  useEffect(() => {
    // Parse the current URL to determine the route
    const path = window.location.pathname;
    
    if (path.includes('/pitch-deck-access/')) {
      // Extract parameters from secure file access URL
      const pathParts = path.split('/');
      if (pathParts.length >= 4) {
        const secureToken = pathParts[2];
        const fileId = pathParts[3];
        
        setRouteParams({ fileId, secureToken });
        setCurrentRoute('file-access');
      } else {
        // Invalid URL format
        setCurrentRoute('admin');
      }
    } else if (path.includes('/admin') || path.includes('/secure')) {
      // Admin panel route
      setCurrentRoute('admin');
    } else {
      // Default to admin panel
      setCurrentRoute('admin');
    }
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      
      if (path.includes('/pitch-deck-access/')) {
        const pathParts = path.split('/');
        if (pathParts.length >= 4) {
          const secureToken = pathParts[2];
          const fileId = pathParts[3];
          
          setRouteParams({ fileId, secureToken });
          setCurrentRoute('file-access');
        }
      } else {
        setCurrentRoute('admin');
        setRouteParams({});
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Function to navigate to admin panel
  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentRoute('admin');
    setRouteParams({});
  };

  // Function to navigate to file access
  const navigateToFileAccess = (fileId: string, secureToken: string) => {
    const path = `/pitch-deck-access/${secureToken}/${fileId}`;
    window.history.pushState({}, '', path);
    setCurrentRoute('file-access');
    setRouteParams({ fileId, secureToken });
  };

  // Function to navigate back to main site
  const navigateToMain = () => {
    window.history.pushState({}, '', '/');
    setCurrentRoute('admin');
    setRouteParams({});
  };

  // Expose navigation functions globally for the SecurePitchDeck component
  useEffect(() => {
    (window as any).navigateToFileAccess = navigateToFileAccess;
    (window as any).navigateToAdmin = navigateToAdmin;
    
    return () => {
      delete (window as any).navigateToFileAccess;
      delete (window as any).navigateToAdmin;
    };
  }, []);

  if (currentRoute === null) {
    // Loading state
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Loading secure access...</p>
        </div>
      </div>
    );
  }

  if (currentRoute === 'file-access' && routeParams.fileId && routeParams.secureToken) {
    return (
      <SecureFileAccess 
        fileId={routeParams.fileId}
        secureToken={routeParams.secureToken}
      />
    );
  }

  // Default to admin panel
  return <SecurePitchDeck />;
};

export default SecureAccess;
