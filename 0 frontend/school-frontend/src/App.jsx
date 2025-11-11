import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, GraduationCap, School, BookOpen, TrendingUp, Award } from 'lucide-react';
import StudentTable from './components/StudentTable.jsx';
import DescriptorCatalog from './components/DescriptorCatalog.jsx';


const API_BASE_URL = 'http://127.0.0.1:8000/api';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('=== DASHBOARD MONTADO ===');
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log('🔄 Iniciando fetchData...');
    
    try {
      setLoading(true);
      console.log('📡 Fazendo requisições para:', API_BASE_URL);
      
      // Requisição para students
      console.log('📨 Buscando students...');
      const studentsRes = await fetch(`${API_BASE_URL}/students/`);
      console.log('✅ Students Response:', studentsRes.status, studentsRes.ok);
      const studentsData = await studentsRes.json();
      console.log('📦 Students Data:', studentsData);
      
      // Requisição para classes
      console.log('📨 Buscando classes...');
      const classesRes = await fetch(`${API_BASE_URL}/classes/`);
      console.log('✅ Classes Response:', classesRes.status, classesRes.ok);
      const classesData = await classesRes.json();
      console.log('📦 Classes Data:', classesData);
      
      // Requisição para teachers
      console.log('📨 Buscando teachers...');
      const teachersRes = await fetch(`${API_BASE_URL}/teachers/`);
      console.log('✅ Teachers Response:', teachersRes.status, teachersRes.ok);
      const teachersData = await teachersRes.json();
      console.log('📦 Teachers Data:', teachersData);
      
      // Requisição para schools
      console.log('📨 Buscando schools...');
      const schoolsRes = await fetch(`${API_BASE_URL}/schools/`);
      console.log('✅ Schools Response:', schoolsRes.status, schoolsRes.ok);
      const schoolsData = await schoolsRes.json();
      console.log('📦 Schools Data:', schoolsData);

      // Processar os dados
      const studentsArray = Array.isArray(studentsData) ? studentsData : (studentsData.results || []);
      const classesArray = Array.isArray(classesData) ? classesData : (classesData.results || []);
      const teachersArray = Array.isArray(teachersData) ? teachersData : (teachersData.results || []);
      const schoolsArray = Array.isArray(schoolsData) ? schoolsData : (schoolsData.results || []);

      console.log('📊 Arrays processados:', {
        students: studentsArray.length,
        classes: classesArray.length,
        teachers: teachersArray.length,
        schools: schoolsArray.length
      });

      setStudents(studentsArray);
      setClasses(classesArray);
      setTeachers(teachersArray);
      setSchools(schoolsArray);
      
      console.log('✅ State atualizado com sucesso!');
      console.log('📈 Students no state:', studentsArray);
      
      setError(null);
    } catch (err) {
      console.error('❌ ERRO:', err);
      console.error('❌ Mensagem:', err.message);
      console.error('❌ Stack:', err.stack);
      setError(err.message);
      setStudents([]);
      setClasses([]);
      setTeachers([]);
      setSchools([]);
    } finally {
      setLoading(false);
      console.log('🏁 fetchData finalizado');
    }
  };

  // Log quando students mudar
  useEffect(() => {
    console.log('🔄 Students state mudou:', students);
    console.log('🔄 Length:', students.length);
  }, [students]);

  // Dados para gráficos com verificações
  const studentsByClass = Array.isArray(classes) ? classes.map(cls => ({
    name: cls.class_name || 'Sem nome',
    alunos: Array.isArray(students) ? students.filter(s => s.id_class === cls.id).length : 0
  })) : [];

  const studentsByStatus = [
    { name: 'Ativos', value: Array.isArray(students) ? students.filter(s => s.status === 'ativo' || s.status === 'Ativo').length : 0 },
    { name: 'Inativos', value: Array.isArray(students) ? students.filter(s => s.status === 'inativo' || s.status === 'Inativo').length : 0 },
    { name: 'Outros', value: Array.isArray(students) ? students.filter(s => s.status !== 'ativo' && s.status !== 'Ativo' && s.status !== 'inativo' && s.status !== 'Inativo').length : 0 }
  ].filter(item => item.value > 0);

  const classesByGrade = Array.isArray(classes) ? classes.reduce((acc, cls) => {
    const grade = cls.grade || 'Não definido';
    const existing = acc.find(item => item.name === grade);
    if (existing) {
      existing.turmas += 1;
    } else {
      acc.push({ name: grade, turmas: 1 });
    }
    return acc;
  }, []) : [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  console.log('🎨 Renderizando Dashboard. Loading:', loading, 'Error:', error, 'Students:', students.length);

  if (loading) {
    console.log('⏳ Mostrando tela de loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('❌ Mostrando tela de erro:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <p className="text-sm text-gray-500 mb-4 text-center">Verifique se o servidor Django está rodando em http://127.0.0.1:8000</p>
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

  console.log('✅ Mostrando dashboard com dados');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Escolar</h1>
          <p className="text-gray-600">Visão geral do sistema de gestão educacional</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total de Alunos</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{students.length}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Turmas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{classes.length}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Professores</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{teachers.length}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Escolas</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{schools.length}</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <School className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
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

        {/* Tabela de Alunos */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Lista de Alunos
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turma</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Matrícula</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Nenhum aluno encontrado
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id_student} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.id_student}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.student_serial}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.student_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.class_name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.status === 'ativo' || student.status === 'Ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString('pt-BR') : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Dashboard;
