import React from 'react';
import { Linkedin, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/images/milestones/TF%20app%20favicon.webp" 
                alt="TRADEFOOX App Favicon" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold">TRADEFOOX</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://linkedin.com/company/tradefoox" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:invest@tradefoox.com" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.investorArea')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#vision" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.vision')}
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.features')}
                </a>
              </li>
              <li>
                <a href="#traction" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.traction')}
                </a>
              </li>
              <li>
                <a href="#team" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.team')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://tradefoox.com/impressum" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.imprint')}
                </a>
              </li>
              <li>
                <a href="https://tradefoox.com/datenschutz" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.privacy')}
                </a>
              </li>
              <li>
                <a href="/investor-faq" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.faq')}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.links.terms')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="https://tradefoox.com/datenschutz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.legalLinks.privacy')}
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.legalLinks.cookies')}
              </a>
              <a href="/accessibility" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.legalLinks.accessibility')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 