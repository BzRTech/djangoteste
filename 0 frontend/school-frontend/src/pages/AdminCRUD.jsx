import React, { useState, useEffect } from 'react';
import { School, GraduationCap, BookOpen, Users, Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const AdminCRUD = () => {
  const [activeTab, setActiveTab] = useState('schools');
  const [data, setData] = useState({
    schools: [],
    teachers: [],
    classes: [],
    students: []
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const tabs = [
    { id: 'schools', label: 'Escolas', icon: School, color: 'blue' },
    { id: 'teachers', label: 'Professores', icon: GraduationCap, color: 'green' },
    { id: 'classes', label: 'Turmas', icon: BookOpen, color: 'purple' },
    { id: 'students', label: 'Alunos', icon: Users, color: 'orange' }
  ];

  useEffect(() => {
    fetchAllData();
    fetchCities();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [schoolsRes, teachersRes, classesRes, studentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/schools/`),
        fetch(`${API_BASE_URL}/teachers/`),
        fetch(`${API_BASE_URL}/classes/`),
        fetch(`${API_BASE_URL}/students/`)
      ]);

      const [schools, teachers, classes, students] = await Promise.all([
        schoolsRes.json(),
        teachersRes.json(),
        classesRes.json(),
        studentsRes.json()
      ]);

      setData({
        schools: Array.isArray(schools) ? schools : schools.results || [],
        teachers: Array.isArray(teachers) ? teachers : teachers.results || [],
        classes: Array.isArray(classes) ? classes : classes.results || [],
        students: Array.isArray(students) ? students : students.results || []
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cities/`);
      const citiesData = await response.json();
      setCities(Array.isArray(citiesData) ? citiesData : citiesData.results || []);
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este item?')) return;

    const endpoints = {
      schools: 'schools',
      teachers: 'teachers',
      classes: 'classes',
      students: 'students'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoints[activeTab]}/${id}/`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchAllData();
      } else {
        throw new Error('Erro ao deletar');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar item');
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

  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-600 hover:bg-orange-700'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Administração</h1>
          <p className="text-gray-600">Gerencie escolas, professores, turmas e alunos</p>
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
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <button
                    onClick={handleNew}
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${
                      colorClasses[tabs.find(t => t.id === activeTab)?.color]
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    Adicionar
                  </button>
                </div>

                {/* Tables */}
                {activeTab === 'schools' && <SchoolsTable data={data.schools} onEdit={handleEdit} onDelete={handleDelete} />}
                {activeTab === 'teachers' && <TeachersTable data={data.teachers} onEdit={handleEdit} onDelete={handleDelete} />}
                {activeTab === 'classes' && <ClassesTable data={data.classes} onEdit={handleEdit} onDelete={handleDelete} />}
                {activeTab === 'students' && <StudentsTable data={data.students} onEdit={handleEdit} onDelete={handleDelete} />}
              </>
            ) : (
              <>
                {activeTab === 'schools' && <SchoolForm item={editingItem} cities={cities} onClose={handleCloseForm} onSave={fetchAllData} />}
                {activeTab === 'teachers' && <TeacherForm item={editingItem} onClose={handleCloseForm} onSave={fetchAllData} />}
                {activeTab === 'classes' && <ClassForm item={editingItem} schools={data.schools} teachers={data.teachers} onClose={handleCloseForm} onSave={fetchAllData} />}
                {activeTab === 'students' && <StudentForm item={editingItem} classes={data.classes} onClose={handleCloseForm} onSave={fetchAllData} />}
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
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Escola</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diretor</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cidade</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((school) => (
          <tr key={school.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{school.school}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{school.director_name || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{school.city_name || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{school.state || '-'}</td>
            <td className="px-6 py-4 text-sm text-right">
              <button onClick={() => onEdit(school)} className="text-blue-600 hover:text-blue-800 mr-3">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(school.id)} className="text-red-600 hover:text-red-800">
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
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disciplinas</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((teacher) => (
          <tr key={teacher.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{teacher.teacher_name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{teacher.teacher_serial}</td>
            <td className="px-6 py-4 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs ${teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {teacher.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </td>
            <td className="px-6 py-4 text-sm">
              <div className="flex flex-wrap gap-1">
                {teacher.subject_details && teacher.subject_details.length > 0 ? (
                  teacher.subject_details.map((subject, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs whitespace-nowrap"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">Nenhuma disciplina</span>
                )}
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-right">
              <button onClick={() => onEdit(teacher)} className="text-blue-600 hover:text-blue-800 mr-3">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(teacher.id)} className="text-red-600 hover:text-red-800">
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
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turma</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Professor</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Escola</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Série</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ano</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((cls) => (
          <tr key={cls.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{cls.class_name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{cls.teacher_name || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{cls.school_name || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{cls.grade || '-'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{cls.school_year}</td>
            <td className="px-6 py-4 text-sm text-right">
              <button onClick={() => onEdit(cls)} className="text-blue-600 hover:text-blue-800 mr-3">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(cls.id)} className="text-red-600 hover:text-red-800">
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
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turma</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((student) => (
          <tr key={student.id_student} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.student_name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{student.student_serial}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{student.class_name || '-'}</td>
            <td className="px-6 py-4 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs ${student.status === 'enrolled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {student.status}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-right">
              <button onClick={() => onEdit(student)} className="text-blue-600 hover:text-blue-800 mr-3">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(student.id_student)} className="text-red-600 hover:text-red-800">
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
    school: item?.school || '',
    director_name: item?.director_name || '',
    id_city: item?.id_city || '',
    address: item?.address || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = item 
        ? `${API_BASE_URL}/schools/${item.id}/`
        : `${API_BASE_URL}/schools/`;
      
      const method = item ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar escola');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold mb-4">{item ? 'Editar' : 'Nova'} Escola</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Escola *</label>
        <input
          type="text"
          required
          value={formData.school}
          onChange={(e) => setFormData({...formData, school: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Diretor</label>
        <input
          type="text"
          value={formData.director_name}
          onChange={(e) => setFormData({...formData, director_name: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
        <select
          required
          value={formData.id_city}
          onChange={(e) => setFormData({...formData, id_city: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione uma cidade</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.city} - {city.state}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
    teacher_name: item?.teacher_name || '',
    teacher_serial: item?.teacher_serial || '',
    status: item?.status || 'active',
    subjects: [] // IDs das disciplinas selecionadas
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
      console.error('Erro ao carregar disciplinas:', error);
    }
  };

  const fetchTeacherSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/${item.id}/subjects/`);
      const data = await response.json();
      // Extrai apenas os IDs das disciplinas
      const subjectIds = data.map(ts => ts.id_subject);
      setFormData(prev => ({ ...prev, subjects: subjectIds }));
    } catch (error) {
      console.error('Erro ao carregar disciplinas do professor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectToggle = (subjectId) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter(id => id !== subjectId)
        : [...prev.subjects, subjectId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = item 
        ? `${API_BASE_URL}/teachers/${item.id}/`
        : `${API_BASE_URL}/teachers/`;
      
      const method = item ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        const error = await response.json();
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar professor: ' + (error.detail || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar professor');
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
      <h3 className="text-xl font-bold mb-4">{item ? 'Editar' : 'Novo'} Professor</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          type="text"
          required
          value={formData.teacher_name}
          onChange={(e) => setFormData({...formData, teacher_name: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula *</label>
        <input
          type="number"
          required
          value={formData.teacher_serial}
          onChange={(e) => setFormData({...formData, teacher_serial: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Disciplinas ({formData.subjects.length} selecionadas)
        </label>
        <div className="grid grid-cols-2 gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
          {allSubjects.length === 0 ? (
            <p className="col-span-2 text-gray-500 text-center">Nenhuma disciplina cadastrada</p>
          ) : (
            allSubjects.map((subject) => (
              <label key={subject.id} className="flex items-center hover:bg-gray-100 p-2 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.subjects.includes(subject.id)}
                  onChange={() => handleSubjectToggle(subject.id)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">{subject.subject_name}</span>
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
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Salvando...' : 'Salvar'}
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



const ClassForm = ({ item, schools, teachers, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    class_name: item?.class_name || '',
    id_teacher: item?.id_teacher || '',
    id_school: item?.id_school || '',
    school_year: item?.school_year || new Date().getFullYear(),
    grade: item?.grade || '',
    shift: item?.shift || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = item 
        ? `${API_BASE_URL}/classes/${item.id}/`
        : `${API_BASE_URL}/classes/`;
      
      const method = item ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar turma');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold mb-4">{item ? 'Editar' : 'Nova'} Turma</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Turma *</label>
          <input
            type="text"
            required
            value={formData.class_name}
            onChange={(e) => setFormData({...formData, class_name: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ano Letivo *</label>
          <input
            type="number"
            required
            value={formData.school_year}
            onChange={(e) => setFormData({...formData, school_year: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Escola *</label>
        <select
          required
          value={formData.id_school}
          onChange={(e) => setFormData({...formData, id_school: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione uma escola</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.school}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Professor *</label>
        <select
          required
          value={formData.id_teacher}
          onChange={(e) => setFormData({...formData, id_teacher: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Série</label>
          <input
            type="text"
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 5º ano"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
          <select
            value={formData.shift}
            onChange={(e) => setFormData({...formData, shift: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione um turno</option>
            <option value="morning">Manhã</option>
            <option value="afternoon">Tarde</option>
            <option value="evening">Noite</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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

const StudentForm = ({ item, classes, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    student_name: item?.student_name || '',
    student_serial: item?.student_serial || '',
    id_class: item?.id_class || '',
    enrollment_date: item?.enrollment_date || new Date().toISOString().split('T')[0],
    status: item?.status || 'enrolled'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = item 
        ? `${API_BASE_URL}/students/${item.id_student}/`
        : `${API_BASE_URL}/students/`;
      
      const method = item ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar aluno');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold mb-4">{item ? 'Editar' : 'Novo'} Aluno</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Aluno *</label>
        <input
          type="text"
          required
          value={formData.student_name}
          onChange={(e) => setFormData({...formData, student_name: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula *</label>
          <input
            type="number"
            required
            value={formData.student_serial}
            onChange={(e) => setFormData({...formData, student_serial: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Matrícula</label>
          <input
            type="date"
            value={formData.enrollment_date}
            onChange={(e) => setFormData({...formData, enrollment_date: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Turma *</label>
        <select
          required
          value={formData.id_class}
          onChange={(e) => setFormData({...formData, id_class: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="enrolled">Matriculado</option>
          <option value="transferred">Transferido</option>
          <option value="graduated">Formado</option>
          <option value="dropped">Desistente</option>
        </select>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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

export default AdminCRUD;