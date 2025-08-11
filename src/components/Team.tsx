import React from 'react';
import { Users, Award, Code, Palette, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Function to detect mobile device and redirect to appropriate app store
const redirectToAppStore = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Check if it's iOS
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    window.open('https://apps.apple.com/de/app/tradefoox/id6477870055', '_blank');
  }
  // Check if it's Android
  else if (/android/i.test(userAgent)) {
    window.open('https://play.google.com/store/apps/details?id=app.tradefoox.mobile', '_blank');
  }
  // For desktop, open the website profile
  else {
    window.open('https://tradefoox.com/profile/aa200115-1bae-4915-b54f-5700ce5544f0', '_blank');
  }
};

const Team: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="team" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('team.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Founder Section */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="block group hover:scale-105 transition-transform duration-200 cursor-pointer">
                <div 
                  className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6"
                  onClick={redirectToAppStore}
                >
                  <img 
                    src={process.env.PUBLIC_URL + '/images/investors/ceo.jpeg'} 
                    alt={t('team.founder.name')}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{t('team.founder.name')}</h3>
              </div>
              <p className="text-primary-600 font-semibold mb-4">{t('team.founder.title')}</p>
              <p className="text-gray-600 leading-relaxed">
                {t('team.founder.description')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">{t('team.founder.expertise.economics')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Code className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">{t('team.founder.expertise.tech')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">{t('team.founder.expertise.growth')}</span>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">{t('team.interdisciplinary.title')}</h3>
              <p className="text-lg opacity-90 mb-6">
                {t('team.interdisciplinary.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">{t('team.interdisciplinary.roles.design.title')}</h4>
                  <p className="text-sm opacity-90">{t('team.interdisciplinary.roles.design.description')}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">{t('team.interdisciplinary.roles.development.title')}</h4>
                  <p className="text-sm opacity-90">{t('team.interdisciplinary.roles.development.description')}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">{t('team.interdisciplinary.roles.sales.title')}</h4>
                  <p className="text-sm opacity-90">{t('team.interdisciplinary.roles.sales.description')}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('team.dna.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('team.dna.description')}
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('team.dna.expertise.title')}</h4>
                  <p className="text-sm text-gray-600">{t('team.dna.expertise.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team; 