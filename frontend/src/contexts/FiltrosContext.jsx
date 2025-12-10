import React, { createContext, useContext, useState } from 'react';
import { escolas } from '../services/mockDataEducacao';

const FiltrosContext = createContext();

export const FiltrosProvider = ({ children }) => {
  const [filtros, setFiltros] = useState({
    anoLetivo: 2023,
    etapa: 'TODOS',
    escola: 'TODAS',
    zona: 'TODAS',
    turno: 'TODOS'
  });

  const atualizarFiltros = (novosFiltros) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }));
  };

  const resetarFiltros = () => {
    setFiltros({
      anoLetivo: 2023,
      etapa: 'TODOS',
      escola: 'TODAS',
      zona: 'TODAS',
      turno: 'TODOS'
    });
  };

  // Filter schools based on current filters
  const escolasFiltradas = escolas.filter(escola => {
    if (filtros.etapa !== 'TODOS' && escola.etapa !== filtros.etapa) return false;
    if (filtros.zona !== 'TODAS' && escola.zona !== filtros.zona) return false;
    if (filtros.escola !== 'TODAS' && escola.id !== filtros.escola) return false;
    return true;
  });

  // Get list of schools for dropdown
  const listaEscolas = escolas.map(e => ({ id: e.id, nome: e.nome }));

  return (
    <FiltrosContext.Provider value={{
      filtros,
      atualizarFiltros,
      resetarFiltros,
      escolasFiltradas,
      listaEscolas,
      todasEscolas: escolas
    }}>
      {children}
    </FiltrosContext.Provider>
  );
};

export const useFiltros = () => {
  const context = useContext(FiltrosContext);
  if (!context) {
    throw new Error('useFiltros deve ser usado dentro de um FiltrosProvider');
  }
  return context;
};

export default FiltrosContext;
