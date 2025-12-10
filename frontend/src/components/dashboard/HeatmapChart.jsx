import React from 'react';

const HeatmapChart = ({
  dados,
  campoLinha,
  colunas,
  titulo,
  valorMin = 0,
  valorMax = 100
}) => {
  const getCor = (valor) => {
    const porcentagem = ((valor - valorMin) / (valorMax - valorMin)) * 100;

    if (porcentagem <= 10) return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200';
    if (porcentagem <= 20) return 'bg-emerald-200 dark:bg-emerald-800/40 text-emerald-900 dark:text-emerald-100';
    if (porcentagem <= 30) return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200';
    if (porcentagem <= 40) return 'bg-yellow-200 dark:bg-yellow-800/40 text-yellow-900 dark:text-yellow-100';
    if (porcentagem <= 50) return 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200';
    if (porcentagem <= 60) return 'bg-orange-200 dark:bg-orange-800/40 text-orange-900 dark:text-orange-100';
    if (porcentagem <= 70) return 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200';
    if (porcentagem <= 80) return 'bg-red-200 dark:bg-red-800/40 text-red-900 dark:text-red-100';
    return 'bg-red-300 dark:bg-red-700/40 text-red-900 dark:text-red-100';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      {titulo && (
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {titulo}
        </h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Escola
              </th>
              {colunas.map((col) => (
                <th
                  key={col.campo}
                  className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                >
                  {col.titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {dados.map((linha, index) => (
              <tr key={index}>
                <td className="px-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {linha[campoLinha]}
                </td>
                {colunas.map((col) => {
                  const valor = linha.series?.find(s => s.serie === col.campo)?.percentualDistorcao || linha[col.campo] || 0;
                  return (
                    <td key={col.campo} className="px-1 py-1">
                      <div
                        className={`
                          w-full h-8 rounded flex items-center justify-center text-xs font-medium
                          ${getCor(valor)}
                        `}
                      >
                        {valor.toFixed(0)}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-xs">
        <span className="text-gray-500 dark:text-gray-400">Menor</span>
        <div className="flex">
          <div className="w-6 h-4 bg-emerald-200 dark:bg-emerald-800/40" />
          <div className="w-6 h-4 bg-yellow-200 dark:bg-yellow-800/40" />
          <div className="w-6 h-4 bg-orange-200 dark:bg-orange-800/40" />
          <div className="w-6 h-4 bg-red-200 dark:bg-red-800/40" />
          <div className="w-6 h-4 bg-red-300 dark:bg-red-700/40" />
        </div>
        <span className="text-gray-500 dark:text-gray-400">Maior</span>
      </div>
    </div>
  );
};

export default HeatmapChart;
