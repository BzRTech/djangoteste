import React from 'react';

const GaugeChart = ({
  valor,
  max = 100,
  label,
  sublabel,
  corBarra = 'blue',
  mostrarMeta,
  meta
}) => {
  const porcentagem = Math.min((valor / max) * 100, 100);

  // Determine color based on value thresholds
  const getCor = () => {
    if (corBarra === 'auto') {
      if (porcentagem >= 90) return 'stroke-emerald-500';
      if (porcentagem >= 75) return 'stroke-blue-500';
      if (porcentagem >= 60) return 'stroke-amber-500';
      return 'stroke-red-500';
    }
    const cores = {
      blue: 'stroke-blue-500',
      green: 'stroke-emerald-500',
      red: 'stroke-red-500',
      orange: 'stroke-orange-500',
      purple: 'stroke-purple-500'
    };
    return cores[corBarra] || cores.blue;
  };

  // Calculate the arc path
  const radius = 45;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (porcentagem / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg className="w-32 h-20 transform" viewBox="0 0 100 55">
          {/* Background arc */}
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className="stroke-gray-200 dark:stroke-gray-700"
          />

          {/* Value arc */}
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={`${getCor()} transition-all duration-500`}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />

          {/* Meta indicator */}
          {mostrarMeta && meta && (
            <circle
              cx={50 + 45 * Math.cos(Math.PI - (meta / max) * Math.PI)}
              cy={50 - 45 * Math.sin(Math.PI - (meta / max) * Math.PI)}
              r="3"
              className="fill-gray-600 dark:fill-gray-300"
            />
          )}
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof valor === 'number' ? valor.toFixed(1) : valor}
          </span>
        </div>
      </div>

      {/* Labels */}
      <div className="text-center mt-2">
        {label && (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </p>
        )}
        {sublabel && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {sublabel}
          </p>
        )}
        {mostrarMeta && meta && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Meta: {meta.toFixed(1)}
          </p>
        )}
      </div>
    </div>
  );
};

export default GaugeChart;
