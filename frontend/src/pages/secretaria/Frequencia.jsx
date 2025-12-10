import React from 'react';
import {
  Calendar,
  UserX,
  AlertTriangle,
  TrendingDown
} from 'lucide-react';
import {
  KPICard,
  LineChartTemporal,
  DataTable,
  StatusBadge
} from '../../components/dashboard';
import { frequencia } from '../../services/mockDataEducacao';

const Frequencia = () => {
  const {
    taxaFrequenciaGeral,
    totalAbsenteismoCronico,
    totalInfrequentes,
    frequenciaMensal,
    porEscola,
    alunosCriticos
  } = frequencia;

  // Table columns for schools
  const colunasEscolas = [
    { campo: 'escolaNome', titulo: 'Escola', largura: '40%' },
    {
      campo: 'frequencia',
      titulo: 'Frequencia',
      render: (valor) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          valor >= 95 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
          valor >= 90 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
          valor >= 85 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {valor.toFixed(1)}%
        </span>
      )
    },
    { campo: 'alunosCriticos', titulo: 'Alunos Criticos' }
  ];

  // Table columns for critical students
  const colunasAlunos = [
    { campo: 'nome', titulo: 'Nome', largura: '25%' },
    { campo: 'escola', titulo: 'Escola', largura: '20%',
      render: (valor) => valor.replace('E.M. ', '')
    },
    { campo: 'serie', titulo: 'Serie', largura: '10%' },
    {
      campo: 'percentualFaltas',
      titulo: '% Faltas',
      render: (valor) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          valor >= 30 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
          valor >= 25 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        }`}>
          {valor.toFixed(1)}%
        </span>
      )
    },
    { campo: 'faltas', titulo: 'Total Faltas' },
    {
      campo: 'percentualFaltas',
      titulo: 'Situacao',
      ordenavel: false,
      render: (valor) => {
        if (valor >= 30) return <StatusBadge tipo="CRITICO" texto="Critico" tamanho="sm" />;
        if (valor >= 25) return <StatusBadge tipo="ATENCAO" texto="Atencao" tamanho="sm" />;
        return <StatusBadge tipo="INFO" texto="Monitorar" tamanho="sm" />;
      }
    }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Frequencia e Presenca
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Monitoramento de frequencia escolar e absenteismo
        </p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          titulo="Frequencia Geral"
          valor={taxaFrequenciaGeral}
          variacao={-0.3}
          formato="porcentagem"
          icone={Calendar}
          corIcone="blue"
          subtitulo="Media da rede"
        />
        <KPICard
          titulo="Absenteismo Cronico"
          valor={totalAbsenteismoCronico}
          icone={UserX}
          corIcone="orange"
          subtitulo="Alunos com >10% faltas"
        />
        <KPICard
          titulo="Infrequentes"
          valor={totalInfrequentes}
          icone={AlertTriangle}
          corIcone="red"
          subtitulo="Alunos com >25% faltas"
        />
      </div>

      {/* Frequency Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-xl p-6 ${
          taxaFrequenciaGeral >= 95 ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' :
          taxaFrequenciaGeral >= 90 ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' :
          'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
        }`}>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{taxaFrequenciaGeral.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Frequencia Media</p>
            <p className={`text-xs mt-2 ${
              taxaFrequenciaGeral >= 95 ? 'text-emerald-600 dark:text-emerald-400' :
              taxaFrequenciaGeral >= 90 ? 'text-blue-600 dark:text-blue-400' :
              'text-amber-600 dark:text-amber-400'
            }`}>
              {taxaFrequenciaGeral >= 95 ? 'Excelente' : taxaFrequenciaGeral >= 90 ? 'Bom' : 'Requer atencao'}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{totalAbsenteismoCronico}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Absenteismo Cronico</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              ({((totalAbsenteismoCronico / (taxaFrequenciaGeral * 100)) * 100).toFixed(1)}% do total)
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-red-600 dark:text-red-400">{totalInfrequentes}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Alunos Infrequentes</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Situacao critica</p>
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      <LineChartTemporal
        dados={frequenciaMensal}
        linhas={[
          { campo: 'frequencia', nome: 'Taxa de Frequencia', cor: '#3B82F6' }
        ]}
        campoX="mes"
        titulo="Frequencia Mensal (2023)"
        altura={300}
      />

      {/* Schools Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top 10 Escolas com Maior Absenteismo
        </h3>
        <DataTable
          colunas={colunasEscolas}
          dados={porEscola.slice(0, 10)}
          itensPorPagina={10}
          pesquisavel={false}
        />
      </div>

      {/* Critical Students */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Alunos em Situacao Critica (&gt;25% faltas)
        </h3>
        <DataTable
          colunas={colunasAlunos}
          dados={alunosCriticos}
          itensPorPagina={15}
          pesquisavel={true}
        />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <TrendingDown className="w-8 h-8 opacity-80" />
            <div>
              <h3 className="font-semibold text-lg">Tendencia de Queda</h3>
              <p className="text-sm opacity-90 mt-1">
                A frequencia apresentou queda de 0.3pp em relacao ao mes anterior.
                Recomenda-se intensificar acoes de busca ativa.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 opacity-80" />
            <div>
              <h3 className="font-semibold text-lg">Alerta de Evasao</h3>
              <p className="text-sm opacity-90 mt-1">
                {totalInfrequentes} alunos com mais de 25% de faltas estao em risco
                de evasao escolar. Acoes urgentes necessarias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Frequencia;
