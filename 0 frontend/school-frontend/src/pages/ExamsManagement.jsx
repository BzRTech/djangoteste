import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const ExamsManagement = () => {
  const [activeTab, setActiveTab] = useState("exams");
  const [exams, setExams] = useState([]);
  const [applications, setApplications] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, appsRes, subjectsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/exams/`),
        fetch(`${API_BASE_URL}/exam-applications/`),
        fetch(`${API_BASE_URL}/subjects/`),
      ]);

      const [examsData, appsData, subjectsData] = await Promise.all([
        examsRes.json(),
        appsRes.json(),
        subjectsRes.json(),
      ]);

      setExams(Array.isArray(examsData) ? examsData : examsData.results || []);
      setApplications(
        Array.isArray(appsData) ? appsData : appsData.results || []
      );
      setSubjects(
        Array.isArray(subjectsData) ? subjectsData : subjectsData.results || []
      );
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "exams", label: "Provas Cadastradas", icon: FileText },
    { id: "applications", label: "Aplicações", icon: Calendar },
    { id: "results", label: "Resultados", icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Gerenciamento de Provas
          </h1>
          <p className="text-gray-600">
            Cadastro e acompanhamento de avaliações
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Provas"
            value={exams.length}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Aplicações"
            value={applications.length}
            icon={Calendar}
            color="green"
          />
          <StatCard
            title="Em Andamento"
            value={
              applications.filter((a) => a.status === "in_progress").length
            }
            icon={Users}
            color="orange"
          />
          <StatCard
            title="Concluídas"
            value={applications.filter((a) => a.status === "completed").length}
            icon={CheckCircle}
            color="purple"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "exams" && (
              <ExamsTab
                exams={exams}
                subjects={subjects}
                onRefresh={fetchData}
                showForm={showExamForm}
                setShowForm={setShowExamForm}
              />
            )}
            {activeTab === "applications" && (
              <ApplicationsTab
                applications={applications}
                exams={exams}
                onRefresh={fetchData}
                showForm={showApplicationForm}
                setShowForm={setShowApplicationForm}
              />
            )}
            {activeTab === "results" && (
              <ResultsTab applications={applications} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    orange: { bg: "bg-orange-100", text: "text-orange-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${colors[color].text} mt-2`}>
            {value}
          </p>
        </div>
        <div className={`${colors[color].bg} p-4 rounded-full`}>
          <Icon className={`w-8 h-8 ${colors[color].text}`} />
        </div>
      </div>
    </div>
  );
};

// ============================================
// EXAMS TAB
// ============================================
const ExamsTab = ({ exams, subjects, onRefresh, showForm, setShowForm }) => {
  const [selectedExam, setSelectedExam] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar esta prova?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/exams/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Provas Cadastradas</h2>
        <button
          onClick={() => {
            setSelectedExam(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Nova Prova
        </button>
      </div>

      {showForm ? (
        <ExamForm
          exam={selectedExam}
          subjects={subjects}
          onClose={() => {
            setShowForm(false);
            setSelectedExam(null);
          }}
          onSave={() => {
            setShowForm(false);
            setSelectedExam(null);
            onRefresh();
          }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Disciplina
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Questões
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {exam.exam_code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {exam.exam_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {exam.subject || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {exam.school_year || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {exam.questions_count || exam.total_questions || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => {
                        setSelectedExam(exam);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ============================================
// EXAM FORM
// ============================================
const ExamForm = ({ exam, subjects, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    exam_code: exam?.exam_code || "",
    exam_name: exam?.exam_name || "",
    subject: exam?.subject || "",
    school_year: exam?.school_year || new Date().getFullYear(),
    total_questions: exam?.total_questions || 0,
    description: exam?.description || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = exam
        ? `${API_BASE_URL}/exams/${exam.id}/`
        : `${API_BASE_URL}/exams/`;

      const method = exam ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 p-6 rounded-lg"
    >
      <h3 className="text-xl font-bold mb-4">
        {exam ? "Editar" : "Nova"} Prova
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código *
          </label>
          <input
            type="text"
            required
            value={formData.exam_code}
            onChange={(e) =>
              setFormData({ ...formData, exam_code: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ano Letivo *
          </label>
          <input
            type="number"
            required
            value={formData.school_year}
            onChange={(e) =>
              setFormData({ ...formData, school_year: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome da Prova *
        </label>
        <input
          type="text"
          required
          value={formData.exam_name}
          onChange={(e) =>
            setFormData({ ...formData, exam_name: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Disciplina *
          </label>
          <select
            required
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma disciplina</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.subject_name}>
                {subject.subject_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total de Questões
          </label>
          <input
            type="number"
            value={formData.total_questions}
            onChange={(e) =>
              setFormData({ ...formData, total_questions: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          rows="3"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

// ============================================
// APPLICATIONS TAB
// ============================================
const ApplicationsTab = ({
  applications,
  exams,
  onRefresh,
  showForm,
  setShowForm,
}) => {
  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const labels = {
      scheduled: "Agendada",
      in_progress: "Em Andamento",
      completed: "Concluída",
      cancelled: "Cancelada",
    };
    return labels[status] || status;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Aplicações de Provas
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Nova Aplicação
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Prova
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Turma
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Alunos
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {app.exam_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {app.class_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(app.application_date).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {getStatusLabel(app.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {app.results_count || 0}/{app.students_count || 0}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================
// RESULTS TAB
// ============================================
const ResultsTab = ({ applications }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Resultados</h2>
      <p className="text-gray-600">
        Selecione uma aplicação na aba "Aplicações" para ver os resultados.
      </p>
    </div>
  );
};

export default ExamsManagement;
