import React, { useState, useEffect } from 'react';
import {
  User, GraduationCap, School, Calendar, Target, TrendingUp,
  Award, ChevronLeft, CheckCircle, XCircle, FileText,
  BookOpen, AlertCircle, Trophy, BarChart3
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend
} from 'recharts';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const StudentProfile = () => {
  // Pega ID do aluno da URL (simulado aqui, no React Router seria useParams)
  const studentId = window.location.pathname.split('/').pop() || '1';
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfile();
  }, [studentId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/student-profile/${studentId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar perfil: ${response.status}`);
      }

      const data = await response.json();
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Carregando perfil do aluno...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Erro ao carregar</h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <div className="flex gap-2">
            <button
              onClick={fetchProfile}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Nenhum dado disponível</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Preparação dos dados para gráficos
  const competencyRadarData = profile.recent_progress 
    ? profile.recent_progress.slice(0, 6).map(p => ({
        competency: p.competency_name.substring(0, 15) + '...',
        mastery: p.competency_mastery
      }))
    : [];

  const descriptorsBySubjectData = profile.descriptors?.by_subject
    ? Object.entries(profile.descriptors.by_subject).map(([subject, data]) => ({
        subject,
        conquistados: data.achieved,
        total: data.total,
        percentual: Math.round((data.achieved / data.total) * 100)
      }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com botão voltar */}
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar ao Dashboard
        </button>

        {/* Card Principal - Info do Aluno */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-full">
                <User className="w-16 h-16 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {profile.student_name}
                </h1>
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    <span>Matrícula: {profile.student_serial}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="w-5 h-5" />
                    <span>{profile.school_name || 'Escola não informada'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{profile.class_name || 'Turma não informada'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Série: {profile.grade || 'Não informada'}</span>
                  </div>
                </div>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              profile.status === 'enrolled'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {profile.status === 'enrolled' ? 'Matriculado' : profile.status}
            </span>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Descritores Conquistados"
            value={profile.descriptors?.achieved_count || 0}
            total={profile.descriptors?.total_count || 0}
            icon={Target}
            color="blue"
          />
          <StatCard
            title="Taxa de Conquista"
            value={`${profile.descriptors?.percentage || 0}%`}
            icon={Trophy}
            color="green"
          />
          <StatCard
            title="Provas Realizadas"
            value={profile.recent_exams?.length || 0}
            icon={FileText}
            color="purple"
          />
          <StatCard
            title="Última Avaliação"
            value={profile.recent_progress?.[0]
              ? new Date(profile.recent_progress[0].assessment_date).toLocaleDateString('pt-BR')
              : 'N/A'
            }
            icon={Calendar}
            color="orange"
          />
        </div>

        {/* Tabs de Navegação */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              icon={BarChart3}
              label="Visão Geral"
            />
            <TabButton
              active={activeTab === 'descriptors'}
              onClick={() => setActiveTab('descriptors')}
              icon={Target}
              label="Descritores"
            />
            <TabButton
              active={activeTab === 'exams'}
              onClick={() => setActiveTab('exams')}
              icon={FileText}
              label="Provas"
            />
            <TabButton
              active={activeTab === 'progress'}
              onClick={() => setActiveTab('progress')}
              icon={TrendingUp}
              label="Progresso"
            />
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab 
                competencyRadarData={competencyRadarData}
                descriptorsBySubjectData={descriptorsBySubjectData}
                profile={profile}
              />
            )}
            {activeTab === 'descriptors' && (
              <DescriptorsTab profile={profile} />
            )}
            {activeTab === 'exams' && (
              <ExamsTab profile={profile} />
            )}
            {activeTab === 'progress' && (
              <ProgressTab profile={profile} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares
const StatCard = ({ title, value, total, icon: Icon, color }) => {
  const colors = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${colors[color].text} mt-2`}>
            {value}
          </p>
          {total && <p className="text-sm text-gray-500 mt-1">de {total}</p>}
        </div>
        <div className={`${colors[color].bg} p-4 rounded-full`}>
          <Icon className={`w-8 h-8 ${colors[color].text}`} />
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
      active
        ? 'border-b-2 border-blue-600 text-blue-600'
        : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const OverviewTab = ({ competencyRadarData, descriptorsBySubjectData, profile }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {competencyRadarData.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Domínio de Competências
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={competencyRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="competency" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Domínio (%)"
                dataKey="mastery"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {descriptorsBySubjectData.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Descritores por Disciplina
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={descriptorsBySubjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="conquistados" name="Conquistados" fill="#10b981" />
              <Bar dataKey="total" name="Total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>

    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Resumo do Desempenho</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm text-gray-600">Total de Descritores</p>
          <p className="text-2xl font-bold text-blue-600">
            {profile.descriptors?.total_count || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm text-gray-600">Descritores Conquistados</p>
          <p className="text-2xl font-bold text-green-600">
            {profile.descriptors?.achieved_count || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm text-gray-600">Descritores Pendentes</p>
          <p className="text-2xl font-bold text-orange-600">
            {(profile.descriptors?.total_count || 0) - (profile.descriptors?.achieved_count || 0)}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const DescriptorsTab = ({ profile }) => {
  if (!profile.descriptors?.by_subject) {
    return <p className="text-gray-500 text-center py-8">Nenhum descritor disponível</p>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          🎯 Descritores da Série: {profile.grade || 'Não informada'}
        </h3>
        <p className="text-gray-600">
          Visualize abaixo todos os descritores da série do aluno. Verde = Conquistado | Vermelho = Não conquistado
        </p>
      </div>

      {Object.entries(profile.descriptors.by_subject).map(([subject, data]) => (
        <div key={subject} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              {subject}
            </h4>
            <div className="text-right">
              <p className="text-sm text-gray-500">Progresso</p>
              <p className="text-2xl font-bold text-blue-600">
                {data.achieved} / {data.total}
              </p>
              <p className="text-sm text-gray-600">
                ({Math.round((data.achieved / data.total) * 100)}%)
              </p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${(data.achieved / data.total) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.descriptors?.map((desc) => (
              <div
                key={desc.id}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                  desc.achieved
                    ? 'bg-green-50 border-green-500 shadow-md'
                    : 'bg-red-50 border-red-300 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-gray-600 bg-white px-2 py-1 rounded">
                    {desc.code}
                  </span>
                  {desc.achieved ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 line-clamp-3">
                  {desc.name}
                </p>
                <div className="mt-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    desc.achieved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {desc.achieved ? 'Conquistado ✓' : 'Não conquistado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ExamsTab = ({ profile }) => {
  if (!profile.recent_exams || profile.recent_exams.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Nenhuma prova realizada ainda</p>
      </div>
    );
  }

  const getStatusBadge = (percentage) => {
    if (percentage >= 70) return { color: 'bg-green-100 text-green-800', label: 'Aprovado' };
    if (percentage >= 50) return { color: 'bg-yellow-100 text-yellow-800', label: 'Recuperação' };
    return { color: 'bg-red-100 text-red-800', label: 'Insuficiente' };
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          📝 Histórico de Provas
        </h3>
        <p className="text-gray-600">
          Visualize o desempenho do aluno em todas as avaliações realizadas
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prova</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acertos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aproveitamento</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {profile.recent_exams.map((exam, idx) => {
              const statusBadge = getStatusBadge(exam.percentage);
              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {exam.exam_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(exam.application_date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className="font-bold">{exam.total_score}</span> / {exam.max_score}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {exam.correct_answers} acertos
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            exam.percentage >= 70 ? 'bg-green-500' :
                            exam.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${exam.percentage}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-700">{exam.percentage}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProgressTab = ({ profile }) => {
  if (!profile.recent_progress || profile.recent_progress.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum progresso registrado ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          📈 Evolução do Aprendizado
        </h3>
        <p className="text-gray-600">
          Acompanhe o desenvolvimento do aluno em cada competência avaliada
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {profile.recent_progress.map((progress, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-800 mb-1">
                  {progress.competency_name}
                </h4>
                <p className="text-sm text-gray-500">
                  Avaliado em: {new Date(progress.assessment_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">
                  {progress.competency_mastery.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Domínio</p>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Pontuação: {progress.score} / {progress.max_score}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    progress.competency_mastery >= 70 ? 'bg-green-500' :
                    progress.competency_mastery >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${progress.competency_mastery}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {progress.competency_mastery >= 70 ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  ✓ Competência Dominada
                </span>
              ) : progress.competency_mastery >= 50 ? (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                  ⚠ Em Desenvolvimento
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                  ✗ Necessita Reforço
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProfile;