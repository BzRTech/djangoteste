import React from 'react';
import { AlertTriangle, XCircle, CheckCircle, Info, ArrowRight } from 'lucide-react';

const AlertCard = ({ tipo, mensagem, data, onClick }) => {
  const estilos = {
    CRITICO: {
      bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      icon: XCircle,
      iconColor: 'text-red-600 dark:text-red-400',
      dot: 'bg-red-500',
      hover: 'hover:bg-red-100 dark:hover:bg-red-900/30'
    },
    ATENCAO: {
      bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 dark:text-amber-400',
      dot: 'bg-amber-500',
      hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/30'
    },
    SUCESSO: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      dot: 'bg-emerald-500',
      hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
    },
    INFO: {
      bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      icon: Info,
      iconColor: 'text-blue-600 dark:text-blue-400',
      dot: 'bg-blue-500',
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
    }
  };

  const estilo = estilos[tipo] || estilos.INFO;
  const Icone = estilo.icon;

  const formatarData = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer
        ${estilo.bg} ${estilo.hover}
      `}
      onClick={onClick}
    >
      <div className={`flex-shrink-0 ${estilo.iconColor}`}>
        <Icone className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
          {mensagem}
        </p>
        {data && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {formatarData(data)}
          </p>
        )}
      </div>
      {onClick && (
        <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
      )}
    </div>
  );
};

export default AlertCard;
