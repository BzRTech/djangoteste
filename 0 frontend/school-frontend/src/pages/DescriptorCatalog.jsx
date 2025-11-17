import React, { useState, useEffect, useCallback } from "react";
import DescriptorStats from "../components/descriptors/DescriptorStats";
import DescriptorFilters from "../components/descriptors/DescriptorFilters";
import DescriptorList from "../components/descriptors/DescriptorList";
import Pagination from "../components/Pagination";
import { Loader2, AlertCircle, Target } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const DescriptorCatalog = () => {
  const [descriptors, setDescriptors] = useState([]);
  const [filteredDescriptors, setFilteredDescriptors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de paginação
  const [descriptorPage, setDescriptorPage] = useState(1);
  const [descriptorTotalPages, setDescriptorTotalPages] = useState(1);
  const [descriptorCount, setDescriptorCount] = useState(0);

  // Estados de filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedField, setSelectedField] = useState("");

  // Opções únicas para filtros
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [fields, setFields] = useState([]);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchDescriptors();
  }, [descriptorPage]);

  const filterDescriptors = useCallback(() => {
    let filtered = [...descriptors];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.descriptor_name?.toLowerCase().includes(term) ||
          d.descriptor_description?.toLowerCase().includes(term) ||
          d.descriptor_code?.toLowerCase().includes(term)
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter((d) => d.subject === selectedSubject);
    }

    if (selectedGrade) {
      filtered = filtered.filter((d) => d.grade === selectedGrade);
    }

    if (selectedField) {
      filtered = filtered.filter((d) => d.learning_field === selectedField);
    }

    setFilteredDescriptors(filtered);
  }, [descriptors, searchTerm, selectedSubject, selectedGrade, selectedField]);

  useEffect(() => {
    filterDescriptors();
  }, [filterDescriptors]);

  const fetchDescriptors = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/descriptors/?page=${descriptorPage}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar descritores");
      }

      const data = await response.json();
      const descriptorsArray = data.results || [];

      setDescriptors(descriptorsArray);
      setDescriptorCount(data.count || 0);
      setDescriptorTotalPages(
        Math.ceil((data.count || 0) / ITEMS_PER_PAGE)
      );

      // Extrair valores únicos para filtros (de todos os descritores)
      const uniqueSubjects = [
        ...new Set(descriptorsArray.map((d) => d.subject).filter(Boolean)),
      ];
      const uniqueGrades = [
        ...new Set(descriptorsArray.map((d) => d.grade).filter(Boolean)),
      ];
      const uniqueFields = [
        ...new Set(
          descriptorsArray.map((d) => d.learning_field).filter(Boolean)
        ),
      ];

      setSubjects(uniqueSubjects.sort());
      setGrades(uniqueGrades.sort());
      setFields(uniqueFields.sort());

      setError(null);
    } catch (err) {
      console.error("Erro:", err);
      setError(err.message);
      setDescriptors([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("");
    setSelectedGrade("");
    setSelectedField("");
  };

  const hasActiveFilters =
    searchTerm || selectedSubject || selectedGrade || selectedField;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 text-lg">
            Carregando descritores...
          </p>
        </div>
      </div>
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
          <p className="text-sm text-gray-500 mb-4 text-center">
            Verifique se o servidor Django está rodando em http://127.0.0.1:8000
          </p>
          <button
            onClick={fetchDescriptors}
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
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Catálogo de Descritores
            </h1>
          </div>
          <p className="text-gray-600">
            Explore os descritores pedagógicos por disciplina, série e campo de
            aprendizagem
          </p>
        </div>

        {/* Stats Cards */}
        <DescriptorStats
          descriptors={descriptors}
          subjects={subjects}
          grades={grades}
          filteredDescriptors={filteredDescriptors}
        />

        {/* Filtros */}
        <DescriptorFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          subjects={subjects}
          grades={grades}
          fields={fields}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
        />

        {/* Lista de Descritores */}
        <DescriptorList filteredDescriptors={filteredDescriptors} />

        {/* Paginação */}
        {descriptorTotalPages > 1 && (
          <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border-t border-gray-200">
            <Pagination
              currentPage={descriptorPage}
              totalPages={descriptorTotalPages}
              onPageChange={setDescriptorPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptorCatalog;