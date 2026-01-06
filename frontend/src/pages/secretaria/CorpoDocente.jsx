import React from 'react';
import {
  Users,
  GraduationCap,
  Award,
  Clock,
  UserCheck,
  Briefcase
} from 'lucide-react';
import {
  KPICard,
  PieChartComponent,
  DataTable,
  StatusBadge
} from '../../components/dashboard';
import { corpoDocente } from '../../services/mockDataEducacao';

const CorpoDocente = () => {
  const {
    totalProfessores,
    efetivos,
    contratados,
    formacao,
    adequacaoFormacao,
    regularidadeMedia,
    relacaoAlunoProfessor,
    porEscola,
    listaProfessores
  } = corpoDocente;

  // Prepare formation data for pie chart
  const dadosFormacao = [
    { nome: 'Sem Superior', valor: formacao.semSuperior },
    { nome: 'Graduacao', valor: formacao.graduacao },
    { nome: 'Especializacao', valor: formacao.especializacao },
    { nome: 'Mestrado', valor: formacao.mestrado },
    { nome: 'Doutorado', valor: formacao.doutorado }
  ];

  // Prepare bond type data for pie chart
  const dadosVinculo = [
    { nome: 'Efetivos', valor: efetivos },
    { nome: 'Contratados', valor: contratados }
  ];

  // Table columns for teachers
  const colunasProfessores = [
    { campo: 'nome', titulo: 'Nome', largura: '25%' },
    {
      campo: 'escola',
      titulo: 'Escola',
      largura: '20%',
      render: (valor) => valor.replace('E.M. ', '')
    },
    { campo: 'disciplina', titulo: 'Disciplina' },
    { campo: 'formacao', titulo: 'Formacao' },
    {
      campo: 'vinculo',
      titulo: 'Vinculo',
      render: (valor) => (
        <StatusBadge
          tipo={valor === 'EFETIVO' ? 'SUCESSO' : 'ATENCAO'}
          texto={valor === 'EFETIVO' ? 'Efetivo' : 'Contratado'}
          tamanho="sm"
        />
      )
    },
    {
      campo: 'anosNaEscola',
      titulo: 'Anos na Escola',
      render: (valor) => `${valor} ${valor === 1 ? 'ano' : 'anos'}`
    }
  ];

  // Table columns for schools
  const colunasEscolas = [
    {
      campo: 'escolaNome',
      titulo: 'Escola',
      largura: '40%',
      render: (valor) => valor.replace('E.M. ', '')
    },
    { campo: 'totalProfessores', titulo: 'Total' },
    { campo: 'comPosGraduacao', titulo: 'Com Pos' },
    {
      campo: 'adequados',
      titulo: '% Adequados',
      render: (valor, item) => {
        const perc = ((valor / item.totalProfessores) * 100).toFixed(0);
        return (
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            perc >= 85 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            perc >= 70 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {perc}%
          </span>
        );
      }
    }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Corpo Docente
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Informacoes sobre os professores da rede municipal
        </p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          titulo="Total de Professores"
          valor={totalProfessores}
          icone={Users}
          corIcone="blue"
        />
        <KPICard
          titulo="Efetivos"
          valor={efetivos}
          icone={UserCheck}
          corIcone="green"
        />
        <KPICard
          titulo="Contratados"
          valor={contratados}
          icone={Briefcase}
          corIcone="orange"
        />
        <KPICard
          titulo="Adequacao"
          valor={adequacaoFormacao}
          formato="porcentagem"
          icone={Award}
          corIcone="purple"
          subtitulo="Na area de formacao"
        />
        <KPICard
          titulo="Regularidade Media"
          valor={regularidadeMedia}
          formato="decimal"
          icone={Clock}
          corIcone="cyan"
          subtitulo="Anos na mesma escola"
        />
        <KPICard
          titulo="Aluno/Professor"
          valor={relacaoAlunoProfessor}
          formato="decimal"
          icone={GraduationCap}
          corIcone="indigo"
          subtitulo="Relacao media"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChartComponent
          dados={dadosFormacao}
          campoValor="valor"
          campoNome="nome"
          titulo="Distribuicao por Formacao"
          tipo="donut"
          altura={300}
          cores={['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981']}
        />

        <PieChartComponent
          dados={dadosVinculo}
          campoValor="valor"
          campoNome="nome"
          titulo="Distribuicao por Vinculo"
          tipo="donut"
          altura={300}
          cores={['#10B981', '#F59E0B']}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Com Pos-Graduacao</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formacao.especializacao + formacao.mestrado + formacao.doutorado}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {(((formacao.especializacao + formacao.mestrado + formacao.doutorado) / totalProfessores) * 100).toFixed(1)}% do total
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Com Mestrado/Doutorado</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formacao.mestrado + formacao.doutorado}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {(((formacao.mestrado + formacao.doutorado) / totalProfessores) * 100).toFixed(1)}% do total
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Atuando na Area</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round(totalProfessores * adequacaoFormacao / 100)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {adequacaoFormacao.toFixed(1)}% de adequacao
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Sem Formacao Superior</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {formacao.semSuperior}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {((formacao.semSuperior / totalProfessores) * 100).toFixed(1)}% do total
          </p>
        </div>
      </div>

      {/* Schools Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Professores por Escola
        </h3>
        <DataTable
          colunas={colunasEscolas}
          dados={porEscola}
          itensPorPagina={10}
          pesquisavel={true}
        />
      </div>

      {/* Teachers List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Lista de Professores
        </h3>
        <DataTable
          colunas={colunasProfessores}
          dados={listaProfessores}
          itensPorPagina={15}
          pesquisavel={true}
        />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <GraduationCap className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="font-semibold text-lg">Qualificacao Docente</h3>
          <p className="text-sm opacity-90 mt-2">
            {(((formacao.especializacao + formacao.mestrado + formacao.doutorado) / totalProfessores) * 100).toFixed(1)}%
            dos professores possuem pos-graduacao. Meta: 80%
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
          <Award className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="font-semibold text-lg">Adequacao a Formacao</h3>
          <p className="text-sm opacity-90 mt-2">
            {adequacaoFormacao.toFixed(1)}% dos professores lecionam em sua area de formacao.
            Meta: 90%
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorpoDocente;
