import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FileText, Play, Mail, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getVideoQuality, getVideoSources } from '../utils/deviceDetection';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videosLoaded, setVideosLoaded] = useState<boolean[]>(new Array(4).fill(false));
  const [allVideosLoaded, setAllVideosLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sectionUnlocked, setSectionUnlocked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [videoQuality, setVideoQuality] = useState<'mobile' | 'desktop'>('desktop');
  const [swipeFeedback, setSwipeFeedback] = useState<'up' | 'down' | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const lastWheelTime = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  // Get video quality on mount and window resize
  useEffect(() => {
    const updateVideoQuality = () => {
      const newQuality = getVideoQuality();
      console.log('Device detection:', {
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        hasTouch: 'ontouchstart' in window,
        maxTouchPoints: navigator.maxTouchPoints,
        quality: newQuality,
        currentQuality: videoQuality
      });
      if (newQuality !== videoQuality) {
        console.log('Quality changed from', videoQuality, 'to', newQuality);
        setVideoQuality(newQuality);
      }
    };

    // Set initial quality
    updateVideoQuality();

    // Update on window resize
    window.addEventListener('resize', updateVideoQuality);
    
    return () => {
      window.removeEventListener('resize', updateVideoQuality);
    };
  }, [videoQuality]);

  // Array of video sources with quality detection - memoized to prevent recreation
  const videos = useMemo(() => {
    const videoNames = ['1', '2', '3', '4'];
    const videoSources = videoNames.map(name => {
      const sources = getVideoSources(name);
      // Fallback to desktop if mobile video doesn't exist
      const finalSource = sources[videoQuality] || sources.desktop;
      console.log(`Video ${name} sources:`, { 
        mobile: sources.mobile, 
        desktop: sources.desktop, 
        selected: finalSource, 
        quality: videoQuality 
      });
      return finalSource;
    });
    console.log('Final video sources:', videoSources);
    return videoSources;
  }, [videoQuality]);

  // Debug: Log videos array whenever it changes
  useEffect(() => {
    console.log('Videos array updated:', videos);
  }, [videos]);

  // Debug: Log video loading state
  useEffect(() => {
    console.log('Video loading state:', {
      videosLoaded,
      allVideosLoaded,
      currentVideoIndex,
      totalVideos: videos.length
    });
  }, [videosLoaded, allVideosLoaded, currentVideoIndex, videos.length]);

  // Video navigation function - wrapped in useCallback to prevent recreation
  const handleVideoNavigation = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioning) {
      return;
    }

    if (direction === 'next') {
      if (currentVideoIndex < videos.length - 1) {
        setIsTransitioning(true);
        setCurrentVideoIndex(prev => prev + 1);
        
        // Reset transition state after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1000);
      } else if (currentVideoIndex === videos.length - 1) {
        // We're at the last video, unlock the section
        setSectionUnlocked(true);
      }
    } else if (direction === 'prev') {
      if (currentVideoIndex > 0) {
        setIsTransitioning(true);
        setCurrentVideoIndex(prev => prev - 1);
        
        // Reset transition state after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1000);
      }
    }
  }, [currentVideoIndex, videos.length, isTransitioning]);

  // Check if all videos are loaded
  useEffect(() => {
    if (videosLoaded.every(loaded => loaded)) {
      setAllVideosLoaded(true);
    }
  }, [videosLoaded]);

  // Set allVideosLoaded to true immediately for better UX
  useEffect(() => {
    // Remove the loading delay - show videos immediately
    setAllVideosLoaded(true);
  }, []);

  // Reset video loading state when quality changes
  useEffect(() => {
    setVideosLoaded(new Array(4).fill(false));
    setAllVideosLoaded(true); // Keep this true to avoid loading screen
    setCurrentVideoIndex(0);
  }, [videoQuality]);

  // Check if hero section is visible on the page
  useEffect(() => {
    const checkVisibility = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Section is visible if it's at least 50% in the viewport
        const isSectionVisible = rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.5;
        
        // If section becomes invisible and was previously locked, unlock it
        if (!isSectionVisible && !sectionUnlocked && allVideosLoaded) {
          setSectionUnlocked(true);
        }
        
        setIsVisible(isSectionVisible);
      }
    };

    // Check on mount and scroll
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [sectionUnlocked, allVideosLoaded]);

  // Handle video load events
  const handleVideoLoad = (index: number) => {
    console.log(`Video ${index} loaded successfully:`, videos[index]);
    setVideosLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      console.log('Updated videos loaded state:', newState);
      return newState;
    });
  };

  // Handle video load errors
  const handleVideoError = (index: number, error: any) => {
    console.error(`Video ${index} failed to load:`, videos[index], error);
  };

  // Handle video navigation (wheel and touch events)
  useEffect(() => {
    if (!allVideosLoaded || !isVisible) return;

    const handleWheel = (event: WheelEvent) => {
      // Check if the hero section is fully visible on the page
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Only handle wheel events if the section is fully visible (at least 80% of it)
        const isFullyVisible = rect.top >= 0 && rect.bottom <= viewportHeight && 
                              (rect.bottom - rect.top) >= (sectionHeight * 0.8);
        
        if (!isFullyVisible) {
          return;
        }

        // Reset section state when user returns to hero section after going through the page
        if (sectionUnlocked && isFullyVisible && currentVideoIndex === 0) {
          setSectionUnlocked(false);
        }
      }

      // If section is unlocked and scrolling down, allow normal page scrolling
      if (sectionUnlocked && event.deltaY > 0) {
        return;
      }

      // For all other cases (including scroll up when unlocked), handle video navigation
      event.preventDefault();
      
      const now = Date.now();
      const timeSinceLastWheel = now - lastWheelTime.current;
      
      // Only process wheel events if enough time has passed (debounce)
      if (timeSinceLastWheel < 300) {
        return;
      }

      if (event.deltaY > 0) {
        handleVideoNavigation('next');
      } else if (event.deltaY < 0) {
        handleVideoNavigation('prev');
      }

      lastWheelTime.current = now;
    };

    const section = sectionRef.current;
    if (section) {
      // Add wheel event listener for desktop
      section.addEventListener('wheel', handleWheel, { passive: false });
      
      // Note: Touch events are now handled by the dedicated touch overlay
      // for better mobile compatibility
    }

    return () => {
      if (section) {
        section.removeEventListener('wheel', handleWheel);
      }
    };
  }, [videos.length, allVideosLoaded, currentVideoIndex, isTransitioning, sectionUnlocked, isVisible, handleVideoNavigation]);

  // Cleanup effect to ensure scroll is unlocked on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Simple effect to unlock scroll when at top of page (fixes logo click issue)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        // At the very top, ensure scroll is unlocked
        document.body.style.overflow = 'unset';
        setSectionUnlocked(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple scroll locking only during initial video experience
  useEffect(() => {
    if (allVideosLoaded && !sectionUnlocked && isVisible) {
      // Only lock scroll if section is visible and not unlocked
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock scroll in all other cases
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [allVideosLoaded, sectionUnlocked, isVisible]);

  return (
    <section 
      ref={sectionRef} 
      className={`relative text-white overflow-hidden h-screen ${
        allVideosLoaded && !sectionUnlocked && isVisible ? 'fixed inset-0 z-40' : ''
      }`}
      style={{
        // Ensure proper touch handling on mobile
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch'
      }}
    >


      {/* Background Videos */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          // Ensure touch events are captured properly
          touchAction: 'none',
          pointerEvents: 'auto'
        }}
      >
        {videos.map((videoSrc, index) => (
          <video
            key={`${videoQuality}-${index}-${videoSrc}`}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => handleVideoLoad(index)}
            onError={(e) => handleVideoError(index, e)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
            }`}
            poster={`${process.env.PUBLIC_URL}/images/video/poster.jpg`}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
        
        {/* Video Progress Indicator with Mobile Optimization */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20">
          <div className="flex flex-col space-y-3">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentVideoIndex 
                    ? 'bg-yellow-300 scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Last Video Text - Only show on last video for mobile */}
        {videoQuality === 'mobile' && !sectionUnlocked && currentVideoIndex === videos.length - 1 && (
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20">
            <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-2 text-white/90 text-sm font-medium">
              Last Video
            </div>
          </div>
        )}

        {/* Mobile Swipe Hint - Only show on mobile devices */}
        {videoQuality === 'mobile' && !sectionUnlocked && (
          <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 z-20 text-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 border-t-2 border-white/60 rounded-t-full"></div>
                  <div className="w-4 h-4 border-b-2 border-white/60 rounded-b-full mt-1"></div>
                </div>
                <span>Swipe to navigate videos</span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Buttons - Fallback for touch navigation */}
        {videoQuality === 'mobile' && !sectionUnlocked && (
          <div className="absolute left-1/2 bottom-20 transform -translate-x-1/2 z-20 flex space-x-4">
            <button
              onClick={() => {
                if (currentVideoIndex > 0 && !isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentVideoIndex(prev => prev - 1);
                  setTimeout(() => setIsTransitioning(false), 1000);
                }
              }}
              disabled={currentVideoIndex === 0 || isTransitioning}
              className={`p-3 rounded-full transition-all duration-200 ${
                currentVideoIndex === 0 || isTransitioning
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-white/30 text-white hover:bg-white/50 active:scale-95'
              }`}
              aria-label="Previous video"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => {
                if (currentVideoIndex < videos.length - 1 && !isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentVideoIndex(prev => prev + 1);
                  setTimeout(() => setIsTransitioning(false), 1000);
                } else if (currentVideoIndex === videos.length - 1) {
                  setSectionUnlocked(true);
                }
              }}
              disabled={isTransitioning}
              className={`p-3 rounded-full transition-all duration-200 ${
                isTransitioning
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-white/30 text-white hover:bg-white/50 active:scale-95'
              }`}
              aria-label="Next video"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            </button>
          </div>
        )}

        {/* Dedicated Touch Overlay for Mobile Swipe Detection */}
        {videoQuality === 'mobile' && !sectionUnlocked && (
          <div 
            className="absolute inset-0 z-30"
            style={{
              touchAction: 'none',
              pointerEvents: 'auto'
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              touchStartY.current = touch.clientY;
            }}
            onTouchMove={(e) => {
              e.preventDefault();
            }}
            onTouchEnd={(e) => {
              const touch = e.changedTouches[0];
              touchEndY.current = touch.clientY;
              const touchDiff = touchStartY.current - touchEndY.current;
              const minSwipeDistance = 50;
              
              // Handle video navigation based on swipe direction
              if (Math.abs(touchDiff) >= minSwipeDistance) {
                if (touchDiff > 0) {
                  // Swipe up - go to next video
                  setSwipeFeedback('up');
                  handleVideoNavigation('next');
                  // Clear feedback after animation
                  setTimeout(() => setSwipeFeedback(null), 1000);
                } else {
                  // Swipe down - go to previous video
                  setSwipeFeedback('down');
                  handleVideoNavigation('prev');
                  // Clear feedback after animation
                  setTimeout(() => setSwipeFeedback(null), 1000);
                }
              }
            }}
          />
        )}

        {/* Swipe Feedback Animation */}
        {swipeFeedback && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className={`bg-yellow-300/80 text-black px-6 py-3 rounded-full font-bold text-lg transform transition-all duration-500 ${
              swipeFeedback === 'up' 
                ? 'animate-bounce translate-y-[-100px]' 
                : 'animate-bounce translate-y-[100px]'
            }`}>
              {swipeFeedback === 'up' ? '↑ Next Video' : '↓ Previous Video'}
            </div>
          </div>
        )}
      </div>

      {/* Content - with lower z-index to prevent touch event conflicts */}
      <div className="container-custom relative z-10 h-full flex items-center justify-center px-4 pointer-events-none">
        <div className="text-center max-w-4xl mx-auto w-full pointer-events-auto">
          {/* Badge - Commented out since badge text was removed */}
          {/* <div className="inline-flex items-center px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full text-sm font-medium mb-8 text-white">
            {t('hero.badge')}
          </div> */}

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-white drop-shadow-2xl">
            {t('hero.title')}{' '}
            <span className="text-yellow-300 drop-shadow-2xl whitespace-nowrap">{t('hero.titleHighlight')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-2xl px-2">
            {t('hero.subtitle')}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 w-full max-w-md sm:max-w-none mx-auto">
            <a 
              href="#contact" 
              className="btn-primary flex items-center space-x-2 group w-full sm:w-auto justify-center px-4 py-3 text-sm sm:text-base"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('hero.cta.pitchDeck')}</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a 
              href="#video" 
              className="btn-secondary flex items-center space-x-2 group w-full sm:w-auto justify-center px-4 py-2 text-sm sm:text-base"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('hero.cta.watchVideo')}</span>
            </a>
            
            <a 
              href="#contact" 
              className="btn-outline text-white border-white hover:bg-white hover:text-primary-600 flex items-center space-x-2 group w-full sm:w-auto justify-center px-4 py-3 text-sm sm:text-base"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('hero.cta.getInTouch')}</span>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-1 sm:mb-2 drop-shadow-2xl">19</div>
              <div className="text-sm sm:text-base text-white drop-shadow-2xl">{t('hero.stats.languages')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-1 sm:mb-2 drop-shadow-2xl">5M+</div>
              <div className="text-sm sm:text-base text-white drop-shadow-2xl">{t('hero.stats.users')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-1 sm:mb-2 drop-shadow-2xl">6</div>
              <div className="text-sm sm:text-base text-white drop-shadow-2xl">{t('hero.stats.features')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 