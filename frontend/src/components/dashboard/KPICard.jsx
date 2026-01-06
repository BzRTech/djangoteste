import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KPICard = ({
  titulo,
  valor,
  variacao,
  icone: Icone,
  formato = 'numero',
  corIcone = 'blue',
  subtitulo
}) => {
  const formatarValor = (val) => {
    if (formato === 'porcentagem') {
      return `${val.toFixed(1)}%`;
    }
    if (formato === 'decimal') {
      return val.toFixed(1);
    }
    if (formato === 'moeda') {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    }
    return new Intl.NumberFormat('pt-BR').format(val);
  };

  const renderVariacao = () => {
    if (variacao === undefined || variacao === null) return null;

    const isPositiva = variacao > 0;
    const isNeutra = variacao === 0;

    let icon;
    let color;
    let prefix = '';

    if (isPositiva) {
      icon = <TrendingUp className="w-3.5 h-3.5" />;
      color = 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30';
      prefix = '+';
    } else if (isNeutra) {
      icon = <Minus className="w-3.5 h-3.5" />;
      color = 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    } else {
      icon = <TrendingDown className="w-3.5 h-3.5" />;
      color = 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    }

    const formatoVariacao = formato === 'porcentagem' ? 'pp' : '%';

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {icon}
        {prefix}{Math.abs(variacao).toFixed(1)}{formatoVariacao}
      </span>
    );
  };

  const coresIcone = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
    cyan: 'from-cyan-500 to-cyan-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {titulo}
          </p>
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatarValor(valor)}
            </p>
            {renderVariacao()}
          </div>
          {subtitulo && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {subtitulo}
            </p>
          )}
        </div>
        {Icone && (
          <div className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-br ${coresIcone[corIcone] || coresIcone.blue}`}>
            <Icone className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
