import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(true);
  const { t } = useTranslation();

  // Function to close mobile menu
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const heroHeight = window.innerHeight;
      
      // Make header transparent when at the top (over hero section)
      setIsTransparent(scrollTop < heroHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent 
        ? 'bg-transparent border-transparent' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src={process.env.PUBLIC_URL + '/images/logo/dayonelogo-removebg-preview.png'} 
              alt="One Media Company Logo" 
              className={`h-12 w-auto transition-all duration-300 ${
                isTransparent 
                  ? 'drop-shadow-2xl filter brightness-0 invert' 
                  : ''
              }`}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#vision" className={`transition-colors ${isTransparent ? 'text-white hover:text-yellow-300' : 'text-gray-600 hover:text-primary-600'}`}>
              {t('navigation.vision')}
            </a>
            <a href="#features" className={`transition-colors ${isTransparent ? 'text-white hover:text-yellow-300' : 'text-gray-600 hover:text-primary-600'}`}>
              {t('navigation.features')}
            </a>
            <a href="#traction" className={`transition-colors ${isTransparent ? 'text-white hover:text-yellow-300' : 'text-gray-600 hover:text-primary-600'}`}>
              {t('navigation.traction')}
            </a>
            <a href="#team" className={`transition-colors ${isTransparent ? 'text-white hover:text-yellow-300' : 'text-gray-600 hover:text-primary-600'}`}>
              {t('navigation.team')}
            </a>
            <a href="#contact" className={`transition-all duration-200 ${isTransparent ? 'bg-white/20 text-white border-white hover:bg-white hover:text-primary-600' : 'btn-primary'}`}>
              {t('navigation.getInTouch')}
            </a>
            <LanguageSwitcher />
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${isTransparent ? 'text-white' : 'text-gray-600'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isTransparent ? 'text-white' : 'text-gray-600'}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden ${isTransparent ? 'bg-gradient-to-b from-black/95 to-black/85 backdrop-blur-xl' : 'bg-white shadow-lg'}`}>

            
            {/* Navigation Links */}
            <nav className="px-6 py-6">
              <div className="flex flex-col space-y-1">
                <a 
                  href="#vision" 
                  onClick={closeMobileMenu}
                  className={`group flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 ${
                    isTransparent 
                      ? 'text-white hover:bg-white/10 hover:text-yellow-300' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <span className="font-medium">{t('navigation.vision')}</span>
                  <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    isTransparent ? 'bg-yellow-300/50 group-hover:bg-yellow-300' : 'bg-primary-300/50 group-hover:bg-primary-500'
                  }`}></div>
                </a>
                
                <a 
                  href="#features" 
                  onClick={closeMobileMenu}
                  className={`group flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 ${
                    isTransparent 
                      ? 'text-white hover:bg-white/10 hover:text-yellow-300' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <span className="font-medium">{t('navigation.features')}</span>
                  <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    isTransparent ? 'bg-yellow-300/50 group-hover:bg-yellow-300' : 'bg-primary-300/50 group-hover:bg-primary-500'
                  }`}></div>
                </a>
                
                <a 
                  href="#traction" 
                  onClick={closeMobileMenu}
                  className={`group flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 ${
                    isTransparent 
                      ? 'text-white hover:bg-white/10 hover:text-yellow-300' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <span className="font-medium">{t('navigation.traction')}</span>
                  <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    isTransparent ? 'bg-yellow-300/50 group-hover:bg-yellow-300' : 'bg-primary-300/50 group-hover:bg-primary-500'
                  }`}></div>
                </a>
                
                <a 
                  href="#team" 
                  onClick={closeMobileMenu}
                  className={`group flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 ${
                    isTransparent 
                      ? 'text-white hover:bg-white/10 hover:text-yellow-300' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <span className="font-medium">{t('navigation.team')}</span>
                  <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    isTransparent ? 'bg-yellow-300/50 group-hover:bg-yellow-300' : 'bg-primary-300/50 group-hover:bg-primary-500'
                  }`}></div>
                </a>
              </div>
            </nav>
            
            {/* Action Buttons */}
            <div className="px-6 pb-6 space-y-3">
              <a 
                href="#contact" 
                onClick={closeMobileMenu}
                className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isTransparent 
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95' 
                    : 'btn-primary'
                }`}
              >
                {t('navigation.getInTouch')}
              </a>
              
              {/* Language Switcher at the bottom */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 