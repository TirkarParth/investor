import React from 'react';
import { Target, Globe, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Vision: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="vision" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('vision.title')}
          </h2>
          <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-8">
            {t('vision.tagline')}
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t('vision.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg card-hover">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('vision.cards.european.title')}</h3>
            <p className="text-gray-600">
              {t('vision.cards.european.description')}
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg card-hover">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('vision.cards.global.title')}</h3>
            <p className="text-gray-600">
              {t('vision.cards.global.description')}
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg card-hover">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('vision.cards.userCentric.title')}</h3>
            <p className="text-gray-600">
              {t('vision.cards.userCentric.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision; 