import React from 'react';
import { DollarSign, Rocket, Shield, Globe, TrendingUp, Calendar, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Investment: React.FC = () => {
  const { t } = useTranslation();

  const reasons = [
    {
      icon: Rocket,
      title: t('investment.reasons.items.platform.title'),
      description: t('investment.reasons.items.platform.description')
    },
    {
      icon: DollarSign,
      title: t('investment.reasons.items.monetization.title'),
      description: t('investment.reasons.items.monetization.description')
    },
    {
      icon: Shield,
      title: t('investment.reasons.items.privacy.title'),
      description: t('investment.reasons.items.privacy.description')
    },
    {
      icon: TrendingUp,
      title: t('investment.reasons.items.growth.title'),
      description: t('investment.reasons.items.growth.description')
    },
    {
      icon: Globe,
      title: t('investment.reasons.items.access.title'),
      description: t('investment.reasons.items.access.description')
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-purple-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('investment.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('investment.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Investment Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('investment.opportunity.title')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Investment Round</span>
                  <span className="font-semibold text-gray-900">{t('investment.opportunity.round')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Focus</span>
                  <span className="font-semibold text-gray-900">{t('investment.opportunity.focus')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Platform Status</span>
                  <span className="font-semibold text-green-600">{t('investment.opportunity.status')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Revenue Streams</span>
                  <span className="font-semibold text-gray-900">{t('investment.opportunity.revenue')}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">{t('investment.reasons.title')}</h3>
              <div className="space-y-4">
                {reasons.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <reason.icon className="w-3 h-3" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{reason.title}</h4>
                      <p className="text-sm opacity-90">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact CTA */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('investment.contact.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('investment.contact.description')}
              </p>
              
              <div className="space-y-4">
                <a 
                  href="mailto:invest@tradefoox.com" 
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>{t('investment.contact.email')}</span>
                </a>
                
                <a 
                  href="#contact" 
                  className="btn-outline w-full flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{t('investment.contact.schedule')}</span>
                </a>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('investment.market.title')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('investment.market.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Investment; 