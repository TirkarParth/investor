import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  
  // State for individual cookie preferences
  const [cookiePreferences, setCookiePreferences] = useState({
    googleAnalytics: false,
    googleTagManager: false,
    googleAdvertising: false,
    hubSpot: false,
    notSpecified: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    if (!cookieChoice) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowCookieSettings(true);
  };

  const toggleCookie = (cookieType: keyof typeof cookiePreferences) => {
    setCookiePreferences(prev => ({
      ...prev,
      [cookieType]: !prev[cookieType]
    }));
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    setShowCookieSettings(false);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Cookies</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed mb-6">
            Diese Plattform verwendet Cookies! Um diese Website zu betreiben, ist es für uns notwendig Cookies zu verwenden. 
            Einige Cookies sind erforderlich, um die Funktionalität zu gewährleisten, andere brauchen wir für unsere Statistik 
            und wieder andere helfen uns, Dir nur die Werbung anzuzeigen, die Dich interessiert. Mehr erfährst Du in unserer Datenschutzerklärung.
          </p>

          {/* Cookie Group Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cookie-Gruppen auswählen:</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-gray-700">Google Analytics</span>
                <button
                  onClick={() => toggleCookie('googleAnalytics')}
                  className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                    cookiePreferences.googleAnalytics ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.googleAnalytics ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-gray-700">Google Tag Manager</span>
                <button
                  onClick={() => toggleCookie('googleTagManager')}
                  className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                    cookiePreferences.googleTagManager ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.googleTagManager ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-gray-700">Google Advertising</span>
                <button
                  onClick={() => toggleCookie('googleAdvertising')}
                  className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                    cookiePreferences.googleAdvertising ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.googleAdvertising ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-gray-700">HubSpot</span>
                <button
                  onClick={() => toggleCookie('hubSpot')}
                  className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                    cookiePreferences.hubSpot ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.hubSpot ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-gray-700">Nicht angegeben</span>
                <button
                  onClick={() => toggleCookie('notSpecified')}
                  className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                    cookiePreferences.notSpecified ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.notSpecified ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleSavePreferences}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 active:scale-95 transition-all duration-200"
            >
              Ausgewählte Cookies zulassen
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 active:scale-95 transition-all duration-200"
            >
              Alle Cookies zulassen
            </button>
            <button
              onClick={handleRejectAll}
              className="flex-1 px-6 py-3 border-2 border-primary-600 text-primary-600 bg-white rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Alle Cookies verweigern
            </button>
          </div>

          {/* Footer Links */}
          <div className="flex justify-center text-sm">
            <a 
              href="https://tradefoox.com/impressum" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Impressum
            </a>
            <span className="mx-2 text-gray-400">|</span>
            <a 
              href="https://tradefoox.com/datenschutz" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Datenschutz
            </a>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showCookieSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Cookie-Einstellungen</h3>
              <button
                onClick={() => setShowCookieSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Google Analytics</h4>
                  <p className="text-sm text-gray-600">Für Website-Statistiken und Performance-Analysen</p>
                </div>
                <button
                  onClick={() => toggleCookie('googleAnalytics')}
                  className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                    cookiePreferences.googleAnalytics ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.googleAnalytics ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Google Tag Manager</h4>
                  <p className="text-sm text-gray-600">Für die Verwaltung von Website-Tags und Tracking</p>
                </div>
                <button
                  onClick={() => toggleCookie('googleTagManager')}
                  className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                    cookiePreferences.googleTagManager ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.googleTagManager ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Google Advertising</h4>
                  <p className="text-sm text-gray-600">Für personalisierte Werbung und Remarketing</p>
                </div>
                <button
                  onClick={() => toggleCookie('googleAdvertising')}
                  className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                    cookiePreferences.googleAdvertising ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.googleAdvertising ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">HubSpot</h4>
                  <p className="text-sm text-gray-600">Für Marketing-Automation und CRM-Funktionen</p>
                </div>
                <button
                  onClick={() => toggleCookie('hubSpot')}
                  className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                    cookiePreferences.hubSpot ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.hubSpot ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Nicht angegeben</h4>
                  <p className="text-sm text-gray-600">Weitere Cookie-Kategorien</p>
                </div>
                <button
                  onClick={() => toggleCookie('notSpecified')}
                  className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                    cookiePreferences.notSpecified ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.notSpecified ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCookieSettings(false)}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 active:scale-95 transition-all duration-200"
              >
                Einstellungen speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent; 