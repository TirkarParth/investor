import React from 'react';
import { CheckCircle, Users, TrendingUp, Rocket, Building, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Traction: React.FC = () => {
  const { t } = useTranslation();

  const milestones = [
    {
      icon: CheckCircle,
      title: t('traction.milestones.launch.title'),
      description: t('traction.milestones.launch.description'),
      status: 'completed'
    },
    {
      icon: Users,
      title: t('traction.milestones.users.title'),
      description: t('traction.milestones.users.description'),
      status: 'completed'
    },
    {
      icon: TrendingUp,
      title: t('traction.milestones.ads.title'),
      description: t('traction.milestones.ads.description'),
      status: 'completed'
    },
    {
      icon: Rocket,
      title: t('traction.milestones.beta.title'),
      description: t('traction.milestones.beta.description'),
      status: 'completed'
    },
    {
      icon: Building,
      title: t('traction.milestones.sales.title'),
      description: t('traction.milestones.sales.description'),
      status: 'in-progress'
    },
    {
      icon: Calendar,
      title: t('traction.milestones.creator.title'),
      description: t('traction.milestones.creator.description'),
      status: 'planned'
    }
  ];

  return (
    <section id="traction" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('traction.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('traction.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg card-hover">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                milestone.status === 'completed' 
                  ? 'bg-green-100 text-green-600' 
                  : milestone.status === 'in-progress'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <milestone.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{milestone.title}</h3>
              <p className="text-gray-600 mb-4">{milestone.description}</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                milestone.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : milestone.status === 'in-progress'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {milestone.status === 'completed' && <CheckCircle className="w-4 h-4 mr-2" />}
                {milestone.status === 'in-progress' && <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent"></div>}
                {milestone.status === 'planned' && <Calendar className="w-4 h-4 mr-2" />}
                {milestone.status === 'completed' && 'Completed'}
                {milestone.status === 'in-progress' && 'In Progress'}
                {milestone.status === 'planned' && 'Planned'}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">{t('traction.cta.title')}</h3>
            <p className="text-lg opacity-90">
              {t('traction.cta.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Traction; 