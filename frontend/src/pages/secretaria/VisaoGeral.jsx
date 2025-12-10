import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  School,
  GraduationCap,
  Award,
  CheckCircle,
  Building
} from 'lucide-react';
import {
  KPICard,
  AlertCard,
  MapaEscolas,
  BarChartComparativo
} from '../../components/dashboard';
import { dashboardVisaoGeral, desempenhoAcademico } from '../../services/mockDataEducacao';

const VisaoGeral = () => {
  const navigate = useNavigate();
  const { kpis, escolas, alertas } = dashboardVisaoGeral;

  const handleEscolaClick = (escola) => {
    navigate(`/secretaria/escola/${escola.id}`);
  };

  // Prepare data for comparison chart
  const dadosComparativo = desempenhoAcademico.comparativoEscolas
    .slice(0, 15)
    .map(e => ({
      ...e,
      escolaNome: e.escolaNome.replace('E.M. ', '')
    }));

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Secretaria Municipal de Educacao
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Visao geral da rede municipal de ensino
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Building className="w-4 h-4" />
          <span>Ano Letivo: 2023</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          titulo="Total de Matriculas"
          valor={kpis.totalMatriculas}
          variacao={kpis.variacaoMatriculas}
          icone={Users}
          corIcone="blue"
          subtitulo="Alunos ativos"
        />
        <KPICard
          titulo="Escolas"
          valor={kpis.totalEscolas}
          icone={School}
          corIcone="purple"
          subtitulo="Unidades escolares"
        />
        <KPICard
          titulo="Professores"
          valor={kpis.totalProfessores}
          variacao={kpis.variacaoProfessores}
          icone={GraduationCap}
          corIcone="green"
          subtitulo="Docentes ativos"
        />
        <KPICard
          titulo="IDEB Medio"
          valor={kpis.idebMedio}
          variacao={kpis.variacaoIdeb}
          formato="decimal"
          icone={Award}
          corIcone="orange"
          subtitulo="Indice da rede"
        />
        <KPICard
          titulo="Taxa de Aprovacao"
          valor={kpis.taxaAprovacao}
          variacao={kpis.variacaoAprovacao}
          formato="porcentagem"
          icone={CheckCircle}
          corIcone="cyan"
          subtitulo="Media da rede"
        />
      </div>

      {/* Map and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <MapaEscolas
            escolas={escolas}
            titulo="Mapa das Escolas"
            altura={400}
            onEscolaClick={handleEscolaClick}
          />
        </div>

        {/* Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Alertas e Notificacoes
          </h3>
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
            {alertas.map((alerta) => (
              <AlertCard
                key={alerta.id}
                tipo={alerta.tipo}
                mensagem={alerta.mensagem}
                data={alerta.data}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      </div>

      {/* IDEB Comparison Chart */}
      <BarChartComparativo
        dados={dadosComparativo}
        campoX="escolaNome"
        campoY="ideb"
        meta={5.5}
        titulo="Comparativo IDEB por Escola (Top 15)"
        altura={500}
        horizontal={true}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold opacity-90">Educacao Infantil</h3>
          <p className="text-3xl font-bold mt-2">
            {escolas.filter(e => e.etapa === 'INFANTIL').length}
          </p>
          <p className="text-sm opacity-75 mt-1">escolas</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold opacity-90">Fundamental I</h3>
          <p className="text-3xl font-bold mt-2">
            {escolas.filter(e => e.etapa === 'FUNDAMENTAL_1').length}
          </p>
          <p className="text-sm opacity-75 mt-1">escolas</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold opacity-90">Fundamental II</h3>
          <p className="text-3xl font-bold mt-2">
            {escolas.filter(e => e.etapa === 'FUNDAMENTAL_2').length}
          </p>
          <p className="text-sm opacity-75 mt-1">escolas</p>
        </div>
      </div>
    </div>
  );
};

export default VisaoGeral;
