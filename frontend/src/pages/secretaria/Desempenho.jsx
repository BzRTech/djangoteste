import React from 'react';
import {
  Award,
  BookOpen,
  Calculator,
  Target
} from 'lucide-react';
import {
  GaugeChart,
  LineChartTemporal,
  BarChartComparativo,
  StackedBarChart
} from '../../components/dashboard';
import { desempenhoAcademico } from '../../services/mockDataEducacao';

const Desempenho = () => {
  const {
    idebMedio,
    metaIdeb,
    proficienciaPortugues,
    proficienciaMatematica,
    evolucaoHistorica,
    comparativoEscolas,
    distribuicaoNiveis
  } = desempenhoAcademico;

  // Prepare data for comparison chart
  const dadosComparativo = comparativoEscolas
    .slice(0, 20)
    .map(e => ({
      ...e,
      escolaNome: e.escolaNome.replace('E.M. ', '')
    }));

  // Proficiency level classification
  const getNivelProficiencia = (valor, tipo) => {
    if (tipo === 'portugues') {
      if (valor >= 275) return { nivel: 'Avancado', cor: 'green' };
      if (valor >= 225) return { nivel: 'Adequado', cor: 'blue' };
      if (valor >= 175) return { nivel: 'Basico', cor: 'orange' };
      return { nivel: 'Insuficiente', cor: 'red' };
    } else {
      if (valor >= 300) return { nivel: 'Avancado', cor: 'green' };
      if (valor >= 250) return { nivel: 'Adequado', cor: 'blue' };
      if (valor >= 200) return { nivel: 'Basico', cor: 'orange' };
      return { nivel: 'Insuficiente', cor: 'red' };
    }
  };

  const nivelPortugues = getNivelProficiencia(proficienciaPortugues, 'portugues');
  const nivelMatematica = getNivelProficiencia(proficienciaMatematica, 'matematica');

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Desempenho Academico
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Indicadores de aprendizagem e IDEB da rede municipal
        </p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* IDEB */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">IDEB Medio da Rede</span>
          </div>
          <GaugeChart
            valor={idebMedio}
            max={10}
            label="IDEB"
            mostrarMeta={true}
            meta={metaIdeb}
            corBarra="auto"
          />
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <span className={`px-3 py-1 rounded-full ${
              idebMedio >= metaIdeb
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            }`}>
              {idebMedio >= metaIdeb ? 'Meta atingida' : 'Abaixo da meta'}
            </span>
          </div>
        </div>

        {/* Português */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Proficiencia em Portugues</span>
          </div>
          <GaugeChart
            valor={proficienciaPortugues}
            max={350}
            label="Escala SAEB"
            sublabel={nivelPortugues.nivel}
            corBarra={nivelPortugues.cor}
          />
          <div className="mt-4 text-center">
            <span className={`text-sm px-3 py-1 rounded-full bg-${nivelPortugues.cor}-100 text-${nivelPortugues.cor}-700 dark:bg-${nivelPortugues.cor}-900/30 dark:text-${nivelPortugues.cor}-400`}>
              Nivel: {nivelPortugues.nivel}
            </span>
          </div>
        </div>

        {/* Matemática */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Calculator className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Proficiencia em Matematica</span>
          </div>
          <GaugeChart
            valor={proficienciaMatematica}
            max={350}
            label="Escala SAEB"
            sublabel={nivelMatematica.nivel}
            corBarra={nivelMatematica.cor}
          />
          <div className="mt-4 text-center">
            <span className={`text-sm px-3 py-1 rounded-full bg-${nivelMatematica.cor}-100 text-${nivelMatematica.cor}-700 dark:bg-${nivelMatematica.cor}-900/30 dark:text-${nivelMatematica.cor}-400`}>
              Nivel: {nivelMatematica.nivel}
            </span>
          </div>
        </div>
      </div>

      {/* Historical Evolution */}
      <LineChartTemporal
        dados={evolucaoHistorica}
        linhas={[
          { campo: 'ideb', nome: 'IDEB', cor: '#3B82F6' },
          { campo: 'portugues', nome: 'Portugues (x0.02)', cor: '#8B5CF6' },
          { campo: 'matematica', nome: 'Matematica (x0.02)', cor: '#F59E0B' }
        ]}
        campoX="ano"
        titulo="Evolucao Historica dos Indicadores (2019-2023)"
        altura={300}
      />

      {/* School Comparison */}
      <BarChartComparativo
        dados={dadosComparativo}
        campoX="escolaNome"
        campoY="ideb"
        meta={metaIdeb}
        titulo="Comparativo IDEB por Escola"
        altura={600}
        horizontal={true}
      />

      {/* Proficiency Distribution */}
      <StackedBarChart
        dados={distribuicaoNiveis}
        barras={[
          { campo: 'insuficiente', nome: 'Insuficiente', cor: '#EF4444' },
          { campo: 'basico', nome: 'Basico', cor: '#F59E0B' },
          { campo: 'adequado', nome: 'Adequado', cor: '#3B82F6' },
          { campo: 'avancado', nome: 'Avancado', cor: '#10B981' }
        ]}
        campoX="escola"
        titulo="Distribuicao por Nivel de Proficiencia (Portugues)"
        altura={400}
        horizontal={true}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 text-center">
          <Target className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {comparativoEscolas.filter(e => e.atingiuMeta).length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Escolas na meta</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 text-center">
          <Target className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {comparativoEscolas.filter(e => !e.atingiuMeta && e.ideb >= metaIdeb - 0.5).length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Proximas da meta</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 text-center">
          <Target className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {comparativoEscolas.filter(e => e.ideb < metaIdeb - 0.5).length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Precisam atencao</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 text-center">
          <Award className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.max(...comparativoEscolas.map(e => e.ideb)).toFixed(1)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Maior IDEB</p>
        </div>
      </div>
    </div>
  );
};

export default Desempenho;
