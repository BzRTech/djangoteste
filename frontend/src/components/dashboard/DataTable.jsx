import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({
  colunas,
  dados,
  itensPorPagina = 10,
  pesquisavel = true,
  ordenavel = true,
  renderLinha
}) => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState({ campo: null, direcao: 'asc' });
  const [busca, setBusca] = useState('');

  // Filter data based on search
  const dadosFiltrados = useMemo(() => {
    if (!busca.trim()) return dados;

    const termoBusca = busca.toLowerCase();
    return dados.filter(item =>
      Object.values(item).some(valor =>
        String(valor).toLowerCase().includes(termoBusca)
      )
    );
  }, [dados, busca]);

  // Sort data
  const dadosOrdenados = useMemo(() => {
    if (!ordenacao.campo) return dadosFiltrados;

    return [...dadosFiltrados].sort((a, b) => {
      const valorA = a[ordenacao.campo];
      const valorB = b[ordenacao.campo];

      if (typeof valorA === 'number' && typeof valorB === 'number') {
        return ordenacao.direcao === 'asc' ? valorA - valorB : valorB - valorA;
      }

      const stringA = String(valorA).toLowerCase();
      const stringB = String(valorB).toLowerCase();

      if (ordenacao.direcao === 'asc') {
        return stringA.localeCompare(stringB);
      }
      return stringB.localeCompare(stringA);
    });
  }, [dadosFiltrados, ordenacao]);

  // Paginate data
  const totalPaginas = Math.ceil(dadosOrdenados.length / itensPorPagina);
  const dadosPaginados = dadosOrdenados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const handleOrdenacao = (campo) => {
    if (!ordenavel) return;

    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  const renderIconeOrdenacao = (campo) => {
    if (ordenacao.campo !== campo) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    return ordenacao.direcao === 'asc'
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Search */}
      {pesquisavel && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              {colunas.map((coluna) => (
                <th
                  key={coluna.campo}
                  className={`
                    px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider
                    ${ordenavel && coluna.ordenavel !== false ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50' : ''}
                  `}
                  style={{ width: coluna.largura }}
                  onClick={() => coluna.ordenavel !== false && handleOrdenacao(coluna.campo)}
                >
                  <div className="flex items-center gap-1">
                    <span>{coluna.titulo}</span>
                    {ordenavel && coluna.ordenavel !== false && renderIconeOrdenacao(coluna.campo)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {dadosPaginados.length > 0 ? (
              dadosPaginados.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  {renderLinha ? (
                    renderLinha(item, index)
                  ) : (
                    colunas.map((coluna) => (
                      <td
                        key={coluna.campo}
                        className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {coluna.render
                          ? coluna.render(item[coluna.campo], item)
                          : item[coluna.campo]
                        }
                      </td>
                    ))
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={colunas.length}
                  className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Nenhum dado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {((paginaAtual - 1) * itensPorPagina) + 1} a {Math.min(paginaAtual * itensPorPagina, dadosOrdenados.length)} de {dadosOrdenados.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {paginaAtual} / {totalPaginas}
            </span>
            <button
              onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
