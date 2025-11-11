import React, { useState, useEffect } from 'react';
import StatsCards from '../components/dashboard/StatsCards';
import ChartsGrid from '../components/dashboard/ChartsGrid';
import StudentsTable from '../components/dashboard/StudentsTable';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [studentsRes, classesRes, teachersRes, schoolsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/students/`),
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

      const studentsArray = Array.isArray(studentsData) ? studentsData : (studentsData.results || []);
      const classesArray = Array.isArray(classesData) ? classesData : (classesData.results || []);
      const teachersArray = Array.isArray(teachersData) ? teachersData : (teachersData.results || []);
      const schoolsArray = Array.isArray(schoolsData) ? schoolsData : (schoolsData.results || []);

      setStudents(studentsArray);
      setClasses(classesArray);
      setTeachers(teachersArray);
      setSchools(schoolsArray);
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

        {/* Students Table */}
        <StudentsTable students={students} />
      </div>
    </div>
  );
};

export default Dashboard;