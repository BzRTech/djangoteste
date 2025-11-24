import React, { useState, useEffect, useCallback } from "react";
import DescriptorFilters from "../components/descriptors/DescriptorFilters";
import DescriptorList from "../components/descriptors/DescriptorList";
import Pagination from "../components/Pagination";
import {
  AlertCircle,
  Target,
  BookOpen,
  GraduationCap,
  Filter,
  Database,
} from "lucide-react";
import Loading from "../components/Loading";
import StatCard from "../components/StatCard";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const DescriptorCatalog = () => {
  // Estados para TODOS os descritores (para filtros e contadores)
  const [allDescriptors, setAllDescriptors] = useState([]);

  // Estados para descritores PAGINADOS (para exibição)
  const [pagedDescriptors, setPagedDescriptors] = useState([]);

  // Estados de filtros e busca
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

  // Opções únicas para filtros (extraídas de TODOS os descritores)
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [fields, setFields] = useState([]);

  const ITEMS_PER_PAGE = 10;

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

  useEffect(() => {
    fetchDescriptors();
  }, []);

  const fetchDescriptors = async () => {
    try {
      setLoading(true);

      // Busca TODOS os descritores
      const allDescriptorsArray = await fetchAllData("/descriptors/");

      setAllDescriptors(allDescriptorsArray);
      setDescriptorCount(allDescriptorsArray.length);

      // Extrair valores únicos para filtros (de TODOS os descritores)
      const uniqueSubjects = [
        ...new Set(allDescriptorsArray.map((d) => d.subject).filter(Boolean)),
      ];
      const uniqueGrades = [
        ...new Set(allDescriptorsArray.map((d) => d.grade).filter(Boolean)),
      ];
      const uniqueFields = [
        ...new Set(
          allDescriptorsArray.map((d) => d.learning_field).filter(Boolean)
        ),
      ];

      setSubjects(uniqueSubjects.sort());
      setGrades(uniqueGrades.sort());
      // setFields(uniqueFields.sort());

      setError(null);
    } catch (err) {
      console.error("Erro:", err);
      setError(err.message);
      setAllDescriptors([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtra TODOS os descritores baseado nos critérios
  const filterDescriptors = useCallback(() => {
    let filtered = [...allDescriptors];

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

    // Calcula paginação baseado nos filtros
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    setDescriptorTotalPages(totalPages);

    // Reset para página 1 quando filtros mudam
    setDescriptorPage(1);
  }, [
    allDescriptors,
    searchTerm,
    selectedSubject,
    selectedGrade,
    selectedField,
  ]);

  useEffect(() => {
    filterDescriptors();
  }, [filterDescriptors]);

  // Pagina os descritores já filtrados
  useEffect(() => {
    const startIndex = (descriptorPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPagedDescriptors(filteredDescriptors.slice(startIndex, endIndex));
  }, [filteredDescriptors, descriptorPage]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("");
    setSelectedGrade("");
    setSelectedField("");
    setDescriptorPage(1);
  };

  const hasActiveFilters =
    searchTerm || selectedSubject || selectedGrade || selectedField;

  if (loading) {
    return <Loading />;
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
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
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

        {/* Stats Cards - Com TODOS os descritores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Descritores"
            value={allDescriptors.length}
            icon={Database}
            color="blue"
          />
          <StatCard
            title="Disciplinas"
            value={subjects.length}
            icon={BookOpen}
            color="green"
          />
          <StatCard
            title="Séries"
            value={grades.length}
            icon={GraduationCap}
            color="purple"
          />
          <StatCard
            title="Filtrados"
            value={filteredDescriptors.length}
            icon={Filter}
            color="orange"
          />
        </div>

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

        {/* Lista de Descritores - Com descritores PAGINADOS */}
        <DescriptorList filteredDescriptors={pagedDescriptors} />

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
