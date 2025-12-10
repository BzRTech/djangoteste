import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const StatusBadge = ({ tipo, texto, tamanho = 'md' }) => {
  const estilos = {
    SUCESSO: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      icon: CheckCircle,
      dot: 'bg-emerald-500'
    },
    ATENCAO: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
      icon: AlertTriangle,
      dot: 'bg-amber-500'
    },
    CRITICO: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
      icon: XCircle,
      dot: 'bg-red-500'
    },
    INFO: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-400',
      icon: Info,
      dot: 'bg-blue-500'
    },
    BOA: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      icon: CheckCircle,
      dot: 'bg-emerald-500'
    },
    REGULAR: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
      icon: AlertTriangle,
      dot: 'bg-amber-500'
    },
    PRECARIA: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
      icon: XCircle,
      dot: 'bg-red-500'
    },
    ALTA: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
      icon: XCircle,
      dot: 'bg-red-500'
    },
    MEDIA: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
      icon: AlertTriangle,
      dot: 'bg-amber-500'
    },
    BAIXA: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-400',
      icon: Info,
      dot: 'bg-blue-500'
    }
  };

  const tamanhos = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2'
  };

  const estilo = estilos[tipo] || estilos.INFO;
  const Icone = estilo.icon;

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${estilo.bg} ${estilo.text} ${tamanhos[tamanho]}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${estilo.dot}`} />
      {texto || tipo}
    </span>
  );
};

export default StatusBadge;
