import React from 'react';
import { FileText, Play, Mail, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative text-white overflow-hidden h-screen">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster={`${process.env.PUBLIC_URL}/images/video/poster.jpg`}
        >
          <source 
            src={`${process.env.PUBLIC_URL}/images/video/595863_Drone_Landscape_Nature_3840x2160.mp4`} 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        
        {/* No overlay - video is now clearly visible */}
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
              className="btn-secondary flex items-center space-x-2 group w-full sm:w-auto justify-center px-4 py-3 text-sm sm:text-base"
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