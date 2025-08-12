export const isMobileDevice = (): boolean => {
  // Check if it's a mobile device based on user agent
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Mobile device regex patterns
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  
  // Check screen size (mobile devices typically have smaller screens)
  const isSmallScreen = window.innerWidth <= 768;
  
  // Check touch capability (most mobile devices support touch)
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return mobileRegex.test(userAgent) || (isSmallScreen && hasTouchSupport);
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