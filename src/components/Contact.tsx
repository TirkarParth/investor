import React from 'react';
import { Mail, Calendar, Linkedin, ArrowRight, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="section-padding bg-gray-900 text-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">{t('contact.touch.title')}</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{t('contact.touch.email')}</h4>
                    <a 
                      href="mailto:invest@tradefoox.com" 
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      invest@tradefoox.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{t('contact.touch.schedule')}</h4>
                    <a 
                      href="#schedule" 
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      {t('contact.touch.linkedinDesc')}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{t('contact.touch.linkedin')}</h4>
                    <a 
                      href="https://linkedin.com/company/tradefoox" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      {t('contact.touch.linkedinDesc')}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">{t('contact.why.title')}</h3>
              <div className="space-y-4">
                {(t('contact.why.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-8">
            <div className="bg-white text-gray-900 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">{t('contact.request.title')}</h3>
              <p className="text-gray-600 mb-8">
                {t('contact.request.description')}
              </p>
              
              <div className="space-y-4">
                <a 
                  href="mailto:invest@tradefoox.com?subject=Pitch%20Deck%20Request" 
                  className="btn-primary w-full flex items-center justify-center space-x-2 group"
                >
                  <Download className="w-5 h-5" />
                  <span>{t('contact.request.pitchDeck')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a 
                  href="mailto:invest@tradefoox.com?subject=Investment%20Discussion" 
                  className="btn-outline w-full flex items-center justify-center space-x-2 group"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{t('contact.request.discussion')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">{t('contact.steps.title')}</h3>
              <div className="space-y-4">
                {(t('contact.steps.items', { returnObjects: true }) as string[]).map((step: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 