import React from 'react';

const SelectInvestors: React.FC = () => {
  const investors = [
    {
      name: 'SPK Chemnitz',
      url: 'https://www.spk-chemnitz.de/de/home.html',
      description: 'Sparkasse Chemnitz',
      logo: process.env.PUBLIC_URL + '/images/investors/sparkasse.svg'
    },
    {
      name: 'Volksbank Chemnitz',
      url: 'https://www.volksbank-chemnitz.de/startseite.html',
      description: 'Volksbank Chemnitz',
      logo: process.env.PUBLIC_URL + '/images/investors/volksbank.png'
    },
    {
      name: 'Merkur Privatbank',
      url: 'https://www.merkur-privatbank.de/',
      description: 'Merkur Privatbank',
      logo: process.env.PUBLIC_URL + '/images/investors/MB_Schriftzug-pdm.jpg'
    },
    {
      name: 'SAB Sachsen',
      url: 'https://www.sab.sachsen.de/sab-sachsenkredit-universal-neu?gad_source=1',
      description: 'SAB Sachsenkredit Universal',
      logo: process.env.PUBLIC_URL + '/images/investors/sab_logo.png'
    }
  ];

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background gradient shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-left mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Select Investors
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
          {investors.map((investor, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => window.open(investor.url, '_blank', 'noopener,noreferrer')}
            >
              <div className="w-50 h-48 flex items-center justify-center">
                <img 
                  src={investor.logo} 
                  alt={`${investor.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectInvestors; 