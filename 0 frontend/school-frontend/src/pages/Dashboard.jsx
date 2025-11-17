import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import StatsCards from '../components/dashboard/StatsCards';
import ChartsGrid from '../components/dashboard/ChartsGrid';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const Dashboard = () => {
  // Estados de dados
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de paginação
  const [studentPage, setStudentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [studentCount, setStudentCount] = useState(0);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchData();
  }, [studentPage]); // Recarrega quando muda de página

  const fetchData = async () => {
    try {
      setLoading(true);

      const [studentsRes, classesRes, teachersRes, schoolsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/students/?page=${studentPage}`),
        fetch(`${API_BASE_URL}/classes/`),
        fetch(`${API_BASE_URL}/teachers/`),
        fetch(`${API_BASE_URL}/schools/`)
      ]);

      const [studentsData, classesData, teachersData, schoolsData] = await Promise.all([
        studentsRes.json(),
        classesRes.json(),
        teachersRes.json(),
        schoolsRes.json()
      ]);

      // Processa dados de estudantes (com paginação)
      if (studentsData.results) {
        setStudents(studentsData.results);
        setStudentCount(studentsData.count || 0);
        setStudentTotalPages(Math.ceil((studentsData.count || 0) / ITEMS_PER_PAGE));
      } else {
        const studentArray = Array.isArray(studentsData) ? studentsData : [];
        setStudents(studentArray.slice((studentPage - 1) * ITEMS_PER_PAGE, studentPage * ITEMS_PER_PAGE));
        setStudentCount(studentArray.length);
        setStudentTotalPages(Math.ceil(studentArray.length / ITEMS_PER_PAGE));
      }

      // Processa dados de turmas
      const classArray = Array.isArray(classesData) ? classesData : (classesData.results || []);
      setClasses(classArray);

      // Processa dados de professores
      const teacherArray = Array.isArray(teachersData) ? teachersData : (teachersData.results || []);
      setTeachers(teacherArray);

      // Processa dados de escolas
      const schoolArray = Array.isArray(schoolsData) ? schoolsData : (schoolsData.results || []);
      setSchools(schoolArray);

      setError(null);
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message);
      setStudents([]);
      setClasses([]);
      setTeachers([]);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Verifique se o servidor Django está rodando em http://127.0.0.1:8000
          </p>
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
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Escolar</h1>
          <p className="text-gray-600">Visão geral do sistema de gestão educacional</p>
        </div>

        {/* Stats Cards */}
        <StatsCards 
          students={students}
          classes={classes}
          teachers={teachers}
          schools={schools}
        />

        {/* Charts */}
        <ChartsGrid 
          students={students}
          classes={classes}
        />

        {/* Tabela de Alunos com Paginação */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">
              Lista de Alunos ({studentCount} total)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matrícula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Matrícula
                  </th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.id_student}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.student_serial}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.student_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.class_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.status === 'enrolled' || student.status === 'Ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.enrollment_date 
                          ? new Date(student.enrollment_date).toLocaleDateString('pt-BR') 
                          : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <Pagination 
              currentPage={studentPage}
              totalPages={studentTotalPages}
              onPageChange={setStudentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;