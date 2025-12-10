import React from 'react';

const FunnelChart = ({ dados, titulo, campoLabel, campoValor, altura = 400 }) => {
  if (!dados || dados.length === 0) return null;

  const maxValor = Math.max(...dados.map(d => d[campoValor]));
  const cores = [
    '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE',
    '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#172554'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      {titulo && (
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {titulo}
        </h3>
      )}
      <div className="space-y-2" style={{ minHeight: altura }}>
        {dados.map((item, index) => {
          const largura = ((item[campoValor] / maxValor) * 100).toFixed(1);
          const percentualAnterior = index > 0
            ? ((item[campoValor] / dados[index - 1][campoValor]) * 100).toFixed(1)
            : 100;

          return (
            <div key={index} className="group relative">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-16 text-right">
                  {item[campoLabel]}
                </span>
                <div className="flex-1 relative">
                  <div
                    className="h-8 rounded-r-lg transition-all duration-300 group-hover:opacity-80 flex items-center px-3"
                    style={{
                      width: `${largura}%`,
                      backgroundColor: cores[index % cores.length],
                      minWidth: '80px'
                    }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {item[campoValor].toLocaleString('pt-BR')}
                    </span>
                  </div>
                  {index > 0 && (
                    <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium ${
                      parseFloat(percentualAnterior) >= 95 ? 'text-emerald-600 dark:text-emerald-400' :
                      parseFloat(percentualAnterior) >= 90 ? 'text-blue-600 dark:text-blue-400' :
                      'text-amber-600 dark:text-amber-400'
                    }`}>
                      {percentualAnterior}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Percentual indica a taxa de progressão em relação à série anterior
      </div>
    </div>
  );
};

export default FunnelChart;
