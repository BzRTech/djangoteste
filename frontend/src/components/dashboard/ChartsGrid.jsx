import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award } from 'lucide-react';

const ChartsGrid = ({ students, classes }) => {
  // Dados para gráficos
  const studentsByClass = classes.map(cls => ({
    name: cls.class_name || 'Sem nome',
    alunos: students.filter(s => s.id_class === cls.id).length
  }));

  const studentsByStatus = [
    { name: 'Ativos', value: students.filter(s => s.status === 'ativo' || s.status === 'Ativo').length },
    { name: 'Inativos', value: students.filter(s => s.status === 'inativo' || s.status === 'Inativo').length },
    { name: 'Outros', value: students.filter(s => s.status !== 'ativo' && s.status !== 'Ativo' && s.status !== 'inativo' && s.status !== 'Inativo').length }
  ].filter(item => item.value > 0);

  const classesByGrade = classes.reduce((acc, cls) => {
    const grade = cls.grade || 'Não definido';
    const existing = acc.find(item => item.name === grade);
    if (existing) {
      existing.turmas += 1;
    } else {
      acc.push({ name: grade, turmas: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Alunos por Turma */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Alunos por Turma
        </h3>
        {studentsByClass.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentsByClass}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="alunos" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-20">Nenhum dado disponível</p>
        )}
      </div>

      {/* Status dos Alunos */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-green-600" />
          Status dos Alunos
        </h3>
        {studentsByStatus.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studentsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {studentsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-20">Nenhum dado disponível</p>
        )}
      </div>

      {/* Turmas por Série */}
      <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Distribuição de Turmas por Série</h3>
        {classesByGrade.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={classesByGrade}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="turmas" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-20">Nenhum dado disponível</p>
        )}
      </div>
    </div>
  );
};

export default ChartsGrid;