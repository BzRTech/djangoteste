import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Users,
  PiggyBank,
  BarChart3
} from 'lucide-react';
import {
  KPICard,
  GaugeChart,
  PieChartComponent,
  LineChartTemporal,
  DataTable
} from '../../components/dashboard';
import { financeiro } from '../../services/mockDataEducacao';

const Financeiro = () => {
  const {
    orcamentoTotal,
    orcamentoExecutado,
    percentualExecutado,
    custoPorAluno,
    fundebRecebido,
    distribuicaoDespesas,
    custoPorEscola,
    evolucaoAnual
  } = financeiro;

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  // Table columns for schools
  const colunasEscolas = [
    {
      campo: 'escolaNome',
      titulo: 'Escola',
      largura: '35%',
      render: (valor) => valor.replace('E.M. ', '')
    },
    { campo: 'totalAlunos', titulo: 'Alunos' },
    {
      campo: 'custoTotal',
      titulo: 'Custo Total',
      render: (valor) => formatarMoeda(valor)
    },
    {
      campo: 'custoPorAluno',
      titulo: 'Custo/Aluno',
      render: (valor) => formatarMoeda(valor)
    }
  ];

  // Prepare evolution data
  const dadosEvolucao = evolucaoAnual.map(item => ({
    ...item,
    orcamentoMilhoes: item.orcamento / 1000000,
    executadoMilhoes: item.executado / 1000000
  }));

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Financeiro
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Gestao orcamentaria e custos da educacao municipal
        </p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          titulo="Orcamento Total"
          valor={orcamentoTotal}
          formato="moeda"
          icone={DollarSign}
          corIcone="blue"
          subtitulo="Ano 2023"
        />
        <KPICard
          titulo="Executado"
          valor={orcamentoExecutado}
          formato="moeda"
          icone={TrendingUp}
          corIcone="green"
          subtitulo={`${percentualExecutado.toFixed(1)}% do total`}
        />
        <KPICard
          titulo="FUNDEB Recebido"
          valor={fundebRecebido}
          formato="moeda"
          icone={PiggyBank}
          corIcone="purple"
        />
        <KPICard
          titulo="Custo por Aluno"
          valor={custoPorAluno}
          formato="moeda"
          icone={Users}
          corIcone="orange"
          subtitulo="Media anual"
        />
        <KPICard
          titulo="A Executar"
          valor={orcamentoTotal - orcamentoExecutado}
          formato="moeda"
          icone={BarChart3}
          corIcone="cyan"
          subtitulo={`${(100 - percentualExecutado).toFixed(1)}% restante`}
        />
      </div>

      {/* Budget Execution Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Execucao Orcamentaria
          </h3>
          <div className="flex justify-center">
            <GaugeChart
              valor={percentualExecutado}
              max={100}
              label="Executado"
              sublabel={formatarMoeda(orcamentoExecutado)}
              corBarra="auto"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Orcamento</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{formatarMoeda(orcamentoTotal)}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Disponivel</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{formatarMoeda(orcamentoTotal - orcamentoExecutado)}</p>
            </div>
          </div>
        </div>

        <PieChartComponent
          dados={distribuicaoDespesas}
          campoValor="valor"
          campoNome="categoria"
          titulo="Distribuicao de Despesas"
          tipo="donut"
          altura={350}
        />
      </div>

      {/* Expense Distribution Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Detalhamento por Categoria
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Categoria</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Valor</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Percentual</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 w-1/3">Proporcao</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {distribuicaoDespesas.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {item.categoria}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                    {formatarMoeda(item.valor)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-gray-800 dark:text-gray-200">
                    {item.percentual.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${item.percentual}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Evolution */}
      <LineChartTemporal
        dados={dadosEvolucao}
        linhas={[
          { campo: 'orcamentoMilhoes', nome: 'Orcamento (milhoes)', cor: '#3B82F6' },
          { campo: 'executadoMilhoes', nome: 'Executado (milhoes)', cor: '#10B981' }
        ]}
        campoX="ano"
        titulo="Evolucao Orcamentaria (2019-2023)"
        altura={300}
      />

      {/* Cost per School */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Custo por Escola (Top 15 - Maior Custo/Aluno)
        </h3>
        <DataTable
          colunas={colunasEscolas}
          dados={custoPorEscola.slice(0, 15)}
          itensPorPagina={15}
          pesquisavel={false}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <DollarSign className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="font-semibold text-lg">Investimento por Aluno</h3>
          <p className="text-3xl font-bold mt-2">{formatarMoeda(custoPorAluno)}</p>
          <p className="text-sm opacity-75 mt-1">Media anual por estudante</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
          <PiggyBank className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="font-semibold text-lg">FUNDEB</h3>
          <p className="text-3xl font-bold mt-2">{formatarMoeda(fundebRecebido)}</p>
          <p className="text-sm opacity-75 mt-1">{((fundebRecebido / orcamentoTotal) * 100).toFixed(1)}% do orcamento</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <TrendingUp className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="font-semibold text-lg">Crescimento</h3>
          <p className="text-3xl font-bold mt-2">+7.8%</p>
          <p className="text-sm opacity-75 mt-1">Aumento vs ano anterior</p>
        </div>
      </div>
    </div>
  );
};

export default Financeiro;
