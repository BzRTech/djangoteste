import React from 'react';
import {
  CheckCircle,
  XCircle,
  UserMinus,
  AlertTriangle
} from 'lucide-react';
import {
  KPICard,
  GaugeChart,
  FunnelChart,
  HeatmapChart
} from '../../components/dashboard';
import { fluxoEscolar } from '../../services/mockDataEducacao';

const FluxoEscolar = () => {
  const {
    taxaAprovacao,
    taxaReprovacao,
    taxaAbandono,
    distorcaoIdadeSerie,
    porEtapa,
    funilProgressao,
    distorcaoPorEscola
  } = fluxoEscolar;

  // Prepare distortion heatmap data
  const colunasDistorcao = [
    { campo: '1º', titulo: '1º' },
    { campo: '2º', titulo: '2º' },
    { campo: '3º', titulo: '3º' },
    { campo: '4º', titulo: '4º' },
    { campo: '5º', titulo: '5º' },
    { campo: '6º', titulo: '6º' },
    { campo: '7º', titulo: '7º' },
    { campo: '8º', titulo: '8º' },
    { campo: '9º', titulo: '9º' }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Fluxo Escolar
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Indicadores de aprovacao, reprovacao, abandono e distorcao idade-serie
        </p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          titulo="Taxa de Aprovacao"
          valor={taxaAprovacao}
          formato="porcentagem"
          icone={CheckCircle}
          corIcone="green"
          subtitulo="Meta: > 95%"
        />
        <KPICard
          titulo="Taxa de Reprovacao"
          valor={taxaReprovacao}
          formato="porcentagem"
          icone={XCircle}
          corIcone="red"
          subtitulo="Meta: < 5%"
        />
        <KPICard
          titulo="Taxa de Abandono"
          valor={taxaAbandono}
          formato="porcentagem"
          icone={UserMinus}
          corIcone="orange"
          subtitulo="Meta: < 2%"
        />
        <KPICard
          titulo="Distorcao Idade-Serie"
          valor={distorcaoIdadeSerie}
          formato="porcentagem"
          icone={AlertTriangle}
          corIcone="purple"
          subtitulo="Meta: < 15%"
        />
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <GaugeChart
            valor={taxaAprovacao}
            max={100}
            label="Aprovacao"
            sublabel={taxaAprovacao >= 95 ? 'Meta atingida' : 'Abaixo da meta'}
            corBarra={taxaAprovacao >= 95 ? 'green' : taxaAprovacao >= 90 ? 'blue' : 'orange'}
            mostrarMeta={true}
            meta={95}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <GaugeChart
            valor={taxaReprovacao}
            max={20}
            label="Reprovacao"
            sublabel={taxaReprovacao <= 5 ? 'Meta atingida' : 'Acima da meta'}
            corBarra={taxaReprovacao <= 5 ? 'green' : taxaReprovacao <= 10 ? 'orange' : 'red'}
            mostrarMeta={true}
            meta={5}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <GaugeChart
            valor={taxaAbandono}
            max={10}
            label="Abandono"
            sublabel={taxaAbandono <= 2 ? 'Meta atingida' : 'Acima da meta'}
            corBarra={taxaAbandono <= 2 ? 'green' : taxaAbandono <= 5 ? 'orange' : 'red'}
            mostrarMeta={true}
            meta={2}
          />
        </div>
      </div>

      {/* Rates by Stage */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Taxas por Etapa de Ensino
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Etapa</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Aprovacao</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Reprovacao</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Abandono</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {porEtapa.map((etapa, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {etapa.etapa}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      etapa.aprovacao >= 95 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      etapa.aprovacao >= 90 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {etapa.aprovacao.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      etapa.reprovacao <= 5 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      etapa.reprovacao <= 10 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {etapa.reprovacao.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      etapa.abandono <= 2 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      etapa.abandono <= 5 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {etapa.abandono.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progression Funnel */}
      <FunnelChart
        dados={funilProgressao}
        titulo="Funil de Progressao Escolar"
        campoLabel="serie"
        campoValor="totalAlunos"
        altura={400}
      />

      {/* Age-Grade Distortion Heatmap */}
      <HeatmapChart
        dados={distorcaoPorEscola}
        campoLinha="escola"
        colunas={colunasDistorcao}
        titulo="Mapa de Calor: Distorcao Idade-Serie por Escola e Serie"
        valorMin={0}
        valorMax={40}
      />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Alunos Concluintes por Serie
          </h3>
          <div className="space-y-3">
            {funilProgressao.map((item, index) => {
              const taxa = ((item.concluiram / item.totalAlunos) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.serie}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          parseFloat(taxa) >= 95 ? 'bg-emerald-500' :
                          parseFloat(taxa) >= 90 ? 'bg-blue-500' :
                          'bg-amber-500'
                        }`}
                        style={{ width: `${taxa}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-right">
                      {taxa}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Resumo do Fluxo Escolar
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Total de alunos aprovados</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round(funilProgressao.reduce((acc, f) => acc + f.concluiram, 0)).toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Alunos nao aprovados</span>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                {Math.round(funilProgressao.reduce((acc, f) => acc + (f.totalAlunos - f.concluiram), 0)).toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Alunos em distorcao</span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {Math.round(funilProgressao.reduce((acc, f) => acc + f.totalAlunos, 0) * distorcaoIdadeSerie / 100).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluxoEscolar;
