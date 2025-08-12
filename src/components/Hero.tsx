import React, { useState, useEffect, useRef } from 'react';
import { FileText, Play, Mail, ArrowRight, Loader2 } from 'lucide-react';
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
  const sectionRef = useRef<HTMLElement>(null);
  const lastWheelTime = useRef<number>(0);

  // Get video quality on mount and window resize
  useEffect(() => {
    const updateVideoQuality = () => {
      const newQuality = getVideoQuality();
      if (newQuality !== videoQuality) {
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

  // Array of video sources with quality detection
  const getVideos = () => {
    const videoNames = ['1', '2', '3', '4'];
    return videoNames.map(name => {
      const sources = getVideoSources(name);
      // Fallback to desktop if mobile video doesn't exist
      return sources[videoQuality] || sources.desktop;
    });
  };

  const videos = getVideos();

  // Check if all videos are loaded
  useEffect(() => {
    if (videosLoaded.every(loaded => loaded)) {
      setAllVideosLoaded(true);
    }
  }, [videosLoaded]);

  // Reset video loading state when quality changes
  useEffect(() => {
    setVideosLoaded(new Array(4).fill(false));
    setAllVideosLoaded(false);
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
    setVideosLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  // Handle mouse wheel events to change videos
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
      
      // Only process if not currently transitioning
      if (isTransitioning) {
        return;
      }

      if (event.deltaY > 0) {
        // Scroll down - go to next video
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
      } else if (event.deltaY < 0) {
        // Scroll up - go to previous video (always allowed, even when unlocked)
        if (currentVideoIndex > 0) {
          setIsTransitioning(true);
          setCurrentVideoIndex(prev => prev - 1);
          
          // Reset transition state after animation completes
          setTimeout(() => {
            setIsTransitioning(false);
          }, 1000);
        }
      }

      lastWheelTime.current = now;
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (section) {
        section.removeEventListener('wheel', handleWheel);
      }
    };
  }, [videos.length, allVideosLoaded, currentVideoIndex, isTransitioning, sectionUnlocked, isVisible]);

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
    >
      {/* Loading Overlay */}
      {!allVideosLoaded && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-yellow-300 animate-spin mx-auto mb-4" />
            <div className="text-white text-xl mb-2">Loading Videos...</div>
            <div className="text-white/70 text-sm mb-2">
              {videosLoaded.filter(loaded => loaded).length} of {videos.length} videos loaded
            </div>
            <div className="text-yellow-300 text-sm mb-4">
              Quality: {videoQuality === 'mobile' ? 'Mobile Optimized' : 'High Quality'}
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              {videosLoaded.map((loaded, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    loaded ? 'bg-yellow-300' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Background Videos */}
      <div className="absolute inset-0 w-full h-full">
        {videos.map((videoSrc, index) => (
          <video
            key={index}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => handleVideoLoad(index)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
            }`}
            poster={`${process.env.PUBLIC_URL}/images/video/poster.jpg`}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
        
        {/* Video Progress Indicator */}
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
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 h-full flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto w-full">
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