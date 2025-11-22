import React from 'react';
import { BookOpen, GraduationCap, Filter } from 'lucide-react';

const DescriptorStats = ({ descriptors = [], subjects = [], grades = [], filteredDescriptors = [] }) => {
  const stats = [
    {
      title: 'Total de Descritores',
      value: descriptors.length,
      icon: BookOpen,
      color: 'blue'
    },
    {
      title: 'Disciplinas',
      value: subjects.length,
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Séries',
      value: grades.length,
      icon: GraduationCap,
      color: 'purple'
    },
    {
      title: 'Filtrados',
      value: filteredDescriptors.length,
      icon: Filter,
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    green: {
      text: 'text-green-600',
      bg: 'bg-green-100'
    },
    purple: {
      text: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    orange: {
      text: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colors = colorClasses[stat.color];
        
        return (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className={`text-3xl font-bold ${colors.text} mt-2`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${colors.bg} p-4 rounded-full`}>
                <Icon className={`w-8 h-8 ${colors.text}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DescriptorStats;