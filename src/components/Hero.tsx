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
const videoTexts = [
  {
    title: "Vision",
    subtitle: "Invest in the European answer to super apps.",
    description: "With strong investors by our side, TRADEFOOX will become the next global success story – standing shoulder to shoulder with TikTok, Amazon, and Meta. Together, we will inspire the world and set new standards for digital super apps."
  },
  {
    title: "Mission",
    subtitle: "We build the technologies needed to connect people and drive growth.",
    description: "We're committed to creating platforms that bring people together and enable sustainable business growth across Europe."
  },
  {
    title: "What We Do",
    subtitle: "Our innovations help people connect through chats, news feeds, and video feeds.",
    description: "We enable individuals and businesses to grow on a single platform, fostering meaningful connections and opportunities."
  },
  {
    title: "Our Approach",
    subtitle: "We focus on technology, innovation, and meaningful connections.",
    description: "By combining cutting-edge technology with human-centered design, we create solutions that truly matter to our users."
  }
];

const Hero: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videosLoaded, setVideosLoaded] = useState<boolean[]>(new Array(4).fill(false));
  const [allVideosLoaded, setAllVideosLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sectionUnlocked, setSectionUnlocked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [videoQuality, setVideoQuality] = useState<'mobile' | 'desktop'>('desktop');
  const [textAnimationKey, setTextAnimationKey] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [textPosition, setTextPosition] = useState(0);
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
        setTextAnimationKey(prev => prev + 1); // Trigger text animation
        setScrollProgress(0); // Reset scroll progress
        setTextPosition(0); // Reset text position
        
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
        setTextAnimationKey(prev => prev + 1); // Trigger text animation
        setScrollProgress(0); // Reset scroll progress
        setTextPosition(0); // Reset text position
        
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
    setTextAnimationKey(prev => prev + 1); // Reset text animation
    setScrollProgress(0); // Reset scroll progress
    setTextPosition(0); // Reset text position
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
        newProgress = Math.min(scrollProgress + (scrollAmount / 10), maxScroll);
      } else {
        newProgress = Math.max(scrollProgress - (scrollAmount / 10), 0);
      }
      setScrollProgress(newProgress);

      // Map progress to position with clamping for first and last text
      let newPosition = 100 - (newProgress / maxScroll) * 200;
      if (currentVideoIndex === 0) {
        // First text: clamp between 0 (middle) and -100 (top)
        newPosition = Math.max(Math.min(newPosition, 0), -100);
      } else if (currentVideoIndex === videos.length - 1) {
        // Last text: clamp between 100 (bottom) and 0 (middle)
        newPosition = Math.max(Math.min(newPosition, 100), 0);
      }
      setTextPosition(newPosition);

      // Navigation logic at ends
      if (newProgress >= maxScroll && currentVideoIndex < videos.length - 1) {
        // Move to next video, reset progress and set text to start below (100vh)
        handleVideoNavigation('next');
        setScrollProgress(0);
        setTextPosition(100);
      } else if (newProgress <= 0 && currentVideoIndex > 0) {
        // Move to previous video, reset progress and set text to start above (-100vh)
        handleVideoNavigation('prev');
        setScrollProgress(maxScroll);
        setTextPosition(-100);
      } else if (newProgress >= maxScroll && currentVideoIndex === videos.length - 1) {
        setSectionUnlocked(true);
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
  }, [videos.length, allVideosLoaded, currentVideoIndex, isTransitioning, sectionUnlocked, isVisible, handleVideoNavigation, scrollProgress]);

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
              touchEndY.current = touch.clientY; // Reset end position
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              // Update end position during move for better accuracy
              const touch = e.touches[0];
              touchEndY.current = touch.clientY;
            }}
            onTouchEnd={(e) => {
              const touch = e.changedTouches[0];
              touchEndY.current = touch.clientY;
              const touchDiff = touchStartY.current - touchEndY.current;
              const minSwipeDistance = 50;
              
              console.log('Touch detected:', {
                start: touchStartY.current,
                end: touchEndY.current,
                diff: touchDiff,
                threshold: minSwipeDistance
              });
              
              // Handle video navigation based on swipe direction
              if (Math.abs(touchDiff) >= minSwipeDistance) {
                if (touchDiff > 0) {
                  // Swipe up - go to next video
                  console.log('Swipe UP detected - going to next video');
                  handleVideoNavigation('next');
                } else {
                  // Swipe down - go to previous video
                  console.log('Swipe DOWN detected - going to previous video');
                  handleVideoNavigation('prev');
                }
              }
            }}
          />
        )}
      </div>

      {/* Content - Scroll-responsive text overlay that spans entire screen */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Text container that spans the entire screen height */}
        <div 
          className="relative w-full h-full"
          style={{
            transform: `translateY(${textPosition}vh)`,
            transition: isScrolling.current ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {/* Text positioned to be visible across the entire screen */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center px-4">
            <div className="text-center max-w-5xl mx-auto w-full">
              {/* Dynamic Video-Specific Text */}
              <div key={textAnimationKey} className="overflow-hidden">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 text-white drop-shadow-2xl leading-tight">
                  {videoTexts[currentVideoIndex].title}
                </h2>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium mb-6 sm:mb-8 text-white/90 drop-shadow-2xl max-w-4xl mx-auto leading-relaxed">
                  {videoTexts[currentVideoIndex].subtitle}
                </p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 drop-shadow-2xl max-w-4xl mx-auto leading-relaxed">
                  {videoTexts[currentVideoIndex].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 