export const isMobileDevice = (): boolean => {
  // Check if it's a mobile device based on user agent
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Mobile device regex patterns (more comprehensive)
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
  
  // Check screen size (mobile devices typically have smaller screens)
  const isSmallScreen = window.innerWidth <= 768;
  
  // Check touch capability (most mobile devices support touch)
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check for mobile-specific features
  const hasMobileFeatures = 'orientation' in window || 'devicePixelRatio' in window;
  
  // Check if it's a mobile device based on multiple criteria
  const isMobileByUserAgent = mobileRegex.test(userAgent);
  const isMobileByScreen = isSmallScreen && hasTouchSupport;
  const isMobileByFeatures = hasMobileFeatures && hasTouchSupport;
  
  return isMobileByUserAgent || isMobileByScreen || isMobileByFeatures;
};

export const getVideoQuality = (): 'mobile' | 'desktop' => {
  return isMobileDevice() ? 'mobile' : 'desktop';
};

export const getVideoSources = (baseName: string): { mobile: string; desktop: string } => {
  const publicUrl = process.env.PUBLIC_URL || '';
  
  return {
    mobile: `${publicUrl}/images/video/mobile/${baseName}.mp4`,
    desktop: `${publicUrl}/images/video/${baseName}.mp4`
  };
}; 