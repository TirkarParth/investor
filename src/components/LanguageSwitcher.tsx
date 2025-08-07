import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <div className="flex space-x-1">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-2 py-1 text-xs rounded ${
            i18n.language === 'en' || i18n.language.startsWith('en')
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } transition-colors`}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage('de')}
          className={`px-2 py-1 text-xs rounded ${
            i18n.language === 'de' || i18n.language.startsWith('de')
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } transition-colors`}
        >
          DE
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 