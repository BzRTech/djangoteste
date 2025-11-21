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
  Loader2,
  AlertCircle,
  //Eye,
  //AlertCircle,
} from "lucide-react";

import Loading from "../components/Loading";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const ExamsManagement = () => {
  const [activeTab, setActiveTab] = useState("exams");
  const [exams, setExams] = useState([]);
  const [applications, setApplications] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
 // const [selectedExam, setSelectedExam] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [students, setStudents] = useState([]);

  // Função helper para buscar TODOS os dados de um endpoint
  const fetchAllData = async (endpoint) => {
    let allData = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}?page=${page}`);
        const data = await response.json();

        if (data.results) {
          allData = allData.concat(data.results);
          if (data.results.length < 10) {
            hasMore = false;
          } else {
            page++;
          }
        } else if (Array.isArray(data)) {
          allData = data;
          hasMore = false;
        } else {
          hasMore = false;
        }
      } catch (err) {
        console.error(`Erro ao buscar dados de ${endpoint}:`, err);
        hasMore = false;
      }
    }

    return allData;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        examsArray, 
        applicationsArray, 
        subjectsArray, 
        classesArray, 
        teachersArray,
        resultsArray,      // NOVO
        studentsArray      // NOVO
      ] = await Promise.all([
        fetchAllData("/exams/"),
        fetchAllData("/exam-applications/"),
        fetchAllData("/subjects/"),
        fetchAllData("/classes/"),
        fetchAllData("/teachers/"),
        fetchAllData("/exam-results/"),     // NOVO
        fetchAllData("/students/")          // NOVO
      ]);

      setExams(examsArray);
      setApplications(applicationsArray);
      setSubjects(subjectsArray);
      setClasses(classesArray);
      setTeachers(teachersArray);
      setExamResults(resultsArray);         // NOVO
      setStudents(studentsArray);           // NOVO
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // No render, passe os novos props para ResultsTab
  {activeTab === "results" && (
  <ResultsTab 
    applications={applications}
    examResults={examResults}      // 👈 NOVO
    students={students}            // 👈 NOVO
    exams={exams}                  // 👈 NOVO
    classes={classes}              // 👈 NOVO
  />
)}

  const handleDelete = async (id, type) => {
    if (!window.confirm("Tem certeza que deseja deletar?")) return;

    try {
      const endpoint = type === "exam" ? "exams" : "exam-applications";
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
      } else {
        throw new Error("Erro ao deletar");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar item");
    }
  };

  const tabs = [
    { id: "exams", label: "Provas Cadastradas", icon: FileText },
    { id: "applications", label: "Aplicações", icon: Calendar },
    { id: "results", label: "Resultados", icon: TrendingUp },
  ];

    if (loading) {
    return (
      <Loading/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Erro ao carregar dados
          </h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <button
            onClick={fetchData}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
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
            value={applications.filter((a) => a.status === "in_progress").length}
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
                onDelete={handleDelete}
                onEdit={(exam) => {
                  //setSelectedExam(exam);
                  setShowExamForm(true);
                }}
                showForm={showExamForm}
                setShowForm={setShowExamForm}
              />
            )}
            {activeTab === "applications" && (
              <ApplicationsTab
                applications={applications}
                exams={exams}
                classes={classes}
                teachers={teachers}
                onRefresh={fetchData}
                onDelete={handleDelete}
                showForm={showApplicationForm}
                setShowForm={setShowApplicationForm}
              />
            )}
            {activeTab === "results" && <ResultsTab applications={applications} />}
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
const ExamsTab = ({ exams, subjects, onRefresh, onDelete, onEdit, showForm, setShowForm }) => {
  const handleNewExam = () => {
    onEdit(null);
  };

  return (
    <div>
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Provas Cadastradas ({exams.length})
            </h2>
            <button
              onClick={handleNewExam}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Nova Prova
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma prova cadastrada</p>
            </div>
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
                        {exam.total_questions || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <button
                          onClick={() => onEdit(exam)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(exam.id, "exam")}
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
        </>
      ) : (
        <ExamForm
          subjects={subjects}
          onClose={() => {
            setShowForm(false);
          }}
          onSave={() => {
            setShowForm(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

// ============================================
// EXAM FORM
// ============================================
const ExamForm = ({ subjects, onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    exam_code: "",
    exam_name: "",
    subject: "",
    school_year: new Date().getFullYear(),
    total_questions: 0,
    description: "",
  });
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = `${API_BASE_URL}/exams/`;
      const method = "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
      } else {
        const error = await response.json();
        alert("Erro ao salvar: " + JSON.stringify(error));
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar prova");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Nova Prova</h3>

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
              setFormData({ ...formData, school_year: parseInt(e.target.value) })
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
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total de Questões
          </label>
          <input
            type="number"
            value={formData.total_questions}
            onChange={(e) =>
              setFormData({ ...formData, total_questions: parseInt(e.target.value) })
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
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
  classes,
  teachers,
  onRefresh,
  onDelete,
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
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Aplicações de Provas ({applications.length})
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-5 h-5" />
              Nova Aplicação
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma aplicação cadastrada</p>
            </div>
          ) : (
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {app.exam_name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.class_name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(app.application_date).toLocaleDateString(
                          "pt-BR"
                        )}
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
                      <td className="px-6 py-4 text-sm text-right">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(app.id, "application")}
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
        </>
      ) : (
        <ApplicationForm
          exams={exams}
          classes={classes}
          teachers={teachers}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

// ============================================
// APPLICATION FORM
// ============================================
const ApplicationForm = ({ application, exams, classes, teachers, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id_exam: application?.id_exam || '',
    id_class: application?.id_class || '',
    id_teacher: application?.id_teacher || '',
    application_date: application?.application_date || new Date().toISOString().split('T')[0],
    start_time: application?.start_time || '',           // ✅ Deve existir
    end_time: application?.end_time || '',               // ✅ Deve existir
    status: application?.status || 'scheduled',
    observations: application?.observations || '',
    application_type: application?.application_type || '',
    assessment_period: application?.assessment_period || '',
    fiscal_year: application?.fiscal_year || new Date().getFullYear(),  // ✅ Deve existir
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Remove campos vazios
      const cleanData = {
        id_exam: parseInt(formData.id_exam),
        id_class: parseInt(formData.id_class),
        id_teacher: parseInt(formData.id_teacher),
        application_date: formData.application_date,
        status: formData.status,
        fiscal_year: parseInt(formData.fiscal_year) || new Date().getFullYear(),
      };

      // Adiciona campos opcionais apenas se tiverem valor
      if (formData.start_time) cleanData.start_time = formData.start_time;
      if (formData.end_time) cleanData.end_time = formData.end_time;
      if (formData.observations) cleanData.observations = formData.observations;
      if (formData.application_type) cleanData.application_type = formData.application_type;
      if (formData.assessment_period) cleanData.assessment_period = formData.assessment_period;

      const url = application
        ? `${API_BASE_URL}/exam-applications/${application.id}/`
        : `${API_BASE_URL}/exam-applications/`;

      const method = application ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Erro ao salvar:', errorData);
        alert(`Erro ao salvar aplicação: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar aplicação');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">
        {application ? 'Editar' : 'Nova'} Aplicação de Prova
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prova *
        </label>
        <select
          required
          value={formData.id_exam}
          onChange={(e) => setFormData({ ...formData, id_exam: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="">Selecione uma prova</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.exam_name} - {exam.subject}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Turma *
        </label>
        <select
          required
          value={formData.id_class}
          onChange={(e) => setFormData({ ...formData, id_class: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="">Selecione uma turma</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.class_name} - {cls.school_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professor *
        </label>
        <select
          required
          value={formData.id_teacher}
          onChange={(e) => setFormData({ ...formData, id_teacher: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="">Selecione um professor</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.teacher_name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data da Aplicação *
          </label>
          <input
            type="date"
            required
            value={formData.application_date}
            onChange={(e) =>
              setFormData({ ...formData, application_date: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ano Fiscal *
          </label>
          <input
            type="number"
            required
            value={formData.fiscal_year}
            onChange={(e) =>
              setFormData({ ...formData, fiscal_year: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de Início
          </label>
          <input
            type="time"
            value={formData.start_time}
            onChange={(e) =>
              setFormData({ ...formData, start_time: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora de Término
          </label>
          <input
            type="time"
            value={formData.end_time}
            onChange={(e) =>
              setFormData({ ...formData, end_time: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Aplicação
          </label>
          <select
            value={formData.application_type}
            onChange={(e) =>
              setFormData({ ...formData, application_type: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione um tipo</option>
            <option value="diagnostic">Diagnóstica</option>
            <option value="formative">Formativa</option>
            <option value="summative">Somativa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período de Avaliação
          </label>
          <select
            value={formData.assessment_period}
            onChange={(e) =>
              setFormData({ ...formData, assessment_period: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione um período</option>
            <option value="Q1">1º Bimestre</option>
            <option value="Q2">2º Bimestre</option>
            <option value="Q3">3º Bimestre</option>
            <option value="Q4">4º Bimestre</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          required
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="scheduled">Agendada</option>
          <option value="in_progress">Em Andamento</option>
          <option value="completed">Concluída</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          rows="3"
          value={formData.observations}
          onChange={(e) =>
            setFormData({ ...formData, observations: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="Informações adicionais sobre a aplicação..."
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar'}
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

const ResultsTab = ({ applications, examResults, students, exams, classes }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  // Filtra resultados quando uma aplicação é selecionada
  useEffect(() => {
    if (selectedApplication) {
      const filtered = examResults.filter(
        result => result.id_exam_application === selectedApplication
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  }, [selectedApplication, examResults]);

  // Busca nome do aluno
  const getStudentName = (studentId) => {
    const student = students.find(s => s.id_student === studentId);
    return student ? student.student_name : 'Aluno não encontrado';
  };

  // Busca informações da aplicação
  const getApplicationInfo = (applicationId) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return null;
    
    const exam = exams.find(e => e.id === app.id_exam);
    const cls = classes.find(c => c.id === app.id_class);
    
    return {
      examName: exam?.exam_name || 'N/A',
      className: cls?.class_name || 'N/A',
      date: app.application_date
    };
  };

  // Calcula estatísticas
  const calculateStats = () => {
    if (filteredResults.length === 0) return null;

    const totalScore = filteredResults.reduce((acc, r) => acc + parseFloat(r.total_score || 0), 0);
    const avgScore = totalScore / filteredResults.length;
    const maxPossible = filteredResults[0]?.max_score || 10;
    const avgPercentage = (avgScore / maxPossible) * 100;

    const passed = filteredResults.filter(r => (r.total_score / r.max_score) >= 0.7).length;
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

  // Modal de detalhes
  const ResultDetailsModal = ({ result, onClose }) => {
    if (!result) return null;

    const percentage = ((result.total_score / result.max_score) * 100).toFixed(1);
    const status = percentage >= 70 ? 'Aprovado' : 'Reprovado';
    const statusColor = percentage >= 70 ? 'text-green-600' : 'text-red-600';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Detalhes do Resultado</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Informações do Aluno */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Informações do Aluno</h4>
              <p className="text-gray-600">Nome: {getStudentName(result.id_student)}</p>
              <p className="text-gray-600">ID: {result.id_student}</p>
            </div>

            {/* Pontuação */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Pontuação</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nota Obtida</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {parseFloat(result.total_score).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nota Máxima</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {parseFloat(result.max_score).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Percentual</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        percentage >= 70 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className={`font-bold ${statusColor}`}>{percentage}%</span>
                </div>
                <p className={`mt-2 font-semibold ${statusColor}`}>
                  Status: {status}
                </p>
              </div>
            </div>

            {/* Detalhamento das Questões */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Detalhamento</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Acertos</p>
                  <p className="text-xl font-bold text-green-600">
                    {result.correct_answers || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Erros</p>
                  <p className="text-xl font-bold text-red-600">
                    {result.wrong_answers || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Em Branco</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {result.blank_answers || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Data de criação */}
            <div className="text-sm text-gray-500 text-right">
              Registrado em: {new Date(result.created_at).toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Resultados das Provas
      </h2>

      {/* Seletor de Aplicação */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecione uma aplicação para ver os resultados:
        </label>
        <select
          value={selectedApplication || ''}
          onChange={(e) => setSelectedApplication(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione uma aplicação...</option>
          {applications
            .filter(app => app.status === 'completed')
            .map((app) => {
              const info = getApplicationInfo(app.id);
              return (
                <option key={app.id} value={app.id}>
                  {info?.examName} - {info?.className} - {new Date(info?.date).toLocaleDateString('pt-BR')}
                </option>
              );
            })}
        </select>
      </div>

      {/* Estatísticas */}
      {selectedApplication && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total de Alunos</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Média Geral</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.averageScore} <span className="text-sm">({stats.averagePercentage}%)</span>
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Taxa de Aprovação</p>
            <p className="text-2xl font-bold text-green-600">{stats.passRate}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Aprovados / Reprovados</p>
            <p className="text-xl font-bold">
              <span className="text-green-600">{stats.passed}</span> / 
              <span className="text-red-600"> {stats.failed}</span>
            </p>
          </div>
        </div>
      )}

      {/* Tabela de Resultados */}
      {selectedApplication && filteredResults.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aluno
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Nota
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Percentual
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Acertos
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Erros
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((result) => {
                  const percentage = ((result.total_score / result.max_score) * 100).toFixed(1);
                  const isPassed = percentage >= 70;
                  
                  return (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {getStudentName(result.id_student)}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-900">
                        {parseFloat(result.total_score).toFixed(2)} / {parseFloat(result.max_score).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                isPassed ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className={`font-semibold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                            {percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-green-600 font-semibold">
                        {result.correct_answers || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-red-600 font-semibold">
                        {result.wrong_answers || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isPassed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isPassed ? 'Aprovado' : 'Reprovado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <button
                          onClick={() => {
                            setSelectedResult(result);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <Eye className="w-5 h-5 inline" />
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
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-lg text-gray-700 font-semibold mb-2">
            Nenhum resultado encontrado
          </p>
          <p className="text-gray-500">
            Esta aplicação ainda não possui resultados registrados.
          </p>
        </div>
      ) : null}
      {/* Mensagem quando nenhuma aplicação está selecionada */}
      {!selectedApplication && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <TrendingUp className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-2">
            Selecione uma aplicação para visualizar os resultados
          </p>
          <p className="text-gray-500">
            Escolha uma aplicação concluída no menu acima para ver as notas e estatísticas dos alunos.
          </p>
        </div>
      )}

      {/* Modal de Detalhes do Resultado */}
      {showDetails && (
        <ResultDetailsModal
          result={selectedResult}
          onClose={() => {
            setShowDetails(false);
            setSelectedResult(null);
          }}
        />
      )}
    </div>
  );
};

export default ExamsManagement;