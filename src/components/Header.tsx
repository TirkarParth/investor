import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(true);
  const { t } = useTranslation();

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
              src={process.env.PUBLIC_URL + '/images/logo/logo.svg'} 
              alt="One Media Company Logo" 
              className="h-12 w-auto"
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
          <div className={`md:hidden py-4 border-t ${isTransparent ? 'border-white/20' : 'border-gray-200'}`}>
            <nav className="flex flex-col space-y-4">
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
              <a href="#contact" className={`inline-block text-center transition-all duration-200 ${isTransparent ? 'bg-white/20 text-white border border-white hover:bg-white hover:text-primary-600' : 'btn-primary'}`}>
                {t('navigation.getInTouch')}
              </a>
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 