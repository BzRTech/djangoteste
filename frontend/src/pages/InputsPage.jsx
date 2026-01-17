import React, { useState, useEffect, useCallback } from "react";
import {
  School,
  BookOpen,
  Users,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  Upload,
  CheckCircle,
  AlertCircle,
  Search,
  RefreshCw,
  Cloud,
  CloudUpload,
  ExternalLink,
  FileUp,
  Eye,
} from "lucide-react";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import SearchableDropdown from "../components/SearchableDropdown";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

const InputsPage = () => {
  const [activeTab, setActiveTab] = useState("schools");
  const [data, setData] = useState({
    schools: [],
    classes: [],
    students: [],
    exams: [],
  });

  const [pagination, setPagination] = useState({
    schools: { page: 1, total: 1, count: 0 },
    classes: { page: 1, total: 1, count: 0 },
    students: { page: 1, total: 1, count: 0 },
    exams: { page: 1, total: 1, count: 0 },
  });

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const ITEMS_PER_PAGE = 10;

  const tabs = [
    { id: "schools", label: "Escolas", icon: School, color: "blue" },
    { id: "classes", label: "Turmas", icon: BookOpen, color: "purple" },
    { id: "students", label: "Alunos", icon: Users, color: "orange" },
    { id: "exams", label: "Provas", icon: FileText, color: "green" },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [schoolsRes, classesRes, studentsRes, examsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/schools/?page=${pagination.schools.page}&search=${searchTerm}`),
        fetch(`${API_BASE_URL}/classes/?page=${pagination.classes.page}&search=${searchTerm}`),
        fetch(`${API_BASE_URL}/students/?page=${pagination.students.page}&search=${searchTerm}`),
        fetch(`${API_BASE_URL}/exams/?page=${pagination.exams.page}&search=${searchTerm}`),
      ]);

      const [schools, classes, students, exams] = await Promise.all([
        schoolsRes.json(),
        classesRes.json(),
        studentsRes.json(),
        examsRes.json(),
      ]);

      setData({
        schools: schools.results || [],
        classes: classes.results || [],
        students: students.results || [],
        exams: exams.results || [],
      });

      setPagination({
        schools: {
          page: pagination.schools.page,
          total: Math.ceil((schools.count || 0) / ITEMS_PER_PAGE),
          count: schools.count || 0,
        },
        classes: {
          page: pagination.classes.page,
          total: Math.ceil((classes.count || 0) / ITEMS_PER_PAGE),
          count: classes.count || 0,
        },
        students: {
          page: pagination.students.page,
          total: Math.ceil((students.count || 0) / ITEMS_PER_PAGE),
          count: students.count || 0,
        },
        exams: {
          page: pagination.exams.page,
          total: Math.ceil((exams.count || 0) / ITEMS_PER_PAGE),
          count: exams.count || 0,
        },
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.schools.page, pagination.classes.page, pagination.students.page, pagination.exams.page, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este item?")) return;

    const endpoints = { schools: "schools", classes: "classes", students: "students", exams: "exams" };

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoints[activeTab]}/${id}/`, { method: "DELETE" });
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

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], page: newPage },
    }));
  };

  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    orange: "bg-orange-600 hover:bg-orange-700",
  };

  const borderColors = {
    blue: "border-blue-600",
    green: "border-green-600",
    purple: "border-purple-600",
    orange: "border-orange-600",
  };

  const textColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  if (loading && data.schools.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Cadastros e Inputs</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie escolas, turmas, alunos e provas do sistema educacional</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = pagination[tab.id]?.count || 0;
            return (
              <div
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                  activeTab === tab.id ? `ring-2 ring-offset-2 ring-${tab.color}-500` : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-${tab.color}-100 text-${tab.color}-600`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{count}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tab.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? `border-b-2 ${borderColors[tab.color]} ${textColors[tab.color]}`
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6">
            {!showForm ? (
              <>
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {tabs.find((t) => t.id === activeTab)?.label}
                    </h2>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                      {pagination[activeTab].count} registros
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={fetchData}
                      disabled={loading}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Atualizar"
                    >
                      <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                    </button>

                    <button
                      onClick={handleNew}
                      className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${colorClasses[tabs.find((t) => t.id === activeTab)?.color]}`}
                    >
                      <Plus className="w-5 h-5" />
                      <span className="hidden sm:inline">Adicionar</span>
                    </button>
                  </div>
                </div>

                {/* Tables */}
                {activeTab === "schools" && <SchoolsTable data={data.schools} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />}
                {activeTab === "classes" && <ClassesTable data={data.classes} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />}
                {activeTab === "students" && <StudentsTable data={data.students} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />}
                {activeTab === "exams" && <ExamsTable data={data.exams} onEdit={handleEdit} onDelete={handleDelete} onRefresh={fetchData} loading={loading} />}

                {/* Pagination */}
                {pagination[activeTab].total > 1 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Pagination currentPage={pagination[activeTab].page} totalPages={pagination[activeTab].total} onPageChange={handlePageChange} />
                  </div>
                )}
              </>
            ) : (
              <>
                {activeTab === "schools" && <SchoolForm item={editingItem} onClose={handleCloseForm} onSave={fetchData} />}
                {activeTab === "classes" && <ClassForm item={editingItem} onClose={handleCloseForm} onSave={fetchData} />}
                {activeTab === "students" && <StudentForm item={editingItem} onClose={handleCloseForm} onSave={fetchData} />}
                {activeTab === "exams" && <ExamForm item={editingItem} onClose={handleCloseForm} onSave={fetchData} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TABELAS
// ============================================

const SchoolsTable = ({ data, onEdit, onDelete, loading }) => {
  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (data.length === 0) return <div className="text-center py-12 text-gray-500"><School className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>Nenhuma escola cadastrada</p></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Codigo IDEB</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Escola</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Diretor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Cidade</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Acoes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((school) => (
            <tr key={school.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">{school.codigo_ideb || "-"}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{school.school}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{school.director_name || "-"}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{school.city_name || "-"}</td>
              <td className="px-6 py-4 text-sm text-right">
                <button onClick={() => onEdit(school)} className="text-blue-600 hover:text-blue-800 mr-3"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => onDelete(school.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ClassesTable = ({ data, onEdit, onDelete, loading }) => {
  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>;
  if (data.length === 0) return <div className="text-center py-12 text-gray-500"><BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>Nenhuma turma cadastrada</p></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Turma</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Escola</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Professor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Serie</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Turno</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Acoes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((cls) => (
            <tr key={cls.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{cls.class_name}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{cls.school_name || "-"}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{cls.teacher_name || "-"}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{cls.grade || "-"}</td>
              <td className="px-6 py-4 text-sm"><span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{cls.shift === "morning" ? "Manha" : cls.shift === "afternoon" ? "Tarde" : cls.shift === "evening" ? "Noite" : cls.shift || "-"}</span></td>
              <td className="px-6 py-4 text-sm text-right">
                <button onClick={() => onEdit(cls)} className="text-purple-600 hover:text-purple-800 mr-3"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => onDelete(cls.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StudentsTable = ({ data, onEdit, onDelete, loading }) => {
  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-orange-600" /></div>;
  if (data.length === 0) return <div className="text-center py-12 text-gray-500"><Users className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>Nenhum aluno cadastrado</p></div>;

  const statusConfig = {
    enrolled: { label: "Matriculado", className: "bg-green-100 text-green-800" },
    transferred: { label: "Transferido", className: "bg-blue-100 text-blue-800" },
    graduated: { label: "Formado", className: "bg-purple-100 text-purple-800" },
    dropped: { label: "Desistente", className: "bg-red-100 text-red-800" },
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Matricula</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Turma</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Acoes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((student) => (
            <tr key={student.id_student} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">{student.student_serial}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{student.student_name}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{student.class_name || "-"}</td>
              <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[student.status]?.className || "bg-gray-100 text-gray-800"}`}>{statusConfig[student.status]?.label || student.status}</span></td>
              <td className="px-6 py-4 text-sm text-right">
                <button onClick={() => onEdit(student)} className="text-orange-600 hover:text-orange-800 mr-3"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => onDelete(student.id_student)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ExamsTable = ({ data, onEdit, onDelete, onRefresh, loading }) => {
  const [uploadingExam, setUploadingExam] = useState(null);

  const handleFileUpload = async (exam, file) => {
    if (!file) return;
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Tipo de arquivo nao permitido. Use: PDF, JPG, PNG");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert("Arquivo muito grande. Tamanho maximo: 50MB");
      return;
    }

    setUploadingExam(exam.id);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/exams/${exam.id}/upload_file/`, { method: "POST", body: formData });
      const result = await response.json();
      if (response.ok) {
        alert("Arquivo enviado com sucesso para o S3!");
        onRefresh();
      } else {
        alert(result.error || "Erro ao fazer upload");
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao fazer upload do arquivo");
    } finally {
      setUploadingExam(null);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;
  if (data.length === 0) return <div className="text-center py-12 text-gray-500"><FileText className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>Nenhuma prova cadastrada</p></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Codigo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nome da Prova</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Disciplina</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Questoes</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Arquivo S3</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Acoes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((exam) => (
            <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">{exam.exam_code}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{exam.exam_name}</td>
              <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-medium ${exam.subject?.toLowerCase().includes("mat") ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{exam.subject || "-"}</span></td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{exam.total_questions || 0}</td>
              <td className="px-6 py-4 text-sm">
                {uploadingExam === exam.id ? (
                  <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-green-600" /><span className="text-green-600">Enviando...</span></div>
                ) : exam.exam_file ? (
                  <a href={exam.exam_file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <Cloud className="w-4 h-4 text-green-600" /><span>Ver arquivo</span><ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <label className="cursor-pointer">
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload(exam, e.target.files[0])} />
                    <span className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors"><CloudUpload className="w-4 h-4" /><span>Upload S3</span></span>
                  </label>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-right">
                <button onClick={() => onEdit(exam)} className="text-green-600 hover:text-green-800 mr-3"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => onDelete(exam.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// FORMULARIOS
// ============================================

const SchoolForm = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    school: item?.school || "",
    director_name: item?.director_name || "",
    id_city: item?.id_city || "",
    address: item?.address || "",
    codigo_ideb: item?.codigo_ideb || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.school.trim()) { alert("Nome da escola e obrigatorio"); return; }
    if (!formData.id_city) { alert("Cidade e obrigatoria"); return; }

    setSaving(true);
    try {
      const url = item ? `${API_BASE_URL}/schools/${item.id}/` : `${API_BASE_URL}/schools/`;
      const response = await fetch(url, {
        method: item ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) { onSave(); onClose(); }
      else { const error = await response.json(); alert("Erro ao salvar: " + JSON.stringify(error)); }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar escola");
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg"><School className="w-6 h-6 text-blue-600" /></div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item ? "Editar" : "Nova"} Escola</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Codigo IDEB</label>
          <input type="text" value={formData.codigo_ideb} onChange={(e) => setFormData({ ...formData, codigo_ideb: e.target.value })} placeholder="Ex: 12345678" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Escola *</label>
          <input type="text" required value={formData.school} onChange={(e) => setFormData({ ...formData, school: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Diretor</label>
        <input type="text" value={formData.director_name} onChange={(e) => setFormData({ ...formData, director_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
      </div>

      <SearchableDropdown label="Cidade *" apiEndpoint="/cities/" value={formData.id_city} onChange={(value) => setFormData({ ...formData, id_city: value })} getOptionLabel={(city) => `${city.city} - ${city.state}`} getOptionValue={(city) => city.id} placeholder="Selecione uma cidade" searchPlaceholder="Pesquisar cidade..." />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereco</label>
        <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" onClick={onClose} className="flex items-center gap-2 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"><X className="w-4 h-4" />Cancelar</button>
      </div>
    </form>
  );
};

const ClassForm = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    class_name: item?.class_name || "",
    id_teacher: item?.id_teacher || "",
    id_school: item?.id_school || "",
    school_year: item?.school_year || new Date().getFullYear(),
    grade: item?.grade || "",
    shift: item?.shift || "",
  });
  const [saving, setSaving] = useState(false);
  const [schools, setSchools] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolsRes, teachersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/schools/?page_size=1000`),
          fetch(`${API_BASE_URL}/teachers/?page_size=1000`),
        ]);
        const schoolsData = await schoolsRes.json();
        const teachersData = await teachersRes.json();
        setSchools(schoolsData.results || schoolsData || []);
        setTeachers(teachersData.results || teachersData || []);
      } catch (error) { console.error("Erro ao carregar dados:", error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.class_name.trim()) { alert("Nome da turma e obrigatorio"); return; }
    if (!formData.id_school) { alert("Escola e obrigatoria"); return; }
    if (!formData.id_teacher) { alert("Professor e obrigatorio"); return; }

    setSaving(true);
    try {
      const url = item ? `${API_BASE_URL}/classes/${item.id}/` : `${API_BASE_URL}/classes/`;
      const response = await fetch(url, {
        method: item ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) { onSave(); onClose(); }
      else { const error = await response.json(); alert("Erro ao salvar: " + JSON.stringify(error)); }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar turma");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /><span className="ml-3 text-gray-600 dark:text-gray-400">Carregando...</span></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-lg"><BookOpen className="w-6 h-6 text-purple-600" /></div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item ? "Editar" : "Nova"} Turma</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Turma *</label>
          <input type="text" required value={formData.class_name} onChange={(e) => setFormData({ ...formData, class_name: e.target.value })} placeholder="Ex: 5A, 3B-Manha" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ano Letivo *</label>
          <input type="number" required value={formData.school_year} onChange={(e) => setFormData({ ...formData, school_year: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white" />
        </div>
      </div>

      <SearchableDropdown label="Escola *" options={schools} value={formData.id_school} onChange={(value) => setFormData({ ...formData, id_school: value })} getOptionLabel={(school) => school.school} getOptionValue={(school) => school.id} placeholder="Selecione uma escola" searchPlaceholder="Pesquisar escola..." />

      <SearchableDropdown label="Professor *" options={teachers} value={formData.id_teacher} onChange={(value) => setFormData({ ...formData, id_teacher: value })} getOptionLabel={(teacher) => teacher.teacher_name} getOptionValue={(teacher) => teacher.id} placeholder="Selecione um professor" searchPlaceholder="Pesquisar professor..." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serie</label>
          <input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} placeholder="Ex: 5 ano" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white" />
        </div>
        <SearchableDropdown label="Turno" options={[{ value: "morning", label: "Manha" }, { value: "afternoon", label: "Tarde" }, { value: "evening", label: "Noite" }]} value={formData.shift} onChange={(value) => setFormData({ ...formData, shift: value })} placeholder="Selecione um turno" />
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" onClick={onClose} className="flex items-center gap-2 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"><X className="w-4 h-4" />Cancelar</button>
      </div>
    </form>
  );
};

const StudentForm = ({ item, onClose, onSave }) => {
  const [mode, setMode] = useState("single");
  const [formData, setFormData] = useState({
    student_name: item?.student_name || "",
    student_serial: item?.student_serial || "",
    id_class: item?.id_class || "",
    enrollment_date: item?.enrollment_date || new Date().toISOString().split("T")[0],
    status: item?.status || "enrolled",
  });
  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importFile, setImportFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/classes/?page_size=1000`);
        const data = await response.json();
        setClasses(data.results || data || []);
      } catch (error) { console.error("Erro ao carregar turmas:", error); }
      finally { setLoading(false); }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_name.trim()) { alert("Nome do aluno e obrigatorio"); return; }
    if (!formData.student_serial) { alert("Matricula e obrigatoria"); return; }
    if (!formData.id_class) { alert("Turma e obrigatoria"); return; }

    setSaving(true);
    try {
      const url = item ? `${API_BASE_URL}/students/${item.id_student}/` : `${API_BASE_URL}/students/`;
      const response = await fetch(url, {
        method: item ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) { onSave(); onClose(); }
      else { const error = await response.json(); alert("Erro ao salvar: " + JSON.stringify(error)); }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar aluno");
    } finally { setSaving(false); }
  };

  const handleImport = async () => {
    if (!importFile) { alert("Selecione um arquivo"); return; }
    if (!selectedSchool) { alert("Selecione uma escola"); return; }

    setImporting(true);
    setImportResult(null);

    const formDataImport = new FormData();
    formDataImport.append("file", importFile);
    formDataImport.append("school_id", selectedSchool);

    try {
      const response = await fetch(`${API_BASE_URL}/students/bulk_import/`, { method: "POST", body: formDataImport });
      const data = await response.json();

      if (response.ok) {
        setImportResult({ success: true, message: data.message, created: data.created, updated: data.updated });
        onSave();
      } else {
        setImportResult({ success: false, message: data.error || "Erro ao importar arquivo" });
      }
    } catch (error) {
      setImportResult({ success: false, message: "Erro ao processar arquivo: " + error.message });
    } finally { setImporting(false); }
  };

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-orange-600" /><span className="ml-3 text-gray-600 dark:text-gray-400">Carregando...</span></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-lg"><Users className="w-6 h-6 text-orange-600" /></div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item ? "Editar Aluno" : "Cadastrar Alunos"}</h3>
        </div>
        {!item && (
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button type="button" onClick={() => setMode("single")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === "single" ? "bg-white dark:bg-gray-600 text-orange-600 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}>Individual</button>
            <button type="button" onClick={() => setMode("import")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === "import" ? "bg-white dark:bg-gray-600 text-orange-600 shadow-sm" : "text-gray-600 dark:text-gray-400"}`}>Importar CSV</button>
          </div>
        )}
      </div>

      {mode === "single" || item ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Aluno *</label>
            <input type="text" required value={formData.student_name} onChange={(e) => setFormData({ ...formData, student_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matricula *</label>
              <input type="number" required value={formData.student_serial} onChange={(e) => setFormData({ ...formData, student_serial: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Matricula</label>
              <input type="date" value={formData.enrollment_date} onChange={(e) => setFormData({ ...formData, enrollment_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <SearchableDropdown label="Turma *" options={classes} value={formData.id_class} onChange={(value) => setFormData({ ...formData, id_class: value })} getOptionLabel={(cls) => `${cls.class_name} - ${cls.school_name || "Sem escola"}`} getOptionValue={(cls) => cls.id} placeholder="Selecione uma turma" searchPlaceholder="Pesquisar turma..." />

          <SearchableDropdown label="Status" options={[{ value: "enrolled", label: "Matriculado" }, { value: "transferred", label: "Transferido" }, { value: "graduated", label: "Formado" }, { value: "dropped", label: "Desistente" }]} value={formData.status} onChange={(value) => setFormData({ ...formData, status: value })} placeholder="Selecione o status" />

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" onClick={onClose} className="flex items-center gap-2 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"><X className="w-4 h-4" />Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <SearchableDropdown label="Escola *" apiEndpoint="/schools/" value={selectedSchool} onChange={setSelectedSchool} getOptionLabel={(school) => school.school} getOptionValue={(school) => school.id} placeholder="Selecione uma escola" searchPlaceholder="Pesquisar escola..." />

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
            <FileUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">Arraste um arquivo CSV aqui ou</p>
            <label className="cursor-pointer">
              <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={(e) => { setImportFile(e.target.files[0]); setImportResult(null); }} />
              <span className="text-orange-600 hover:text-orange-700 font-medium">clique para selecionar</span>
            </label>
            {importFile && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg inline-flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700 dark:text-gray-300">{importFile.name}</span>
                <button onClick={() => setImportFile(null)} className="text-gray-500 hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Formato do CSV:</h4>
            <code className="text-xs bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">nome_aluno, matricula, turma, data_matricula (opcional), status (opcional)</code>
          </div>

          {importResult && (
            <div className={`p-4 rounded-lg ${importResult.success ? "bg-green-50 dark:bg-green-900/20 text-green-800" : "bg-red-50 dark:bg-red-900/20 text-red-800"}`}>
              <div className="flex items-center gap-2 mb-2">{importResult.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}<span className="font-medium">{importResult.message}</span></div>
              {importResult.success && <div className="text-sm"><p>Criados: {importResult.created}</p><p>Atualizados: {importResult.updated}</p></div>}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={handleImport} disabled={importing || !importFile || !selectedSchool} className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors">
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}{importing ? "Importando..." : "Importar Alunos"}
            </button>
            <button type="button" onClick={onClose} className="flex items-center gap-2 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"><X className="w-4 h-4" />Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ExamForm = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    exam_code: item?.exam_code || "",
    exam_name: item?.exam_name || "",
    subject: item?.subject || "",
    school_year: item?.school_year || new Date().getFullYear(),
    total_questions: item?.total_questions || 0,
    description: item?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [examFile, setExamFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.exam_code.trim()) { alert("Codigo da prova e obrigatorio"); return; }
    if (!formData.exam_name.trim()) { alert("Nome da prova e obrigatorio"); return; }

    setSaving(true);
    try {
      const url = item ? `${API_BASE_URL}/exams/${item.id}/` : `${API_BASE_URL}/exams/`;
      const response = await fetch(url, {
        method: item ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedExam = await response.json();
        if (examFile && savedExam.id) {
          await handleFileUpload(savedExam.id);
        }
        onSave();
        onClose();
      } else {
        const error = await response.json();
        alert("Erro ao salvar: " + JSON.stringify(error));
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar prova");
    } finally { setSaving(false); }
  };

  const handleFileUpload = async (examId) => {
    if (!examFile) return;

    setUploading(true);
    const formDataFile = new FormData();
    formDataFile.append("file", examFile);

    try {
      const response = await fetch(`${API_BASE_URL}/exams/${examId}/upload_file/`, { method: "POST", body: formDataFile });
      const result = await response.json();

      if (response.ok) {
        setUploadResult({ success: true, message: "Arquivo enviado com sucesso para o S3!", url: result.file_url });
      } else {
        setUploadResult({ success: false, message: result.error || "Erro ao fazer upload" });
      }
    } catch (error) {
      setUploadResult({ success: false, message: "Erro ao enviar arquivo: " + error.message });
    } finally { setUploading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-lg"><FileText className="w-6 h-6 text-green-600" /></div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item ? "Editar" : "Nova"} Prova</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Codigo da Prova *</label>
          <input type="text" required value={formData.exam_code} onChange={(e) => setFormData({ ...formData, exam_code: e.target.value })} placeholder="Ex: PROVA2024_MAT_5" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Prova *</label>
          <input type="text" required value={formData.exam_name} onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })} placeholder="Ex: Prova de Matematica - 5 Ano" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SearchableDropdown label="Disciplina" options={[{ value: "Matematica", label: "Matematica" }, { value: "Portugues", label: "Portugues" }, { value: "Ciencias", label: "Ciencias" }, { value: "Historia", label: "Historia" }, { value: "Geografia", label: "Geografia" }]} value={formData.subject} onChange={(value) => setFormData({ ...formData, subject: value })} placeholder="Selecione" />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ano Escolar</label>
          <input type="number" value={formData.school_year} onChange={(e) => setFormData({ ...formData, school_year: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total de Questoes</label>
          <input type="number" value={formData.total_questions} onChange={(e) => setFormData({ ...formData, total_questions: parseInt(e.target.value) || 0 })} min="0" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descricao</label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Descricao da prova (opcional)" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white resize-none" />
      </div>

      {/* Upload S3 */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CloudUpload className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white">Arquivo da Prova (PDF/Imagem)</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload para Amazon S3 - Max 50MB</p>
            </div>
          </div>
          {item?.exam_file && (
            <a href={item.exam_file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800"><Eye className="w-4 h-4" />Ver arquivo atual</a>
          )}
        </div>

        <label className="cursor-pointer block">
          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => { setExamFile(e.target.files[0]); setUploadResult(null); }} />
          <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            {examFile ? (
              <><FileText className="w-5 h-5 text-green-600" /><span className="text-gray-700 dark:text-gray-300">{examFile.name}</span><button type="button" onClick={(e) => { e.preventDefault(); setExamFile(null); }} className="text-gray-500 hover:text-red-500"><X className="w-4 h-4" /></button></>
            ) : (
              <><Upload className="w-5 h-5 text-gray-400" /><span className="text-gray-500 dark:text-gray-400">Clique para selecionar um arquivo</span></>
            )}
          </div>
        </label>

        {uploadResult && (
          <div className={`mt-4 p-3 rounded-lg ${uploadResult.success ? "bg-green-50 dark:bg-green-900/20 text-green-700" : "bg-red-50 dark:bg-red-900/20 text-red-700"}`}>
            <div className="flex items-center gap-2">{uploadResult.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}<span>{uploadResult.message}</span></div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="submit" disabled={saving || uploading} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
          {saving || uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? "Salvando..." : uploading ? "Enviando arquivo..." : "Salvar Prova"}
        </button>
        <button type="button" onClick={onClose} className="flex items-center gap-2 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"><X className="w-4 h-4" />Cancelar</button>
      </div>
    </form>
  );
};

export default InputsPage;
