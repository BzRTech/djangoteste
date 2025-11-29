import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Loader2 } from 'lucide-react';

/**
 * Componente Dropdown com pesquisa reutilizável
 *
 * @param {Object} props
 * @param {Array} props.options - Array de objetos com {value, label} ou array customizado
 * @param {string|number} props.value - Valor selecionado
 * @param {Function} props.onChange - Callback quando o valor muda
 * @param {string} props.placeholder - Texto placeholder
 * @param {boolean} props.loading - Estado de carregamento
 * @param {boolean} props.disabled - Desabilitar o componente
 * @param {string} props.error - Mensagem de erro
 * @param {string} props.label - Label do campo
 * @param {React.Component} props.icon - Ícone opcional (Lucide React)
 * @param {Function} props.getOptionLabel - Função para extrair o label do objeto (default: obj => obj.label)
 * @param {Function} props.getOptionValue - Função para extrair o value do objeto (default: obj => obj.value)
 * @param {string} props.searchPlaceholder - Placeholder do campo de pesquisa
 * @param {string} props.emptyMessage - Mensagem quando não há resultados
 * @param {string} props.className - Classes CSS adicionais
 */
const SearchableDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Selecione...',
  loading = false,
  disabled = false,
  error = '',
  label = '',
  icon: Icon = null,
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.value,
  searchPlaceholder = 'Pesquisar...',
  emptyMessage = 'Nenhum resultado encontrado',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focar no input de pesquisa ao abrir
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filtrar opções baseado no termo de pesquisa
  const filteredOptions = options.filter((option) => {
    if (!searchTerm) return true;

    const label = getOptionLabel(option);
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Encontrar a opção selecionada
  const selectedOption = options.find(
    (option) => getOptionValue(option) === value
  );

  const handleSelect = (option) => {
    const optionValue = getOptionValue(option);
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
      if (isOpen) {
        setSearchTerm('');
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {Icon && <Icon className="w-4 h-4 inline-block mr-2 mb-1" />}
          {label}
        </label>
      )}

      {/* Dropdown Button */}
      <div
        onClick={toggleDropdown}
        className={`
          w-full px-4 py-2 border rounded-lg cursor-pointer
          flex items-center justify-between
          transition-all duration-200
          ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-blue-400'}
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}
        `}
      >
        <span className={`flex-1 ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Carregando...
            </span>
          ) : (
            selectedOption ? getOptionLabel(selectedOption) : placeholder
          )}
        </span>

        <div className="flex items-center gap-2">
          {/* Clear Button */}
          {selectedOption && !disabled && !loading && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              type="button"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}

          {/* Chevron Icon */}
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown Menu */}
      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const optionValue = getOptionValue(option);
                const optionLabel = getOptionLabel(option);
                const isSelected = optionValue === value;

                return (
                  <div
                    key={`${optionValue}-${index}`}
                    onClick={() => handleSelect(option)}
                    className={`
                      px-4 py-2 cursor-pointer transition-colors
                      ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-900'}
                    `}
                  >
                    {optionLabel}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
