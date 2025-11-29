import React from 'react';
import { Search, Filter } from 'lucide-react';
import SearchableDropdown from '../SearchableDropdown';

const DescriptorFilters = ({
  searchTerm,
  setSearchTerm,
  selectedSubject,
  setSelectedSubject,
  selectedGrade,
  setSelectedGrade,
  selectedField,
  setSelectedField,
  subjects,
  grades,
  fields,
  hasActiveFilters,
  clearFilters
}) => {
  return (
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
        <SearchableDropdown
          options={subjects.map(subject => ({ value: subject, label: subject }))}
          value={selectedSubject}
          onChange={(value) => setSelectedSubject(value)}
          placeholder="Todas as disciplinas"
          searchPlaceholder="Pesquisar disciplina..."
        />

        {/* Filtro por série */}
        <SearchableDropdown
          options={grades.map(grade => ({ value: grade, label: grade }))}
          value={selectedGrade}
          onChange={(value) => setSelectedGrade(value)}
          placeholder="Todas as séries"
          searchPlaceholder="Pesquisar série..."
        />

        {/* Filtro por campo de aprendizagem */}
        <SearchableDropdown
          options={fields.map(field => ({ value: field, label: field }))}
          value={selectedField}
          onChange={(value) => setSelectedField(value)}
          placeholder="Todos os campos"
          searchPlaceholder="Pesquisar campo..."
        />
      </div>
    </div>
  );
};

export default DescriptorFilters;