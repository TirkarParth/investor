import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Milestones: React.FC = () => {
  const { t } = useTranslation();
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  const milestones = [
    {
      key: 'project',
      logo: '/images/milestones/Projekt%20auftrags%20vergabe.png',
      favicon: '/images/milestones/Projekt%20auftrags%20vergabe.png',
      color: 'bg-blue-500',
      url: 'https://projekt-auftragsvergabe.com/'
    },
    {
      key: 'dayone',
      logo: '/images/logo/dayonelogo-removebg-preview.png',
      favicon: '/images/logo/Favicon.png',
      color: 'bg-green-500'
    },
    {
      key: 'webapp',
      logo: '/images/milestones/tradefoox-logo.png',
      favicon: '/images/milestones/TF%20web%20Favicon.svg',
      color: 'bg-purple-500',
      url: 'https://tradefoox.com/'
    },
    {
      key: 'nativeapp',
      logo: '/images/milestones/tradefoox-logo.png',
      favicon: '/images/milestones/TF%20app%20favicon.webp',
      color: 'bg-orange-500',
      url: 'https://tradefoox.com/'
    }
  ];



  return (
    <section id="milestones" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Milestones
          </h2>
        </div>

        {/* Dynamic Milestone Details Card - appears when milestone is selected */}
        {selectedMilestone && (
          <div className="mb-16">
            <div className="flex rounded-2xl shadow-xl overflow-hidden transition-all duration-500 max-w-4xl mx-auto">
              {/* Left side - Logo area */}
              <div className={`p-6 flex flex-col items-center justify-center w-64 h-64 ${
                (() => {
                  const selectedMilestoneData = milestones.find(m => m.key === selectedMilestone);
                  if (selectedMilestoneData?.key === 'project') return 'bg-blue-500/20'; // Transparent blue for Projekt
                  if (selectedMilestoneData?.key === 'dayone') return 'bg-green-500/20'; // Transparent green for day one
                  if (selectedMilestoneData?.key === 'webapp') return 'bg-red-500/20'; // Transparent red for TRADEFOOX Web-App
                  if (selectedMilestoneData?.key === 'nativeapp') return 'bg-pink-500/20'; // Transparent pink for TRADEFOOX Native-App
                  return 'bg-white'; // Default fallback
                })()
              }`}>
                <div className="w-64 h-64 flex items-center justify-center p-4">
                  <img 
                    src={milestones.find(m => m.key === selectedMilestone)?.logo || '/images/logo/dayonelogo-removebg-preview.png'} 
                    alt={`${selectedMilestone} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              {/* Right side - White background with date and description */}
              <div className="bg-white p-6 flex-1 flex flex-col justify-center w-80">
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {t(`traction.companyMilestones.items.${selectedMilestone}.date`)}
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {t(`traction.companyMilestones.items.${selectedMilestone}.description`)}
                </p>
                
                {/* Visit Site button if URL exists */}
                {milestones.find(m => m.key === selectedMilestone)?.url && (
                  <div className="pt-4 space-y-2">
                    {/* Web App Link */}
                    {selectedMilestone === 'webapp' && (
                      <a
                        href="https://tradefoox.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm mr-2"
                      >
                        {t('traction.companyMilestones.visitSite')}
                      </a>
                    )}
                    
                    {/* Native App Store Links - Styled like the image */}
                    {selectedMilestone === 'nativeapp' && (
                      <div className="flex space-x-4">
                        {/* Apple App Store Button */}
                        <a
                          href="https://apps.apple.com/de/app/tradefoox/id6477870055"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                        >
                          <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                          </svg>
                          <div className="text-left">
                            <div className="text-xs opacity-80">{t('traction.companyMilestones.nowFor')}</div>
                            <div className="text-sm font-bold">Apple</div>
                          </div>
                        </a>
                        
                        {/* Google Play Store Button */}
                        <a
                          href="https://play.google.com/store/apps/details?id=app.tradefoox.mobile&pli=1"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                        >
                          <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                          </svg>
                          <div className="text-left">
                            <div className="text-xs opacity-80">{t('traction.companyMilestones.nowFor')}</div>
                            <div className="text-sm font-bold">Chrome</div>
                          </div>
                        </a>
                      </div>
                    )}
                    
                    {/* Other milestone URLs */}
                    {selectedMilestone !== 'webapp' && selectedMilestone !== 'nativeapp' && (
                      <a
                        href={milestones.find(m => m.key === selectedMilestone)?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                      >
                        {t('traction.companyMilestones.visitSite')}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
          
          {/* Vertical connection line from card to timeline */}
          {selectedMilestone && (
            <div className="absolute left-1/2 top-0 h-8 w-0.5 bg-gray-300 transform -translate-x-1/2"></div>
          )}
          
          {/* Clickable milestone points */}
          <div className="relative flex justify-between items-center">
            {milestones.map((milestone, index) => {
              return (
                <div key={milestone.key} className="relative flex flex-col items-center">
                  {/* Clickable milestone dot */}
                  <button
                    onClick={() => setSelectedMilestone(selectedMilestone === milestone.key ? null : milestone.key)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 mb-4 hover:scale-110 transition-transform cursor-pointer ${
                      milestone.key === 'project' ? 'bg-blue-500/20 border-2 border-blue-500' :
                      milestone.key === 'dayone' ? 'bg-green-500/20 border-2 border-green-500' :
                      'bg-white border-2 border-gray-200'
                    } ${
                      selectedMilestone === milestone.key ? 'ring-4 ring-blue-300 ring-offset-2' : ''
                    }`}
                  >
                    <img 
                      src={milestone.favicon} 
                      alt={`${milestone.key} favicon`}
                      className={`${
                        milestone.key === 'webapp' || milestone.key === 'nativeapp' ? 'rounded-full' : 'w-6 h-6'
                      } object-contain`}
                    />
                  </button>
                  
                  {/* Date label */}
                  <div className="text-sm font-semibold text-gray-600 text-center">
                    {t(`traction.companyMilestones.items.${milestone.key}.date`)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>



        {/* Mobile responsive grid for smaller screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 md:hidden">
          {/* Dynamic milestone details for mobile */}
          {selectedMilestone && (
            <div className="col-span-full mb-8 overflow-hidden rounded-2xl shadow-lg max-w-sm mx-auto">
              <div className="flex flex-col">
                {/* Top section - Logo area */}
                <div className={`p-6 text-center h-48 flex flex-col justify-center ${
                  selectedMilestone === 'project' ? 'bg-blue-500/20' :
                  selectedMilestone === 'dayone' ? 'bg-green-500/20' :
                  selectedMilestone === 'webapp' ? 'bg-red-500/20' : 
                  selectedMilestone === 'nativeapp' ? 'bg-pink-500/20' : 
                  'bg-white'
                }`}>
                  <div className="h-48 flex items-center justify-center p-4">
                    <img 
                      src={milestones.find(m => m.key === selectedMilestone)?.logo || '/images/logo/dayonelogo-removebg-preview.png'} 
                      alt={`${selectedMilestone} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                {/* Bottom section - White background with date and description */}
                <div className="bg-white p-6 text-center h-48 flex flex-col justify-center">
                  <div className="text-xl font-bold text-gray-900 mb-2">
                    {t(`traction.companyMilestones.items.${selectedMilestone}.date`)}
                  </div>
                  <p className="text-gray-700 mb-3 text-sm">
                    {t(`traction.companyMilestones.items.${selectedMilestone}.description`)}
                  </p>
                  {milestones.find(m => m.key === selectedMilestone)?.url && (
                    <div className="pt-4 space-y-2">
                      {/* Web App Link */}
                      {selectedMilestone === 'webapp' && (
                        <a
                          href="https://tradefoox.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                        >
                          {t('traction.companyMilestones.visitSite')}
                        </a>
                      )}
                      
                      {/* Native App Store Links - Styled like the image */}
                      {selectedMilestone === 'nativeapp' && (
                        <div className="flex flex-col space-y-2">
                          {/* Apple App Store Button */}
                          <a
                            href="https://apps.apple.com/de/app/tradefoox/id6477870055"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            <div className="text-left">
                              <div className="text-xs opacity-80">{t('traction.companyMilestones.nowFor')}</div>
                              <div className="text-sm font-bold">Apple</div>
                            </div>
                          </a>
                          
                          {/* Google Play Store Button */}
                          <a
                            href="https://play.google.com/store/apps/details?id=app.tradefoox.mobile&pli=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                            </svg>
                            <div className="text-left">
                              <div className="text-xs opacity-80">{t('traction.companyMilestones.nowFor')}</div>
                              <div className="text-sm font-bold">Chrome</div>
                            </div>
                          </a>
                        </div>
                      )}
                      
                      {/* Other milestone URLs */}
                      {selectedMilestone !== 'webapp' && selectedMilestone !== 'nativeapp' && (
                        <a
                          href={milestones.find(m => m.key === selectedMilestone)?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                        >
                          {t('traction.companyMilestones.visitSite')}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {milestones.map((milestone) => {
            return (
              <button
                key={milestone.key}
                onClick={() => setSelectedMilestone(selectedMilestone === milestone.key ? null : milestone.key)}
                className={`rounded-2xl p-6 text-center transition-colors w-full ${
                  selectedMilestone === milestone.key 
                    ? 'bg-blue-50 border-2 border-blue-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  milestone.key === 'project' ? 'bg-blue-500/20 border-2 border-blue-500' :
                  milestone.key === 'dayone' ? 'bg-green-500/20 border-2 border-green-500' :
                  'bg-white border-2 border-gray-200'
                }`}>
                  <img 
                    src={milestone.favicon} 
                    alt={`${milestone.key} favicon`}
                    className={`${
                      milestone.key === 'webapp' || milestone.key === 'nativeapp' ? 'w-16 h-16 rounded-full' : 'w-8 h-8'
                    } object-contain`}
                  />
                </div>
                <div className="text-sm font-semibold text-gray-600 mb-2">
                  {t(`traction.companyMilestones.items.${milestone.key}.date`)}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t(`traction.companyMilestones.items.${milestone.key}.title`)}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {t(`traction.companyMilestones.items.${milestone.key}.description`)}
                </p>
                {milestone.url && (
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {t('traction.companyMilestones.visitSite')}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Milestones; 