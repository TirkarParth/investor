import React from 'react';
import { ShoppingCart, List, Video, Newspaper, MessageCircle, Megaphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Features: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: ShoppingCart,
      title: t('features.items.marketplace.title'),
      description: t('features.items.marketplace.description'),
      color: 'bg-green-100 text-green-600',
      url: 'https://tradefoox.com/marketplace/offers'
    },
    {
      icon: List,
      title: t('features.items.listings.title'),
      description: t('features.items.listings.description'),
      color: 'bg-blue-100 text-blue-600',
      url: 'https://tradefoox.com/marketplace/listings'
    },
    {
      icon: Video,
      title: t('features.items.watchFeed.title'),
      description: t('features.items.watchFeed.description'),
      color: 'bg-purple-100 text-purple-600',
      url: 'https://tradefoox.com/watch/für_dich'
    },
    {
      icon: Newspaper,
      title: t('features.items.newsFeed.title'),
      description: t('features.items.newsFeed.description'),
      color: 'bg-orange-100 text-orange-600',
      url: 'https://tradefoox.com/news/für_dich'
    },
    {
      icon: MessageCircle,
      title: t('features.items.messenger.title'),
      description: t('features.items.messenger.description'),
      color: 'bg-pink-100 text-pink-600',
      url: 'https://tradefoox.com/messenger'
    },
    {
      icon: Megaphone,
      title: t('features.items.ads.title'),
      description: t('features.items.ads.description'),
      color: 'bg-red-100 text-red-600',
      url: 'https://tradefoox.com/werbung-erstellen'
    }
  ];

  return (
    <section id="features" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <a 
              key={index} 
              href={feature.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-8 shadow-lg card-hover border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105 group block"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">{t('features.cta.title')}</h3>
            <p className="text-lg opacity-90">
              {t('features.cta.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features; 