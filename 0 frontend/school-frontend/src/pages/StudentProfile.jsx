import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, GraduationCap, School, Calendar, Target, TrendingUp,
    Award, ChevronLeft, CheckCircle, XCircle, Loader2
} from 'lucide-react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend
} from 'recharts';
import Loading from '../components/Loading';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const StudentProfile = () => {
    const params = useParams();
    const id_student = params.id || params.id_student;
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, [id_student]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            // ✅ CORRIGIDO: Usar rota correta
            if (!id_student) {
            throw new Error("ID do aluno não encontrado na URL");
        }
            const response = await fetch(
                `${API_BASE_URL}/student-profile/${id_student}`
            );

if (!response.ok) {
    // Se não encontrar, tentar método alternativo
    if (response.status === 404) {
        throw new Error('Endpoint não encontrado. Verifique se StudentProfileViewSet está registrado em api/urls.py');
    }
    throw new Error(`Erro HTTP: ${response.status}`);
}

const data = await response.json();
setProfile(data);
setError(null);
        } catch (err) {
    console.error('Erro ao carregar perfil:', err);
    setError(err.message);
    setProfile(null);
} finally {
    setLoading(false);
}
    };

if (loading) {
    return (
        <Loading />
    )
}

if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Erro ao carregar</h2>
                <p className="text-gray-600 mb-4 text-center">{error}</p>
                <p className="text-sm text-gray-500 mb-4 text-center">
                    Certifique-se de:
                    <br />1. Django rodando em http://127.0.0.1:8000
                    <br />2. StudentProfileViewSet registrado em api/urls.py
                    <br />3. Aluno com ID {id_student} existe no banco de dados
                </p>
                <button
                    onClick={fetchProfile}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-2"
                >
                    Tentar Novamente
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                    Voltar ao Dashboard
                </button>
            </div>
        </div>
    );
}

if (!profile) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
                <p className="text-gray-600">Nenhum dado de perfil disponível</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    Voltar ao Dashboard
                </button>
            </div>
        </div>
    );
}

// Prepara dados para o gráfico radar de competências
const competencyRadarData = profile.recent_progress ? profile.recent_progress.map(p => ({
    competency: p.competency_name.substring(0, 20) + '...',
    mastery: p.competency_mastery
})) : [];

// Prepara dados para gráfico de descritores por disciplina
const descriptorsBySubjectData = profile.descriptors && profile.descriptors.by_subject
    ? Object.entries(profile.descriptors.by_subject).map(([subject, data]) => ({
        subject: subject,
        total: data.total,
        achieved: data.achieved,
        percentage: Math.round((data.achieved / data.total) * 100)
    }))
    : [];

return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
            {/* Header com botão voltar */}
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
                Voltar ao Dashboard
            </button>

            {/* Card do Perfil do Aluno */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <div className="bg-blue-100 p-6 rounded-full">
                            <User className="w-16 h-16 text-blue-600" />
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
                                    <span>{profile.class_name || 'N/A'} - {profile.school_name || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    <span>Série: {profile.grade || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${profile.status === 'enrolled'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {profile.status}
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
                    icon={TrendingUp}
                    color="green"
                />
                <StatCard
                    title="Provas Realizadas"
                    value={profile.recent_exams?.length || 0}
                    icon={Award}
                    color="purple"
                />
                <StatCard
                    title="Última Avaliação"
                    value={profile.recent_progress && profile.recent_progress.length > 0
                        ? new Date(profile.recent_progress[0].assessment_date).toLocaleDateString('pt-BR')
                        : 'N/A'
                    }
                    icon={Calendar}
                    color="orange"
                />
            </div>

            {/* Grid de Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Gráfico Radar de Competências */}
                {competencyRadarData.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            Domínio de Competências Recentes
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

                {/* Gráfico de Descritores por Disciplina */}
                {descriptorsBySubjectData.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
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
                                <Bar dataKey="achieved" name="Conquistados" fill="#10b981" />
                                <Bar dataKey="total" name="Total" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Gráfico Estilo "Velas" - Descritores Conquistados */}
            {profile.descriptors?.by_subject && Object.keys(profile.descriptors.by_subject).length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Award className="w-7 h-7 text-yellow-600" />
                        Descritores Conquistados - Visualização por Disciplina
                    </h3>

                    {Object.entries(profile.descriptors.by_subject).map(([subject, data]) => (
                        <div key={subject} className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-700">{subject}</h4>
                                <span className="text-sm text-gray-500">
                                    {data.achieved} / {data.total} conquistados
                                    ({Math.round((data.achieved / data.total) * 100)}%)
                                </span>
                            </div>

                            {/* Grid de "velas" */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {data.descriptors && data.descriptors.map((desc) => (
                                    <div
                                        key={desc.id}
                                        className={`p-4 rounded-lg border-2 transition-all ${desc.achieved
                                            ? 'bg-green-50 border-green-500 shadow-md'
                                            : 'bg-gray-50 border-gray-300 opacity-60'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-xs font-mono text-gray-600">{desc.code}</span>
                                            {desc.achieved ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-gray-800 line-clamp-2">
                                            {desc.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Últimas Provas */}
            {profile.recent_exams && profile.recent_exams.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Últimas Provas</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prova</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nota</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acertos</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aproveitamento</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {profile.recent_exams.map((exam, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{exam.exam_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(exam.application_date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {exam.total_score} / {exam.max_score}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {exam.correct_answers} acertos
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${exam.percentage >= 70
                                                ? 'bg-green-100 text-green-800'
                                                : exam.percentage >= 50
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {exam.percentage}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    </div>
);
};

// Componente de Card de Estatística
const StatCard = ({ title, value, total, icon: Icon, color }) => {
    const colors = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
        green: { bg: 'bg-green-100', text: 'text-green-600' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <p className={`text-3xl font-bold ${colors[color].text} mt-2`}>
                        {value}
                    </p>
                    {total && (
                        <p className="text-sm text-gray-500 mt-1">de {total}</p>
                    )}
                </div>
                <div className={`${colors[color].bg} p-4 rounded-full`}>
                    <Icon className={`w-8 h-8 ${colors[color].text}`} />
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;