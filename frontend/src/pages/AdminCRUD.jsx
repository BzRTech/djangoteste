import React, { useState, useEffect } from "react";
import {
  School,
  GraduationCap,
  BookOpen,
  Users,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import SearchableDropdown from "../components/SearchableDropdown";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const AdminCRUD = () => {
  const [activeTab, setActiveTab] = useState("schools");
  const [data, setData] = useState({
    schools: [],
    teachers: [],
    classes: [],
    students: [],
  });

  // Estados de paginação
  const [pagination, setPagination] = useState({
    schools: { page: 1, total: 1, count: 0 },
    teachers: { page: 1, total: 1, count: 0 },
    classes: { page: 1, total: 1, count: 0 },
    students: { page: 1, total: 1, count: 0 },
  });

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const ITEMS_PER_PAGE = 10;

  const tabs = [
    { id: "schools", label: "Escolas", icon: School, color: "blue" },
    {
      id: "teachers",
      label: "Professores",
      icon: GraduationCap,
      color: "green",
    },
    { id: "classes", label: "Turmas", icon: BookOpen, color: "purple" },
    { id: "students", label: "Alunos", icon: Users, color: "orange" },
    { id: "import", label: "Importar", icon: Upload, color: "indigo" },
  ];

  useEffect(() => {
    fetchAllData();
    fetchCities();
  }, [
    pagination.schools.page,
    pagination.teachers.page,
    pagination.classes.page,
    pagination.students.page,
  ]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [schoolsRes, teachersRes, classesRes, studentsRes] =
        await Promise.all([
          fetch(`${API_BASE_URL}/schools/?page=${pagination.schools.page}`),
          fetch(`${API_BASE_URL}/teachers/?page=${pagination.teachers.page}`),
          fetch(`${API_BASE_URL}/classes/?page=${pagination.classes.page}`),
          fetch(`${API_BASE_URL}/students/?page=${pagination.students.page}`),
        ]);

      const [schools, teachers, classes, students] = await Promise.all([
        schoolsRes.json(),
        teachersRes.json(),
        classesRes.json(),
        studentsRes.json(),
      ]);

      setData({
        schools: schools.results || [],
        teachers: teachers.results || [],
        classes: classes.results || [],
        students: students.results || [],
      });

      setPagination({
        schools: {
          page: pagination.schools.page,
          total: Math.ceil((schools.count || 0) / ITEMS_PER_PAGE),
          count: schools.count || 0,
        },
        teachers: {
          page: pagination.teachers.page,
          total: Math.ceil((teachers.count || 0) / ITEMS_PER_PAGE),
          count: teachers.count || 0,
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
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      let allCities = [];
      let page = 1;
      let hasMore = true;

      // Busca todas as páginas de cidades
      while (hasMore) {
        const response = await fetch(`${API_BASE_URL}/cities/?page=${page}`);
        const data = await response.json();
        const citiesList = Array.isArray(data) ? data : data.results || [];
        if (citiesList.length === 0) {
          hasMore = false;
        } else {
          allCities = [...allCities, ...citiesList];
          // Se não tem próxima página, para o loop
          if (!data.next) {
            hasMore = false;
          } else {
            page++;
          }
        }
      }
      setCities(allCities);
    } catch (error) {
      console.error("Erro ao carregar cidades:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este item?")) return;

    const endpoints = {
      schools: "schools",
      teachers: "teachers",
      classes: "classes",
      students: "students",
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/${endpoints[activeTab]}/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchAllData();
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
    indigo: "bg-indigo-600 hover:bg-indigo-700",
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Administração
          </h1>
          <p className="text-gray-600">
            Gerencie escolas, professores, turmas e alunos
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowForm(false);
                  }}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${isActive
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

          {/* Content */}
          <div className="p-6 bg-gray-50">
            {activeTab === "import" ? (
              <ImportStudents onImportSuccess={fetchAllData} />
            ) : !showForm ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {tabs.find((t) => t.id === activeTab)?.label} (
                    {pagination[activeTab].count})
                  </h2>
                  <button
                    onClick={handleNew}
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${colorClasses[tabs.find((t) => t.id === activeTab)?.color]
                      }`}
                  >
                    <Plus className="w-5 h-5" />
                    Adicionar
                  </button>
                </div>

                {/* Tables */}
                {activeTab === "schools" && (
                  <SchoolsTable
                    data={data.schools}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
                {activeTab === "teachers" && (
                  <TeachersTable
                    data={data.teachers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
                {activeTab === "classes" && (
                  <ClassesTable
                    data={data.classes}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
                {activeTab === "students" && (
                  <StudentsTable
                    data={data.students}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}

                {/* Paginação */}
                {pagination[activeTab].total > 1 && (
                  <div className="mt-6 p-6 bg-gray-50 border-t border-gray-200">
                    <Pagination
                      currentPage={pagination[activeTab].page}
                      totalPages={pagination[activeTab].total}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                {activeTab === "schools" && (
                  <SchoolForm
                    item={editingItem}
                    cities={cities}
                    onClose={handleCloseForm}
                    onSave={fetchAllData}
                  />
                )}
                {activeTab === "teachers" && (
                  <TeacherForm
                    item={editingItem}
                    onClose={handleCloseForm}
                    onSave={fetchAllData}
                  />
                )}
                {activeTab === "classes" && (
                  <ClassForm
                    item={editingItem}
                    schools={data.schools}
                    teachers={data.teachers}
                    onClose={handleCloseForm}
                    onSave={fetchAllData}
                  />
                )}
                {activeTab === "students" && (
                  <StudentForm
                    item={editingItem}
                    classes={data.classes}
                    onClose={handleCloseForm}
                    onSave={fetchAllData}
                  />
                )}
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

const SchoolsTable = ({ data, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Código IDEB
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Escola
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Diretor
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Cidade
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Estado
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            Ações
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((school) => (
          <tr key={school.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {school.codigo_ideb || "-"}
            </td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {school.school}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {school.director_name || "-"}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {school.city_name || "-"}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {school.state || "-"}
            </td>
            <td className="px-6 py-4 text-sm text-right">
              <button
                onClick={() => onEdit(school)}
                className="text-gray-600 hover:text-gray-800 mr-3"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(school.id)}
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
);

const TeachersTable = ({ data, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Nome
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Matrícula
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Disciplinas
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            Ações
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((teacher) => (
          <tr key={teacher.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {teacher.teacher_name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {teacher.teacher_serial}
            </td>
            <td className="px-6 py-4 text-sm">
              <span
                className={`px-2 py-1 rounded-full text-xs ${teacher.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
                  }`}
              >
                {teacher.status === "active" ? "Ativo" : "Inativo"}
              </span>
            </td>
            <td className="px-6 py-4 text-sm">
              <div className="flex flex-wrap gap-1">
                {teacher.subject_details &&
                  teacher.subject_details.length > 0 ? (
                  teacher.subject_details.map((subject, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs whitespace-nowrap"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">
                    Nenhuma disciplina
                  </span>
                )}
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-right">
              <button
                onClick={() => onEdit(teacher)}
                className="text-blue-600 hover:text-blue-800 mr-3"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(teacher.id)}
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
);

const ClassesTable = ({ data, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Turma
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Professor
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Escola
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Série
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Ano
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Turno
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            Ações
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((cls) => (
          <tr key={cls.id} className="hover:bg-gray-100">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {cls.class_name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {cls.teacher_name || "-"}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {cls.school_name || "-"}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {cls.grade || "-"}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {cls.school_year}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{cls.shift}</td>
            <td className="px-6 py-4 text-sm text-right">
              <button
                onClick={() => onEdit(cls)}
                className="text-gray-600 hover:text-gray-800 mr-3"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(cls.id)}
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
);

const StudentsTable = ({ data, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Nome
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Matrícula
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Turma
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
        {data.map((student) => (
          <tr key={student.id_student} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {student.student_name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {student.student_serial}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {student.class_name || "-"}
            </td>
            <td className="px-6 py-4 text-sm">
              <span
                className={`px-2 py-1 rounded-full text-xs ${student.status === "enrolled"
                  ? "bg-green-100 text-green-800"
                  : student.status === "transferred"
                    ? "bg-blue-100 text-blue-800"
                    : student.status === "graduated"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
              >
                {student.status === "enrolled"
                  ? "Matriculado"
                  : student.status === "transferred"
                    ? "Transferido"
                    : student.status === "graduated"
                      ? "Formado"
                      : student.status === "dropped"
                        ? "Desistente"
                        : student.status}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-right">
              <button
                onClick={() => onEdit(student)}
                className="text-blue-600 hover:text-blue-800 mr-3"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(student.id_student)}
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
);

// ============================================
// FORMULÁRIOS
// ============================================

const SchoolForm = ({ item, cities, onClose, onSave }) => {
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
    setSaving(true);

    try {
      const url = item
        ? `${API_BASE_URL}/schools/${item.id}/`
        : `${API_BASE_URL}/schools/`;

      const method = item ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        throw new Error("Erro ao salvar");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar escola");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold mb-4">
        {item ? "Editar" : "Nova"} Escola
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Código IDEB
        </label>
        <input
          type="text"
          value={formData.codigo_ideb}
          onChange={(e) => setFormData({ ...formData, codigo_ideb: e.target.value })}
          placeholder="Ex: 12345678"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome da Escola *
        </label>
        <input
          type="text"
          required
          value={formData.school}
          onChange={(e) => setFormData({ ...formData, school: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Diretor
        </label>
        <input
          type="text"
          value={formData.director_name}
          onChange={(e) =>
            setFormData({ ...formData, director_name: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <SearchableDropdown
          label="Cidade *"
          options={cities}
          value={formData.id_city}
          onChange={(value) => setFormData({ ...formData, id_city: value })}
          getOptionLabel={(city) => `${city.city} - ${city.state}`}
          getOptionValue={(city) => city.id}
          placeholder="Selecione uma cidade"
          searchPlaceholder="Pesquisar cidade..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Endereço
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
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
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Salvar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
      </div>
    </form>
  );
};

const TeacherForm = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    teacher_name: item?.teacher_name || "",
    teacher_serial: item?.teacher_serial || "",
    status: item?.status || "ativo",
    subjects: [], // IDs das disciplinas selecionadas
  });
  const [allSubjects, setAllSubjects] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
    if (item) {
      fetchTeacherSubjects();
    } else {
      setLoading(false);
    }
  }, [item]);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/`);
      const data = await response.json();
      setAllSubjects(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
    }
  };

  const fetchTeacherSubjects = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/teachers/${item.id}/subjects/`
      );
      const data = await response.json();
      // Extrai apenas os IDs das disciplinas
      const subjectIds = data.map((ts) => ts.id_subject);
      setFormData((prev) => ({ ...prev, subjects: subjectIds }));
    } catch (error) {
      console.error("Erro ao carregar disciplinas do professor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectToggle = (subjectId) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter((id) => id !== subjectId)
        : [...prev.subjects, subjectId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = item
        ? `${API_BASE_URL}/teachers/${item.id}/`
        : `${API_BASE_URL}/teachers/`;

      const method = item ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        const error = await response.json();
        console.error("Erro ao salvar:", error);
        alert(
          "Erro ao salvar professor: " + (error.detail || "Erro desconhecido")
        );
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar professor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold mb-4">
        {item ? "Editar" : "Novo"} Professor
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <input
          type="text"
          required
          value={formData.teacher_name}
          onChange={(e) =>
            setFormData({ ...formData, teacher_name: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Matrícula *
        </label>
        <input
          type="number"
          required
          value={formData.teacher_serial}
          onChange={(e) =>
            setFormData({ ...formData, teacher_serial: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <SearchableDropdown
          label="Status"
          options={[
            { value: 'active', label: 'Ativo' },
            { value: 'inactive', label: 'Inativo' }
          ]}
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value })}
          placeholder="Selecione o status"
          searchPlaceholder="Pesquisar status..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Disciplinas ({formData.subjects.length} selecionadas)
        </label>
        <div className="grid grid-cols-2 gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
          {allSubjects.length === 0 ? (
            <p className="col-span-2 text-gray-500 text-center">
              Nenhuma disciplina cadastrada
            </p>
          ) : (
            allSubjects.map((subject) => (
              <label
                key={subject.id}
                className="flex items-center hover:bg-gray-100 p-2 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.subjects.includes(subject.id)}
                  onChange={() => handleSubjectToggle(subject.id)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {subject.subject_name}
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
      </div>
    </form>
  );
};

const ClassForm = ({ item, schools: initialSchools, teachers: initialTeachers, onClose, onSave }) => {
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

  // Carrega TODAS as escolas e professores (sem paginação)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Buscar todas as escolas
        let allSchools = [];
        let page = 1;
        let hasMore = true;
        while (hasMore) {
          const response = await fetch(`${API_BASE_URL}/schools/?page=${page}`);
          const data = await response.json();
          const schoolsList = Array.isArray(data) ? data : data.results || [];
          if (schoolsList.length === 0) {
            hasMore = false;
          } else {
            allSchools = [...allSchools, ...schoolsList];
            if (!data.next) {
              hasMore = false;
            } else {
              page++;
            }
          }
        }

        // Buscar todos os professores
        let allTeachers = [];
        page = 1;
        hasMore = true;
        while (hasMore) {
          const response = await fetch(`${API_BASE_URL}/teachers/?page=${page}`);
          const data = await response.json();
          const teachersList = Array.isArray(data) ? data : data.results || [];
          if (teachersList.length === 0) {
            hasMore = false;
          } else {
            allTeachers = [...allTeachers, ...teachersList];
            if (!data.next) {
              hasMore = false;
            } else {
              page++;
            }
          }
        }

        setSchools(allSchools);
        setTeachers(allTeachers);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = item
        ? `${API_BASE_URL}/classes/${item.id}/`
        : `${API_BASE_URL}/classes/`;

      const method = item ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        throw new Error("Erro ao salvar");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar turma");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold mb-4">
        {item ? "Editar" : "Nova"} Turma
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Turma *
          </label>
          <input
            type="text"
            required
            value={formData.class_name}
            onChange={(e) =>
              setFormData({ ...formData, class_name: e.target.value })
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
        <SearchableDropdown
          label="Escola *"
          options={schools}
          value={formData.id_school}
          onChange={(value) => setFormData({ ...formData, id_school: value })}
          getOptionLabel={(school) => school.school}
          getOptionValue={(school) => school.id}
          placeholder="Selecione uma escola"
          searchPlaceholder="Pesquisar escola..."
        />
      </div>

      <div>
        <SearchableDropdown
          label="Professor *"
          options={teachers}
          value={formData.id_teacher}
          onChange={(value) => setFormData({ ...formData, id_teacher: value })}
          getOptionLabel={(teacher) => teacher.teacher_name}
          getOptionValue={(teacher) => teacher.id}
          placeholder="Selecione um professor"
          searchPlaceholder="Pesquisar professor..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Série
          </label>
          <input
            type="text"
            value={formData.grade}
            onChange={(e) =>
              setFormData({ ...formData, grade: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 5º ano"
          />
        </div>

        <div>
          <SearchableDropdown
            label="Turno"
            options={[
              { value: 'morning', label: 'Manhã' },
              { value: 'afternoon', label: 'Tarde' },
              { value: 'Integral', label: 'Integral' }
            ]}
            value={formData.shift}
            onChange={(value) => setFormData({ ...formData, shift: value })}
            placeholder="Selecione um turno"
            searchPlaceholder="Pesquisar turno..."
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Salvar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
      </div>
    </form>
  );
};

const StudentForm = ({ item, classes: initialClasses, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    student_name: item?.student_name || "",
    student_serial: item?.student_serial || "",
    id_class: item?.id_class || "",
    enrollment_date:
      item?.enrollment_date || new Date().toISOString().split("T")[0],
    status: item?.status || "enrolled",
  });
  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega TODAS as turmas (sem paginação)
  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        setLoading(true);
        let allClasses = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await fetch(`${API_BASE_URL}/classes/?page=${page}`);
          const data = await response.json();
          const classesList = Array.isArray(data) ? data : data.results || [];

          if (classesList.length === 0) {
            hasMore = false;
          } else {
            allClasses = [...allClasses, ...classesList];
            if (!data.next) {
              hasMore = false;
            } else {
              page++;
            }
          }
        }

        setClasses(allClasses);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = item
        ? `${API_BASE_URL}/students/${item.id_student}/`
        : `${API_BASE_URL}/students/`;

      const method = item ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        throw new Error("Erro ao salvar");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar aluno");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold mb-4">
        {item ? "Editar" : "Novo"} Aluno
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Aluno *
        </label>
        <input
          type="text"
          required
          value={formData.student_name}
          onChange={(e) =>
            setFormData({ ...formData, student_name: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matrícula *
          </label>
          <input
            type="number"
            required
            value={formData.student_serial}
            onChange={(e) =>
              setFormData({ ...formData, student_serial: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Matrícula
          </label>
          <input
            type="date"
            value={formData.enrollment_date}
            onChange={(e) =>
              setFormData({ ...formData, enrollment_date: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <SearchableDropdown
          label="Turma *"
          options={classes}
          value={formData.id_class}
          onChange={(value) => setFormData({ ...formData, id_class: value })}
          getOptionLabel={(cls) => `${cls.class_name} - ${cls.school_name}`}
          getOptionValue={(cls) => cls.id}
          placeholder="Selecione uma turma"
          searchPlaceholder="Pesquisar turma..."
        />
      </div>

      <div>
        <SearchableDropdown
          label="Status"
          options={[
            { value: 'enrolled', label: 'Matriculado' },
            { value: 'transferred', label: 'Transferido' },
            { value: 'graduated', label: 'Formado' },
            { value: 'dropped', label: 'Desistente' }
          ]}
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value })}
          placeholder="Selecione o status"
          searchPlaceholder="Pesquisar status..."
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Salvar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
      </div>
    </form>
  );
};

// ============================================
// COMPONENTE DE IMPORTAÇÃO
// ============================================

const ImportStudents = ({ onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [loadingSchools, setLoadingSchools] = useState(true);

  // Carrega TODAS as escolas ao montar o componente (percorre todas as páginas)
  useEffect(() => {
    const fetchAllSchools = async () => {
      try {
        setLoadingSchools(true);
        let allSchools = [];
        let page = 1;
        let hasMore = true;

        // Busca todas as páginas de escolas
        while (hasMore) {
          const response = await fetch(`${API_BASE_URL}/schools/?page=${page}`);
          const data = await response.json();
          const schoolsList = Array.isArray(data) ? data : data.results || [];

          if (schoolsList.length === 0) {
            hasMore = false;
          } else {
            allSchools = [...allSchools, ...schoolsList];
            // Se não tem próxima página, para o loop
            if (!data.next) {
              hasMore = false;
            } else {
              page++;
            }
          }
        }

        setSchools(allSchools);
        if (allSchools.length > 0) {
          setSelectedSchool(allSchools[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar escolas:", error);
      } finally {
        setLoadingSchools(false);
      }
    };
    fetchAllSchools();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecione um arquivo");
      return;
    }

    if (!selectedSchool) {
      alert("Por favor, selecione uma escola");
      return;
    }

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("school_id", selectedSchool);

    try {
      const response = await fetch(
        `${API_BASE_URL}/students/bulk_import/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          created: data.created,
          updated: data.updated,
          errors: data.errors,
          missing_classes: data.missing_classes,
          available_classes: data.available_classes,
          suggestion: data.suggestion,
        });
        setFile(null);
        onImportSuccess();
      } else {
        setResult({
          success: false,
          message: data.error || "Erro ao importar arquivo",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Erro ao conectar com o servidor",
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `Nome do Aluno,Matrícula,Turma,Data de Matrícula,Status
João Silva,12345,5º Ano A,2025-01-15,Matriculado
Maria Santos,12346,5º Ano A,2025-01-15,Matriculado
Pedro Oliveira,12347,5º Ano B,2025-01-15,Matriculado`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_estudantes.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Importar Alunos em Lote
        </h2>
        <p className="text-gray-600">
          Faça upload de um arquivo CSV ou Excel com os dados dos alunos
        </p>
      </div>

      {/* Download Template */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              Modelo de arquivo
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Baixe o modelo CSV com o formato correto para preencher os dados
              dos alunos
            </p>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Baixar Modelo CSV
            </button>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">
          Formato do arquivo
        </h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>
            <strong>Nome do Aluno</strong>: Nome completo do aluno (obrigatório)
          </li>
          <li>
            <strong>Matrícula</strong>: Número de matrícula do aluno (obrigatório,
            número único)
          </li>
          <li>
            <strong>Turma</strong>: Nome da turma (ex: "5º Ano A") ou ID da turma (obrigatório)
          </li>
          <li>
            <strong>Data de Matrícula</strong>: Data de matrícula (opcional,
            formato YYYY-MM-DD)
          </li>
          <li>
            <strong>Status</strong>: Status do aluno (opcional, padrão:
            enrolled)
          </li>
        </ul>
        <div className="mt-3 pt-3 border-t border-gray-300">
          <p className="text-xs text-gray-600">
            <strong>💡 Dica:</strong> Você pode usar tanto os nomes em português
            quanto em inglês nas colunas. O sistema aceita ambos os formatos!
          </p>
        </div>
      </div>

      {/* Seleção de Escola */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="block text-sm font-semibold text-gray-900 mb-2">
          <School className="w-4 h-4 inline-block mr-2 mb-1" />
          Selecione a Escola
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Escolha a escola para a qual deseja importar os alunos. As turmas serão filtradas por esta escola.
        </p>
        {loadingSchools ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Carregando escolas...</span>
          </div>
        ) : schools.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 inline-block mr-2" />
            <span className="text-sm text-yellow-800">
              Nenhuma escola cadastrada. Cadastre escolas antes de importar alunos.
            </span>
          </div>
        ) : (
          <SearchableDropdown
            options={schools}
            value={selectedSchool}
            onChange={(value) => setSelectedSchool(value)}
            getOptionLabel={(school) => school.school}
            getOptionValue={(school) => school.id}
            placeholder="Selecione uma escola..."
            searchPlaceholder="Pesquisar escola..."
          />
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-300 bg-white"
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload
          className={`w-12 h-12 mx-auto mb-4 ${dragActive ? "text-indigo-600" : "text-gray-400"
            }`}
        />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {file
            ? file.name
            : "Arraste o arquivo aqui ou clique para selecionar"}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Formatos aceitos: CSV, XLSX, XLS
        </p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Selecionar Arquivo
        </label>
      </div>

      {/* Upload Button */}
      {file && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Importar Alunos
              </>
            )}
          </button>
          <button
            onClick={() => {
              setFile(null);
              setResult(null);
            }}
            disabled={uploading}
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`mt-6 p-4 rounded-lg border ${result.success
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
            }`}
        >
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <h3
                className={`font-semibold mb-1 ${result.success ? "text-green-900" : "text-red-900"
                  }`}
              >
                {result.success ? "Importação concluída!" : "Erro na importação"}
              </h3>
              <p
                className={`text-sm mb-2 ${result.success ? "text-green-700" : "text-red-700"
                  }`}
              >
                {result.message}
              </p>

              {result.success && (
                <div className="flex gap-4 text-sm">
                  <span className="text-green-700">
                    <strong>{result.created}</strong> criados
                  </span>
                  <span className="text-green-700">
                    <strong>{result.updated}</strong> atualizados
                  </span>
                </div>
              )}

              {result.errors && result.errors.length > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="font-semibold text-yellow-900 mb-2">
                    Avisos ({result.errors.length}):
                  </p>
                  <ul className="text-xs text-yellow-800 space-y-1 max-h-40 overflow-y-auto">
                    {result.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>

                  {result.suggestion && (
                    <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
                      <p className="text-xs text-yellow-900 font-medium">
                        💡 {result.suggestion}
                      </p>
                    </div>
                  )}

                  {result.missing_classes && result.missing_classes.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-yellow-900 mb-2">
                        Turmas não encontradas: {result.missing_classes.join(', ')}
                      </p>
                      {result.available_classes && result.available_classes.length > 0 && (
                        <>
                          <p className="text-xs text-yellow-800 mb-2">
                            Turmas disponíveis no sistema:
                          </p>
                          <div className="max-h-32 overflow-y-auto bg-white rounded p-2 border border-yellow-200">
                            <ul className="text-xs text-gray-700 space-y-1">
                              {result.available_classes.map((cls) => (
                                <li key={cls.id} className="flex items-center gap-2">
                                  <span className="font-medium">{cls.name}</span>
                                  {cls.grade && (
                                    <span className="text-gray-500">({cls.grade})</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCRUD;