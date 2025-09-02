import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getVideoQuality, getVideoSources } from '../utils/deviceDetection';

// Function to get poster image for each video
const getPosterImage = (videoIndex: number, quality: 'mobile' | 'desktop') => {
  const videoNumber = videoIndex + 1;
  if (quality === 'mobile') {
    return `${process.env.PUBLIC_URL}/images/video/mobile/poster-${videoNumber}.jpg`;
  }
  return `${process.env.PUBLIC_URL}/images/video/poster-${videoNumber}.jpg`;
};

// Video-specific text content - Meta-style messaging
const Hero: React.FC = () => {
  const { t } = useTranslation();

  const videoTexts = [
    {
      title: t('hero.vision.title'),
      subtitle: t('hero.vision.subtitle'),
      description: t('hero.vision.description')
    },
    {
      title: t('hero.mission.title'),
      subtitle: t('hero.mission.subtitle'),
      description: t('hero.mission.description')
    },
    {
      title: t('hero.whatWeDo.title'),
      subtitle: t('hero.whatWeDo.subtitle'),
      description: t('hero.whatWeDo.description')
    },
    {
      title: t('hero.ourApproach.title'),
      subtitle: t('hero.ourApproach.subtitle'),
      description: t('hero.ourApproach.description')
    }
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videosLoaded, setVideosLoaded] = useState<boolean[]>(new Array(4).fill(false));
  const [allVideosLoaded, setAllVideosLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sectionUnlocked, setSectionUnlocked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [videoQuality, setVideoQuality] = useState<'mobile' | 'desktop'>('desktop');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const lastWheelTime = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const scrollDirection = useRef<'up' | 'down'>('down');
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

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
        setActiveVideoIndex(prev => Math.min(prev + 1, videos.length - 1));
        setScrollProgress(0); // Reset scroll progress for next section
        
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
        setActiveVideoIndex(prev => Math.max(prev - 1, 0));
        setScrollProgress(100); // Set to full progress for previous section
        
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
    setScrollProgress(0); // Reset scroll progress
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

  // Handle video navigation (wheel and touch events) with scroll-responsive text
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
      if (timeSinceLastWheel < 50) {
        return;
      }

      // Determine scroll direction
      const direction = event.deltaY > 0 ? 'down' : 'up';
      scrollDirection.current = direction;

      // Set scrolling state
      isScrolling.current = true;
      
      // Clear previous timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Set timeout to detect when scrolling stops
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 150);



  // Calculate scroll progress and text position
  const scrollAmount = Math.abs(event.deltaY);
  const maxScroll = 100; // Maximum scroll amount for full transition

      // Unified scroll logic for up and down
      let newProgress = scrollProgress;
      if (direction === 'down') {
        newProgress = Math.min(scrollProgress + (scrollAmount / 5), maxScroll);
      } else {
        newProgress = Math.max(scrollProgress - (scrollAmount / 5), 0);
      }
      setScrollProgress(newProgress);

      // Switch background video at mid-progress to match next text appearance
      if (currentVideoIndex < videos.length - 1) {
        const midReached = newProgress >= 50;
        const target = midReached ? currentVideoIndex + 1 : currentVideoIndex;
        if (activeVideoIndex !== target) {
          setActiveVideoIndex(target);
        }
      } else {
        // At last slide keep last video active
        if (activeVideoIndex !== currentVideoIndex) {
          setActiveVideoIndex(currentVideoIndex);
        }
      }

      // Navigation logic at segment ends (text changes only at 100%/0%)
      if (newProgress >= maxScroll && currentVideoIndex < videos.length - 1) {
        handleVideoNavigation('next');
        setScrollProgress(0);
      } else if (newProgress <= 0 && currentVideoIndex > 0) {
        handleVideoNavigation('prev');
      } else if (currentVideoIndex === videos.length - 1 && newProgress >= 50) {
        // On last slide: when half progress reached, unlock and move to next section
        if (!sectionUnlocked) {
          setSectionUnlocked(true);
          setTimeout(() => {
            const nextSection = sectionRef.current?.nextElementSibling;
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 50);
        }
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
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [videos.length, allVideosLoaded, currentVideoIndex, isTransitioning, sectionUnlocked, isVisible, handleVideoNavigation, scrollProgress, activeVideoIndex]);

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
              index === activeVideoIndex ? 'opacity-100' : 'opacity-0'
            }`}
            poster={getPosterImage(index, videoQuality)}
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
                onClick={() => { setCurrentVideoIndex(index); setActiveVideoIndex(index); setScrollProgress(0); }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentVideoIndex 
                    ? 'bg-yellow-300 scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Dedicated Touch Overlay for Mobile Progressive Scrolling */}
        {videoQuality === 'mobile' && (
          <div 
            className="absolute inset-0 z-30"
            style={{
              touchAction: 'none',
              pointerEvents: 'auto'
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              touchStartY.current = touch.clientY;
              touchEndY.current = touch.clientY;
              
              // Reset scroll state for new touch
              if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
              }
              isScrolling.current = true;
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              const currentY = touch.clientY;
              const touchDiff = touchStartY.current - currentY;
              
              // Calculate scroll progress based on touch movement
              const maxTouchDistance = 100; // Reduced for more responsive feel
              const scrollAmount = Math.abs(touchDiff);
              const normalizedScroll = Math.min(scrollAmount / maxTouchDistance, 1);
              
              // Map touch movement to scroll progress (more responsive, less smooth)
              let newProgress = scrollProgress;
              if (touchDiff > 0) {
                // Swiping up - increase progress (slower for mobile)
                newProgress = Math.min(scrollProgress + (normalizedScroll * 3), 100);
              } else {
                // Swiping down - decrease progress (slower for mobile)
                newProgress = Math.max(scrollProgress - (normalizedScroll * 3), 0);
              }
              
              setScrollProgress(newProgress);

              // Switch background video at mid-progress to match next text appearance
              if (currentVideoIndex < videos.length - 1) {
                const midReached = newProgress >= 50;
                const target = midReached ? currentVideoIndex + 1 : currentVideoIndex;
                if (activeVideoIndex !== target) {
                  setActiveVideoIndex(target);
                }
              } else {
                if (activeVideoIndex !== currentVideoIndex) {
                  setActiveVideoIndex(currentVideoIndex);
                }
              }
              
              // Update touch end position for final calculation
              touchEndY.current = currentY;
            }}
            onTouchEnd={(e) => {
              const touch = e.changedTouches[0];
              const touchDiff = touchStartY.current - touch.clientY;
              
              console.log('Touch scroll completed:', {
                start: touchStartY.current,
                end: touch.clientY,
                diff: touchDiff,
                finalProgress: scrollProgress,
                currentVideo: currentVideoIndex,
                sectionUnlocked
              });
              
              // Handle navigation based on final scroll progress (text changes only at 100%/0%)
              if (scrollProgress >= 100 && currentVideoIndex < videos.length - 1) {
                console.log('Progress 100% - going to next video');
                handleVideoNavigation('next');
                setScrollProgress(0);
              } else if (scrollProgress <= 0 && currentVideoIndex > 0) {
                console.log('Progress 0% - going to previous video');
                handleVideoNavigation('prev');
              } else if (currentVideoIndex === videos.length - 1 && scrollProgress >= 25) {
                // On last slide: unlock section at half progress and move to next
                console.log('Last video at 50% - unlocking section for mobile');
                setSectionUnlocked(true);
                setScrollProgress(0);
                setTimeout(() => {
                  const nextSection = sectionRef.current?.nextElementSibling;
                  if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 50);
              }
              
              // Reset scrolling state
              isScrolling.current = false;
              scrollTimeout.current = setTimeout(() => {
                isScrolling.current = false;
              }, 150);
            }}
          />
        )}
      </div>

      {/* Content - Single continuous scroll text overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Single continuous text container */}
        <div 
          className="relative w-full"
          style={{
            height: `${videos.length * 100}vh`,
            transform: `translateY(-${currentVideoIndex * 100 + (currentVideoIndex === videos.length - 1 ? Math.min(scrollProgress, 3) : scrollProgress)}vh)`,
            transition: isScrolling.current ? 'none' : 'transform 0.1s linear'
          }}
        >
          {/* All text elements positioned sequentially */}
          {videoTexts.map((text, index) => (
            <div 
              key={`text-${index}`}
              className="absolute top-0 left-0 w-full h-screen flex items-center justify-center px-4"
              style={{
                transform: `translateY(${index * 100}vh)`
              }}
            >
              <div className="text-center max-w-5xl mx-auto w-full">
                <div className="overflow-hidden">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 text-white drop-shadow-2xl leading-tight">
                    {text.title}
                  </h2>
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium mb-6 sm:mb-8 text-white/90 drop-shadow-2xl max-w-4xl mx-auto leading-relaxed">
                    {text.subtitle}
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 drop-shadow-2xl max-w-4xl mx-auto leading-relaxed">
                    {text.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero; 