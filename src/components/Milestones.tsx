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

  // Gallery images for marquee rows
  const galleryImages = [
    '/images/milestones/m1.jpeg',
    '/images/milestones/m2.jpeg',
    '/images/milestones/m3.jpeg',
    '/images/milestones/m4.jpeg',
    '/images/milestones/m5.jpeg',
    '/images/milestones/m6.jpeg',
    '/images/milestones/m7.jpeg',
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
            <div className="flex flex-col lg:flex-row rounded-2xl shadow-xl overflow-hidden transition-all duration-500 max-w-4xl mx-auto">
              {/* Left side - Logo area */}
              <div className={`p-4 lg:p-6 flex flex-col items-center justify-center w-full lg:w-64 h-48 lg:h-64 ${
                (() => {
                  const selectedMilestoneData = milestones.find(m => m.key === selectedMilestone);
                  if (selectedMilestoneData?.key === 'project') return 'bg-blue-500/20'; // Transparent blue for Projekt
                  if (selectedMilestoneData?.key === 'dayone') return 'bg-green-500/20'; // Transparent green for day one
                  if (selectedMilestoneData?.key === 'webapp') return 'bg-red-500/20'; // Transparent red for TRADEFOOX Web-App
                  if (selectedMilestoneData?.key === 'nativeapp') return 'bg-pink-500/20'; // Transparent pink for TRADEFOOX Native-App
                  return 'bg-white'; // Default fallback
                })()
              }`}>
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img 
                    src={milestones.find(m => m.key === selectedMilestone)?.logo || '/images/logo/dayonelogo-removebg-preview.png'} 
                    alt={`${selectedMilestone} logo`}
                    className="w-full h-full object-contain max-w-48"
                  />
                </div>
              </div>
              
              {/* Right side - White background with date and description */}
              <div className="bg-white p-4 lg:p-6 flex-1 flex flex-col justify-center">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 text-center lg:text-left">
                  {t(`traction.companyMilestones.items.${selectedMilestone}.date`)}
                </div>
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed text-center lg:text-left mb-4">
                  {t(`traction.companyMilestones.items.${selectedMilestone}.description`)}
                </p>
                
                {/* Visit Site button if URL exists */}
                {milestones.find(m => m.key === selectedMilestone)?.url && (
                  <div className="pt-4 space-y-2 flex flex-col items-center lg:items-start">
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
                      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4 w-full lg:w-auto">
                        {/* Apple App Store Button */}
                        <a
                          href="https://apps.apple.com/de/app/tradefoox/id6477870055"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
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
                          className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
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

        {/* Scrolling gallery below the timeline */}
        <div className="mt-12 space-y-8 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-4 sm:px-6 md:px-8">
          {/* Row 1: right to left */}
          <div className="relative overflow-hidden">
            <div className="flex w-[200%] animate-marquee-l" style={{ ['--marquee-duration' as any]: '45s' }}>
              {[0, 1].map((dup) => (
                <div key={`top-dup-${dup}`} className="flex gap-8 md:gap-12 w-1/2 shrink-0 py-4">
                  {galleryImages.map((src, idx) => (
                    <div key={`top-${dup}-${idx}`} className="min-w-[200px] md:min-w-[280px] lg:min-w-[320px] h-32 md:h-40 lg:h-48 bg-white rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 flex-shrink-0">
                      <img src={src} alt={`milestone gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Row 2: left to right */}
          <div className="relative overflow-hidden">
            <div className="flex w-[200%] animate-marquee-r" style={{ ['--marquee-duration' as any]: '50s' }}>
              {[0, 1].map((dup) => (
                <div key={`bottom-dup-${dup}`} className="flex gap-8 md:gap-12 w-1/2 shrink-0 py-4">
                  {galleryImages.map((src, idx) => (
                    <div key={`bottom-${dup}-${idx}`} className="min-w-[200px] md:min-w-[280px] lg:min-w-[320px] h-32 md:h-40 lg:h-48 bg-white rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 flex-shrink-0">
                      <img src={src} alt={`milestone gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Milestones; 