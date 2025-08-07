import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src={process.env.PUBLIC_URL + '/images/logo/logo.svg'} 
              alt="TRADEFOOX Logo" 
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#vision" className="text-gray-600 hover:text-primary-600 transition-colors">
              {t('navigation.vision')}
            </a>
            <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
              {t('navigation.features')}
            </a>
            <a href="#traction" className="text-gray-600 hover:text-primary-600 transition-colors">
              {t('navigation.traction')}
            </a>
            <a href="#team" className="text-gray-600 hover:text-primary-600 transition-colors">
              {t('navigation.team')}
            </a>
            <a href="#contact" className="btn-primary">
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
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#vision" className="text-gray-600 hover:text-primary-600 transition-colors">
                {t('navigation.vision')}
              </a>
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                {t('navigation.features')}
              </a>
              <a href="#traction" className="text-gray-600 hover:text-primary-600 transition-colors">
                {t('navigation.traction')}
              </a>
              <a href="#team" className="text-gray-600 hover:text-primary-600 transition-colors">
                {t('navigation.team')}
              </a>
              <a href="#contact" className="btn-primary inline-block text-center">
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