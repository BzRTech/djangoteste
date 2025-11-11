import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, GraduationCap, Target, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const DescriptorCatalog = () => {
  const [distractors, setDistractors] = useState([]);
  const [filteredDistractors, setFilteredDistractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedField, setSelectedField] = useState('');

  // Opções únicas para filtros
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    fetchDistractors();
  }, []);

  useEffect(() => {
    filterDistractors();
  }, [distractors, searchTerm, selectedSubject, selectedGrade, selectedField]);

  const fetchDistractors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/distractors/`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar descritores');
      }

      const data = await response.json();
      const distractorsArray = Array.isArray(data) ? data : (data.results || []);
      
      setDistractors(distractorsArray);
      
      // Extrair valores únicos para filtros
      const uniqueSubjects = [...new Set(distractorsArray.map(d => d.subject).filter(Boolean))];
      const uniqueGrades = [...new Set(distractorsArray.map(d => d.grade).filter(Boolean))];
      const uniqueFields = [...new Set(distractorsArray.map(d => d.learning_field).filter(Boolean))];
      
      setSubjects(uniqueSubjects.sort());
      setGrades(uniqueGrades.sort());
      setFields(uniqueFields.sort());
      
      setError(null);
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message);
      setDistractors([]);
    } finally {
      setLoading(false);
    }
  };

  const filterDistractors = () => {
    let filtered = [...distractors];

    // Filtro por busca textual
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(d => 
        d.distractor_name?.toLowerCase().includes(term) ||
        d.distractor_description?.toLowerCase().includes(term) ||
        d.distractor_code?.toLowerCase().includes(term)
      );
    }

    // Filtro por disciplina
    if (selectedSubject) {
      filtered = filtered.filter(d => d.subject === selectedSubject);
    }

    // Filtro por série
    if (selectedGrade) {
      filtered = filtered.filter(d => d.grade === selectedGrade);
    }

    // Filtro por campo de aprendizagem
    if (selectedField) {
      filtered = filtered.filter(d => d.learning_field === selectedField);
    }

    setFilteredDistractors(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setSelectedGrade('');
    setSelectedField('');
  };

  const hasActiveFilters = searchTerm || selectedSubject || selectedGrade || selectedField;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 text-lg">Carregando descritores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Verifique se o servidor Django está rodando em http://127.0.0.1:8000
          </p>
          <button 
            onClick={fetchDistractors}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Catálogo de Descritores</h1>
          </div>
          <p className="text-gray-600">
            Explore os descritores pedagógicos por disciplina, série e campo de aprendizagem
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total de Descritores</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{distractors.length}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Disciplinas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{subjects.length}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Séries</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{grades.length}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Filtrados</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{filteredDistractors.length}</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <Filter className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Filtros</h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca por texto */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por disciplina */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as disciplinas</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            {/* Filtro por série */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as séries</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>

            {/* Filtro por campo de aprendizagem */}
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os campos</option>
              {fields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Descritores */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Descritores Encontrados ({filteredDistractors.length})
            </h3>
          </div>

          {filteredDistractors.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Nenhum descritor encontrado com os filtros selecionados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-6">
              {filteredDistractors.map((distractor) => (
                <div
                  key={distractor.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {distractor.icon && (
                        <div className="bg-blue-100 p-3 rounded-full">
                          <span className="text-2xl">{distractor.icon}</span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">
                          {distractor.distractor_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Código: {distractor.distractor_code}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">
                    {distractor.distractor_description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {distractor.subject}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {distractor.grade}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {distractor.learning_field}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistractorCatalog;