import React from 'react';

const ProgressBar = ({
  valor,
  max = 100,
  label,
  mostrarValor = true,
  cor = 'blue',
  tamanho = 'md',
  animado = false
}) => {
  const porcentagem = Math.min((valor / max) * 100, 100);

  const cores = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    auto: porcentagem >= 80 ? 'bg-emerald-500' : porcentagem >= 60 ? 'bg-blue-500' : porcentagem >= 40 ? 'bg-amber-500' : 'bg-red-500'
  };

  const tamanhos = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {(label || mostrarValor) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {label}
            </span>
          )}
          {mostrarValor && (
            <span className="text-sm font-semibold text-gray-900 dark:text-white ml-2">
              {porcentagem.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${tamanhos[tamanho]}`}>
        <div
          className={`
            ${tamanhos[tamanho]} rounded-full transition-all duration-500
            ${cores[cor] || cores.blue}
            ${animado ? 'animate-pulse' : ''}
          `}
          style={{ width: `${porcentagem}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
