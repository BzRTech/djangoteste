import React from 'react';
import { Filter, Calendar, School, MapPin, Clock } from 'lucide-react';

const FilterBar = ({ filtros, onChange }) => {
  const handleChange = (campo, valor) => {
    onChange({ ...filtros, [campo]: valor });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Ano Letivo */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Ano Letivo
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filtros.anoLetivo}
              onChange={(e) => handleChange('anoLetivo', parseInt(e.target.value))}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
          </div>
        </div>

        {/* Etapa */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Etapa
          </label>
          <select
            value={filtros.etapa}
            onChange={(e) => handleChange('etapa', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TODOS">Todas</option>
            <option value="INFANTIL">Educação Infantil</option>
            <option value="FUNDAMENTAL_1">Fundamental I</option>
            <option value="FUNDAMENTAL_2">Fundamental II</option>
          </select>
        </div>

        {/* Escola */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Escola
          </label>
          <div className="relative">
            <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filtros.escola}
              onChange={(e) => handleChange('escola', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TODAS">Todas as Escolas</option>
            </select>
          </div>
        </div>

        {/* Zona */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Zona
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filtros.zona}
              onChange={(e) => handleChange('zona', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TODAS">Todas</option>
              <option value="URBANA">Urbana</option>
              <option value="RURAL">Rural</option>
            </select>
          </div>
        </div>

        {/* Turno */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Turno
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filtros.turno}
              onChange={(e) => handleChange('turno', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TODOS">Todos</option>
              <option value="MANHA">Manhã</option>
              <option value="TARDE">Tarde</option>
              <option value="INTEGRAL">Integral</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
