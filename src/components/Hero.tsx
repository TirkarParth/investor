import React from 'react';
import { FileText, Play, Mail, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative text-white section-padding pt-24 overflow-hidden">
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
        
        {/* Lighter Gradient Overlay for better video visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 via-primary-800/30 to-purple-900/40"></div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
            {t('hero.badge')}
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
            {t('hero.title')}{' '}
            <span className="text-yellow-300 drop-shadow-lg">{t('hero.titleHighlight')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            {t('hero.subtitle')}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a 
              href="#contact" 
              className="btn-primary flex items-center space-x-2 group"
            >
              <FileText className="w-5 h-5" />
              <span>{t('hero.cta.pitchDeck')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a 
              href="#video" 
              className="btn-secondary flex items-center space-x-2 group"
            >
              <Play className="w-5 h-5" />
              <span>{t('hero.cta.watchVideo')}</span>
            </a>
            
            <a 
              href="#contact" 
              className="btn-outline text-white border-white hover:bg-white hover:text-primary-600 flex items-center space-x-2 group"
            >
              <Mail className="w-5 h-5" />
              <span>{t('hero.cta.getInTouch')}</span>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2 drop-shadow-lg">19</div>
              <div className="text-gray-200 drop-shadow-lg">{t('hero.stats.languages')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2 drop-shadow-lg">5M+</div>
              <div className="text-gray-200 drop-shadow-lg">{t('hero.stats.users')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2 drop-shadow-lg">6</div>
              <div className="text-gray-200 drop-shadow-lg">{t('hero.stats.features')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 