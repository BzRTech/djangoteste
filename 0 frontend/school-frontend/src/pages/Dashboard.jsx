import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import StatsCards from '../components/dashboard/StatsCards';
import ChartsGrid from '../components/dashboard/ChartsGrid';
import Loading from '../components/Loading';


const API_BASE_URL = 'http://127.0.0.1:8000/api';

const Dashboard = () => {
  // Estados de dados - TODOS os dados (para gráficos)
  const [allStudents, setAllStudents] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [allSchools, setAllSchools] = useState([]);

  // Estados de dados - página atual (para tabela)
  const [pagedStudents, setPagedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de paginação
  const [studentPage, setStudentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [studentCount, setStudentCount] = useState(0);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchData();
  }, [studentPage]);

  // Função helper para buscar TODOS os dados de um endpoint (sem paginação)
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
          // Se a resposta tem menos itens que PAGE_SIZE, chegou ao final
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

  const fetchData = async () => {
    try {
      setLoading(true);

      // Buscar TODOS os dados para gráficos
      const [
        allStudentsArray,
        allClassesArray,
        allTeachersArray,
        allSchoolsArray,
        pagedStudentsRes
      ] = await Promise.all([
        fetchAllData('/students/'),
        fetchAllData('/classes/'),
        fetchAllData('/teachers/'),
        fetchAllData('/schools/'),
        fetch(`${API_BASE_URL}/students/?page=${studentPage}`)
      ]);

      // Salva todos os dados para gráficos
      setAllStudents(allStudentsArray);
      setAllClasses(allClassesArray);
      setAllTeachers(allTeachersArray);
      setAllSchools(allSchoolsArray);

      // Processa dados de estudantes PAGINADOS (para tabela)
      const pagedStudentsData = await pagedStudentsRes.json();

      if (pagedStudentsData.results) {
        setPagedStudents(pagedStudentsData.results);
        setStudentCount(pagedStudentsData.count || 0);
        setStudentTotalPages(Math.ceil((pagedStudentsData.count || 0) / ITEMS_PER_PAGE));
      } else {
        const studentArray = Array.isArray(pagedStudentsData) ? pagedStudentsData : [];
        setPagedStudents(studentArray.slice((studentPage - 1) * ITEMS_PER_PAGE, studentPage * ITEMS_PER_PAGE));
        setStudentCount(studentArray.length);
        setStudentTotalPages(Math.ceil(studentArray.length / ITEMS_PER_PAGE));
      }

      setError(null);
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message);
      setAllStudents([]);
      setAllClasses([]);
      setAllTeachers([]);
      setAllSchools([]);
      setPagedStudents([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading />
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
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Escolar</h1>
          <p className="text-gray-600">Visão geral do sistema de gestão educacional</p>
        </div>

        {/* Stats Cards - Com TODOS os dados */}
        <StatsCards
          students={allStudents}
          classes={allClasses}
          teachers={allTeachers}
          schools={allSchools}
        />

        {/* Charts - Com TODOS os dados */}
        <ChartsGrid
          students={allStudents}
          classes={allClasses}
        />

        {/* Tabela de Alunos com Paginação - Apenas página atual */}
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
                {pagedStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Nenhum aluno encontrado
                    </td>
                  </tr>
                ) : (
                  pagedStudents.map((student) => (
                    <tr key={student.id_student} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.id_student}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.student_serial}
                      </td>
                      {/* ✅ NOME AGORA É CLICÁVEL */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a
                          href={`/student/${student.id_student}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {student.student_name}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.class_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'enrolled' || student.status === 'Ativo'
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