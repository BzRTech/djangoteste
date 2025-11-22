import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Eye, AlertCircle, CheckCircle, XCircle,
  Award, BarChart3, Target
} from 'lucide-react';

const ResultsTab = ({ 
  applications = [], 
  examResults = [], 
  students = [], 
  exams = [], 
  classes = [] 
}) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  // Filtra resultados quando uma aplicação é selecionada
  useEffect(() => {
    if (selectedApplication && Array.isArray(examResults)) {
      const filtered = examResults.filter(
        result => result.id_exam_application === parseInt(selectedApplication)
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  }, [selectedApplication, examResults]);

  // Busca nome do aluno com validação
  const getStudentName = (studentId) => {
    if (!Array.isArray(students) || students.length === 0) {
      return 'Carregando...';
    }
    const student = students.find(s => s.id_student === studentId);
    return student ? student.student_name : `Aluno ID ${studentId}`;
  };

  // Busca informações da aplicação com validações
  const getApplicationInfo = (applicationId) => {
    if (!Array.isArray(applications) || applications.length === 0) {
      return null;
    }
    
    const app = applications.find(a => a.id === parseInt(applicationId));
    if (!app) return null;
    
    const exam = Array.isArray(exams) ? exams.find(e => e.id === app.id_exam) : null;
    const cls = Array.isArray(classes) ? classes.find(c => c.id === app.id_class) : null;
    
    return {
      examName: exam?.exam_name || 'Prova não identificada',
      className: cls?.class_name || 'Turma não identificada',
      date: app.application_date || 'Data não disponível'
    };
  };

  // Calcula estatísticas
  const calculateStats = () => {
    if (!Array.isArray(filteredResults) || filteredResults.length === 0) {
      return null;
    }

    const totalScore = filteredResults.reduce((acc, r) => {
      return acc + (parseFloat(r.total_score) || 0);
    }, 0);
    
    const avgScore = totalScore / filteredResults.length;
    const maxPossible = filteredResults[0]?.max_score || 10;
    const avgPercentage = (avgScore / maxPossible) * 100;

    const passed = filteredResults.filter(r => {
      const percentage = (parseFloat(r.total_score || 0) / parseFloat(r.max_score || 1)) * 100;
      return percentage >= 70;
    }).length;
    
    const passRate = (passed / filteredResults.length) * 100;

    return {
      totalStudents: filteredResults.length,
      averageScore: avgScore.toFixed(2),
      averagePercentage: avgPercentage.toFixed(1),
      passRate: passRate.toFixed(1),
      passed: passed,
      failed: filteredResults.length - passed
    };
  };

  const stats = calculateStats();

  // Filtra apenas aplicações concluídas
  const completedApplications = Array.isArray(applications) 
    ? applications.filter(app => app.status === 'completed')
    : [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-blue-600" />
          Resultados das Provas
        </h2>
        <p className="text-gray-600">
          Visualize e analise o desempenho dos alunos nas avaliações aplicadas
        </p>
      </div>

      {/* Seletor de Aplicação */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📋 Selecione uma aplicação para ver os resultados:
        </label>
        <select
          value={selectedApplication || ''}
          onChange={(e) => setSelectedApplication(e.target.value || null)}
          className="w-full md:w-2/3 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          <option value="">-- Selecione uma aplicação --</option>
          {completedApplications.length === 0 ? (
            <option disabled>Nenhuma aplicação concluída disponível</option>
          ) : (
            completedApplications.map((app) => {
              const info = getApplicationInfo(app.id);
              return (
                <option key={app.id} value={app.id}>
                  {info?.examName} - {info?.className} - {
                    info?.date ? new Date(info.date).toLocaleDateString('pt-BR') : 'Data N/A'
                  }
                </option>
              );
            })
          )}
        </select>
      </div>

      {/* Estatísticas */}
      {selectedApplication && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Award}
            title="Total de Alunos"
            value={stats.totalStudents}
            color="blue"
          />
          <StatCard
            icon={BarChart3}
            title="Média Geral"
            value={`${stats.averageScore} (${stats.averagePercentage}%)`}
            color="purple"
          />
          <StatCard
            icon={CheckCircle}
            title="Taxa de Aprovação"
            value={`${stats.passRate}%`}
            color="green"
          />
          <StatCard
            icon={Target}
            title="Aprovados / Reprovados"
            value={`${stats.passed} / ${stats.failed}`}
            color="orange"
          />
        </div>
      )}

      {/* Tabela de Resultados */}
      {selectedApplication && filteredResults.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Nota
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Percentual
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Acertos
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Erros
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredResults.map((result) => {
                  const totalScore = parseFloat(result.total_score || 0);
                  const maxScore = parseFloat(result.max_score || 1);
                  const percentage = ((totalScore / maxScore) * 100).toFixed(1);
                  const isPassed = percentage >= 70;
                  
                  return (
                    <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {getStudentName(result.id_student)}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className="font-semibold text-gray-900">
                          {totalScore.toFixed(2)}
                        </span>
                        <span className="text-gray-500"> / {maxScore.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full transition-all ${
                                isPassed ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <span className={`font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                            {percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          {result.correct_answers || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                          <XCircle className="w-4 h-4" />
                          {result.wrong_answers || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                          isPassed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isPassed ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              Aprovado
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              Reprovado
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <button
                          onClick={() => {
                            setSelectedResult(result);
                            setShowDetails(true);
                          }}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedApplication && filteredResults.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-gray-600">
            Esta aplicação ainda não possui resultados registrados.
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-16 text-center">
          <TrendingUp className="w-24 h-24 text-blue-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Selecione uma aplicação
          </h3>
          <p className="text-gray-600 text-lg">
            Escolha uma aplicação concluída no menu acima para visualizar<br />
            as notas e estatísticas dos alunos
          </p>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetails && selectedResult && (
        <ResultDetailsModal
          result={selectedResult}
          studentName={getStudentName(selectedResult.id_student)}
          onClose={() => {
            setShowDetails(false);
            setSelectedResult(null);
          }}
        />
      )}
    </div>
  );
};

// Componente de Card de Estatística
const StatCard = ({ icon: Icon, title, value, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-full ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

// Modal de Detalhes do Resultado
const ResultDetailsModal = ({ result, studentName, onClose }) => {
  const totalScore = parseFloat(result.total_score || 0);
  const maxScore = parseFloat(result.max_score || 1);
  const percentage = ((totalScore / maxScore) * 100).toFixed(1);
  const status = percentage >= 70 ? 'Aprovado' : 'Reprovado';
  const statusColor = percentage >= 70 ? 'text-green-600' : 'text-red-600';
  const statusBgColor = percentage >= 70 ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-2">Detalhes do Resultado</h3>
              <p className="text-blue-100">Análise completa do desempenho</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Informações do Aluno */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Informações do Aluno
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-semibold text-gray-900">{studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID do Aluno</p>
                <p className="font-semibold text-gray-900">{result.id_student}</p>
              </div>
            </div>
          </div>

          {/* Pontuação */}
          <div className={`${statusBgColor} rounded-xl p-5 border-2 ${percentage >= 70 ? 'border-green-200' : 'border-red-200'}`}>
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Pontuação Final
            </h4>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Nota Obtida</p>
                <p className="text-4xl font-bold text-blue-600">
                  {totalScore.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Nota Máxima</p>
                <p className="text-4xl font-bold text-gray-600">
                  {maxScore.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-600">Percentual de Acerto</p>
                <span className={`text-2xl font-bold ${statusColor}`}>{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    percentage >= 70 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <div className="mt-4 text-center">
                <p className={`text-xl font-bold ${statusColor}`}>
                  Status: {status}
                </p>
              </div>
            </div>
          </div>

          {/* Detalhamento das Questões */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Detalhamento por Questão
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-1">Acertos</p>
                <p className="text-3xl font-bold text-green-600">
                  {result.correct_answers || 0}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-1">Erros</p>
                <p className="text-3xl font-bold text-red-600">
                  {result.wrong_answers || 0}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-1">Em Branco</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {result.blank_answers || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Resultado registrado em {new Date(result.created_at).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTab;