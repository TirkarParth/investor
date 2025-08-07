import React from 'react';
import { Globe, Smartphone, Monitor, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GlobalScale: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-purple-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('globalScale.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('globalScale.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Features */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Languages className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('globalScale.features.languages.title')}
                </h3>
                <p className="text-gray-600">
                  {t('globalScale.features.languages.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('globalScale.features.strategy.title')}
                </h3>
                <p className="text-gray-600">
                  {t('globalScale.features.strategy.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('globalScale.features.mobile.title')}
                </h3>
                <p className="text-gray-600">
                  {t('globalScale.features.mobile.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Monitor className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('globalScale.features.web.title')}
                </h3>
                <p className="text-gray-600">
                  {t('globalScale.features.web.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <div className="text-2xl font-bold text-primary-600 mb-1">5</div>
                  <div className="text-sm text-gray-600">{t('globalScale.stats.languages')}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 mb-1">3</div>
                  <div className="text-sm text-gray-600">{t('globalScale.stats.continents')}</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">2</div>
                  <div className="text-sm text-gray-600">{t('globalScale.stats.mobileOS')}</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600 mb-1">1</div>
                  <div className="text-sm text-gray-600">{t('globalScale.stats.webApp')}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">German</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-full h-2 bg-primary-600 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">English</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-full h-2 bg-primary-600 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Spanish</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-20 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">French</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-16 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Portuguese</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-12 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalScale; 