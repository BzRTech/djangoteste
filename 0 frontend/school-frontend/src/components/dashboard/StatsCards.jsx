import React from 'react';
import { Users, GraduationCap, School, BookOpen } from 'lucide-react';

const StatsCards = ({ students, classes, teachers, schools }) => {
  const stats = [
    {
      title: 'Total de Alunos',
      value: students.length,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Turmas',
      value: classes.length,
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Professores',
      value: teachers.length,
      icon: GraduationCap,
      color: 'purple'
    },
    {
      title: 'Escolas',
      value: schools.length,
      icon: School,
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
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
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

export default StatsCards;