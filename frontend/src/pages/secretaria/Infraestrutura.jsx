import React from 'react';
import {
  Building,
  BookOpen,
  Monitor,
  Volleyball,
  Wifi,
  Accessibility,
  AlertTriangle
} from 'lucide-react';
import {
  KPICard,
  DataTable,
  StatusBadge,
  ProgressBar
} from '../../components/dashboard';
import { infraestrutura } from '../../services/mockDataEducacao';

const Infraestrutura = () => {
  const {
    resumoRede,
    condicaoGeral,
    porEscola,
    problemasUrgentes
  } = infraestrutura;

  // Table columns
  const colunas = [
    {
      campo: 'escolaNome',
      titulo: 'Escola',
      largura: '20%',
      render: (valor) => valor.replace('E.M. ', '')
    },
    {
      campo: 'biblioteca',
      titulo: 'Biblioteca',
      render: (valor) => (
        <span className={valor ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
          {valor ? 'Sim' : 'Nao'}
        </span>
      )
    },
    {
      campo: 'labInformatica',
      titulo: 'Lab. Info',
      render: (valor) => (
        <span className={valor ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
          {valor ? 'Sim' : 'Nao'}
        </span>
      )
    },
    {
      campo: 'quadra',
      titulo: 'Quadra',
      render: (valor) => {
        const labels = {
          'COBERTA': 'Coberta',
          'DESCOBERTA': 'Descoberta',
          'NAO_POSSUI': 'Nao possui'
        };
        const cores = {
          'COBERTA': 'text-emerald-600 dark:text-emerald-400',
          'DESCOBERTA': 'text-amber-600 dark:text-amber-400',
          'NAO_POSSUI': 'text-red-600 dark:text-red-400'
        };
        return <span className={cores[valor]}>{labels[valor]}</span>;
      }
    },
    {
      campo: 'internet',
      titulo: 'Internet',
      render: (valor) => {
        const labels = {
          'BANDA_LARGA': 'Banda Larga',
          'LENTA': 'Lenta',
          'NAO_POSSUI': 'Nao possui'
        };
        const cores = {
          'BANDA_LARGA': 'text-emerald-600 dark:text-emerald-400',
          'LENTA': 'text-amber-600 dark:text-amber-400',
          'NAO_POSSUI': 'text-red-600 dark:text-red-400'
        };
        return <span className={cores[valor]}>{labels[valor]}</span>;
      }
    },
    {
      campo: 'acessibilidade',
      titulo: 'Acessibilidade',
      render: (valor) => {
        const labels = {
          'COMPLETA': 'Completa',
          'PARCIAL': 'Parcial',
          'NAO_POSSUI': 'Nao possui'
        };
        const cores = {
          'COMPLETA': 'text-emerald-600 dark:text-emerald-400',
          'PARCIAL': 'text-amber-600 dark:text-amber-400',
          'NAO_POSSUI': 'text-red-600 dark:text-red-400'
        };
        return <span className={cores[valor]}>{labels[valor]}</span>;
      }
    },
    {
      campo: 'condicaoGeral',
      titulo: 'Condicao',
      render: (valor) => <StatusBadge tipo={valor} texto={valor === 'BOA' ? 'Boa' : valor === 'REGULAR' ? 'Regular' : 'Precaria'} tamanho="sm" />
    },
    {
      campo: 'alunosAtuais',
      titulo: 'Ocupacao',
      render: (valor, item) => {
        const ocupacao = ((valor / item.capacidadeMaxima) * 100).toFixed(0);
        return (
          <span className={`font-medium ${
            ocupacao > 100 ? 'text-red-600 dark:text-red-400' :
            ocupacao > 90 ? 'text-amber-600 dark:text-amber-400' :
            'text-emerald-600 dark:text-emerald-400'
          }`}>
            {ocupacao}%
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
          Infraestrutura
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Condicoes fisicas e recursos das escolas municipais
        </p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          titulo="Com Biblioteca"
          valor={resumoRede.percentualComBiblioteca}
          formato="porcentagem"
          icone={BookOpen}
          corIcone="blue"
        />
        <KPICard
          titulo="Com Lab. Informatica"
          valor={resumoRede.percentualComLabInfo}
          formato="porcentagem"
          icone={Monitor}
          corIcone="purple"
        />
        <KPICard
          titulo="Com Quadra"
          valor={resumoRede.percentualComQuadra}
          formato="porcentagem"
          icone={Volleyball}
          corIcone="green"
        />
        <KPICard
          titulo="Com Internet"
          valor={resumoRede.percentualComInternet}
          formato="porcentagem"
          icone={Wifi}
          corIcone="cyan"
        />
        <KPICard
          titulo="Acessiveis"
          valor={resumoRede.percentualAcessivel}
          formato="porcentagem"
          icone={Accessibility}
          corIcone="orange"
        />
      </div>

      {/* Condition Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Condicao Boa</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{condicaoGeral.boa}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {((condicaoGeral.boa / porEscola.length) * 100).toFixed(0)}% das escolas
              </p>
            </div>
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
              <Building className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Condicao Regular</p>
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{condicaoGeral.regular}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {((condicaoGeral.regular / porEscola.length) * 100).toFixed(0)}% das escolas
              </p>
            </div>
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center">
              <Building className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Condicao Precaria</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{condicaoGeral.precaria}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {((condicaoGeral.precaria / porEscola.length) * 100).toFixed(0)}% das escolas
              </p>
            </div>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
              <Building className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Cobertura de Recursos
        </h3>
        <div className="space-y-5">
          <ProgressBar
            valor={resumoRede.percentualComBiblioteca}
            label="Biblioteca"
            cor="blue"
            tamanho="md"
          />
          <ProgressBar
            valor={resumoRede.percentualComLabInfo}
            label="Laboratorio de Informatica"
            cor="purple"
            tamanho="md"
          />
          <ProgressBar
            valor={resumoRede.percentualComQuadra}
            label="Quadra Esportiva"
            cor="green"
            tamanho="md"
          />
          <ProgressBar
            valor={resumoRede.percentualComInternet}
            label="Internet Banda Larga"
            cor="auto"
            tamanho="md"
          />
          <ProgressBar
            valor={resumoRede.percentualAcessivel}
            label="Acessibilidade"
            cor="auto"
            tamanho="md"
          />
        </div>
      </div>

      {/* Urgent Problems */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Problemas que Precisam de Atencao
        </h3>
        <div className="space-y-3">
          {problemasUrgentes.map((problema, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                problema.prioridade === 'ALTA' ? 'bg-red-50 dark:bg-red-900/20' :
                problema.prioridade === 'MEDIA' ? 'bg-amber-50 dark:bg-amber-900/20' :
                'bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{problema.escolaNome.replace('E.M. ', '')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{problema.problema}</p>
              </div>
              <StatusBadge tipo={problema.prioridade} texto={problema.prioridade === 'ALTA' ? 'Urgente' : problema.prioridade === 'MEDIA' ? 'Media' : 'Baixa'} tamanho="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Schools Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Detalhamento por Escola
        </h3>
        <DataTable
          colunas={colunas}
          dados={porEscola}
          itensPorPagina={15}
          pesquisavel={true}
        />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <Monitor className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="font-semibold text-lg">Inclusao Digital</h3>
          <p className="text-sm opacity-90 mt-2">
            {resumoRede.percentualComInternet}% das escolas possuem acesso a internet.
            {resumoRede.percentualComLabInfo}% possuem laboratorio de informatica.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
          <Accessibility className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="font-semibold text-lg">Acessibilidade</h3>
          <p className="text-sm opacity-90 mt-2">
            Apenas {resumoRede.percentualAcessivel}% das escolas possuem acessibilidade completa.
            Meta: 100% ate 2025.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Infraestrutura;
