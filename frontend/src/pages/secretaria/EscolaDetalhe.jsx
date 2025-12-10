import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Users,
  GraduationCap,
  Award,
  Calendar,
  CheckCircle,
  BookOpen,
  Monitor,
  Volleyball,
  Wifi,
  Accessibility,
  Building
} from 'lucide-react';
import {
  KPICard,
  GaugeChart,
  LineChartTemporal,
  DataTable,
  StatusBadge,
  MapaEscolas
} from '../../components/dashboard';
import { getEscolaDetalhe } from '../../services/mockDataEducacao';

const EscolaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const escola = getEscolaDetalhe(id);

  if (!escola) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Escola nao encontrada</p>
        <button
          onClick={() => navigate('/secretaria')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const {
    nome,
    endereco,
    diretor,
    telefone,
    email,
    etapas,
    turnos,
    zona,
    indicadores,
    turmas,
    professores,
    infraestrutura,
    historicoIdeb
  } = escola;

  // Table columns for classes
  const colunasTurmas = [
    { campo: 'nome', titulo: 'Turma' },
    { campo: 'serie', titulo: 'Serie' },
    { campo: 'turno', titulo: 'Turno' },
    { campo: 'professor', titulo: 'Professor' },
    { campo: 'totalAlunos', titulo: 'Alunos' },
    {
      campo: 'capacidade',
      titulo: 'Ocupacao',
      render: (valor, item) => {
        const ocupacao = ((item.totalAlunos / valor) * 100).toFixed(0);
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

  // Table columns for teachers
  const colunasProfessores = [
    { campo: 'nome', titulo: 'Nome' },
    { campo: 'disciplina', titulo: 'Disciplina' },
    { campo: 'formacao', titulo: 'Formacao' }
  ];

  const getEtapaLabel = (etapa) => {
    const etapas = {
      'INFANTIL': 'Educacao Infantil',
      'FUNDAMENTAL_1': 'Fundamental I',
      'FUNDAMENTAL_2': 'Fundamental II'
    };
    return etapas[etapa] || etapa;
  };

  const getTurnoLabel = (turno) => {
    const turnos = {
      'MANHA': 'Manha',
      'TARDE': 'Tarde',
      'INTEGRAL': 'Integral'
    };
    return turnos[turno] || turno;
  };

  const getInfraLabel = (valor, tipo) => {
    if (tipo === 'boolean') return valor ? 'Sim' : 'Nao';
    if (tipo === 'quadra') {
      return { 'COBERTA': 'Coberta', 'DESCOBERTA': 'Descoberta', 'NAO_POSSUI': 'Nao possui' }[valor];
    }
    if (tipo === 'internet') {
      return { 'BANDA_LARGA': 'Banda Larga', 'LENTA': 'Lenta', 'NAO_POSSUI': 'Nao possui' }[valor];
    }
    if (tipo === 'acessibilidade') {
      return { 'COMPLETA': 'Completa', 'PARCIAL': 'Parcial', 'NAO_POSSUI': 'Nao possui' }[valor];
    }
    if (tipo === 'condicao') {
      return { 'BOA': 'Boa', 'REGULAR': 'Regular', 'PRECARIA': 'Precaria' }[valor];
    }
    return valor;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {nome}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4" />
            {endereco.logradouro}, {endereco.numero} - {endereco.bairro}
          </p>
        </div>
      </div>

      {/* School Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Informacoes da Escola
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Diretor(a)</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{diretor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Telefone</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{telefone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">E-mail</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{email}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {etapas.map((etapa, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full"
                  >
                    {getEtapaLabel(etapa)}
                  </span>
                ))}
                {turnos.map((turno, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full"
                  >
                    {getTurnoLabel(turno)}
                  </span>
                ))}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  zona === 'URBANA'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                }`}>
                  {zona === 'URBANA' ? 'Zona Urbana' : 'Zona Rural'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <MapaEscolas
            escolas={[{
              id: escola.id,
              nome: escola.nome,
              latitude: endereco.latitude,
              longitude: endereco.longitude,
              ideb: indicadores.ideb,
              totalAlunos: indicadores.totalMatriculas,
              etapa: etapas[0]
            }]}
            titulo="Localizacao"
            altura={300}
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          titulo="Matriculas"
          valor={indicadores.totalMatriculas}
          icone={Users}
          corIcone="blue"
        />
        <KPICard
          titulo="Turmas"
          valor={indicadores.totalTurmas}
          icone={BookOpen}
          corIcone="purple"
        />
        <KPICard
          titulo="Professores"
          valor={indicadores.totalProfessores}
          icone={GraduationCap}
          corIcone="green"
        />
        <KPICard
          titulo="IDEB"
          valor={indicadores.ideb}
          formato="decimal"
          icone={Award}
          corIcone="orange"
        />
        <KPICard
          titulo="Aprovacao"
          valor={indicadores.taxaAprovacao}
          formato="porcentagem"
          icone={CheckCircle}
          corIcone="cyan"
        />
        <KPICard
          titulo="Frequencia"
          valor={indicadores.taxaFrequencia}
          formato="porcentagem"
          icone={Calendar}
          corIcone="indigo"
        />
      </div>

      {/* Performance Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <GaugeChart
            valor={indicadores.ideb}
            max={10}
            label="IDEB"
            mostrarMeta={true}
            meta={indicadores.metaIdeb}
            corBarra={indicadores.ideb >= indicadores.metaIdeb ? 'green' : 'orange'}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <GaugeChart
            valor={indicadores.taxaAprovacao}
            max={100}
            label="Taxa de Aprovacao"
            sublabel={indicadores.taxaAprovacao >= 95 ? 'Excelente' : 'Bom'}
            corBarra="auto"
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <GaugeChart
            valor={indicadores.taxaFrequencia}
            max={100}
            label="Taxa de Frequencia"
            sublabel={indicadores.taxaFrequencia >= 95 ? 'Excelente' : 'Bom'}
            corBarra="auto"
          />
        </div>
      </div>

      {/* IDEB History */}
      <LineChartTemporal
        dados={historicoIdeb.map(h => ({ ano: h.ano, ideb: parseFloat(h.valor.toFixed(1)) }))}
        linhas={[{ campo: 'ideb', nome: 'IDEB', cor: '#3B82F6' }]}
        campoX="ano"
        titulo="Evolucao do IDEB (2019-2023)"
        altura={250}
      />

      {/* Infrastructure */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <Building className="w-4 h-4" />
          Infraestrutura
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <BookOpen className={`w-6 h-6 ${infraestrutura.biblioteca ? 'text-emerald-500' : 'text-gray-400'}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Biblioteca</span>
            <span className={`font-medium ${infraestrutura.biblioteca ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {getInfraLabel(infraestrutura.biblioteca, 'boolean')}
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Monitor className={`w-6 h-6 ${infraestrutura.labInformatica ? 'text-emerald-500' : 'text-gray-400'}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Lab. Info</span>
            <span className={`font-medium ${infraestrutura.labInformatica ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {getInfraLabel(infraestrutura.labInformatica, 'boolean')}
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Volleyball className={`w-6 h-6 ${infraestrutura.quadra !== 'NAO_POSSUI' ? 'text-emerald-500' : 'text-gray-400'}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Quadra</span>
            <span className={`font-medium text-sm ${infraestrutura.quadra !== 'NAO_POSSUI' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {getInfraLabel(infraestrutura.quadra, 'quadra')}
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Wifi className={`w-6 h-6 ${infraestrutura.internet !== 'NAO_POSSUI' ? 'text-emerald-500' : 'text-gray-400'}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Internet</span>
            <span className={`font-medium text-sm ${infraestrutura.internet !== 'NAO_POSSUI' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {getInfraLabel(infraestrutura.internet, 'internet')}
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Accessibility className={`w-6 h-6 ${infraestrutura.acessibilidade !== 'NAO_POSSUI' ? 'text-emerald-500' : 'text-gray-400'}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Acessibilidade</span>
            <span className={`font-medium text-sm ${infraestrutura.acessibilidade !== 'NAO_POSSUI' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {getInfraLabel(infraestrutura.acessibilidade, 'acessibilidade')}
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Building className="w-6 h-6 text-gray-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Condicao</span>
            <StatusBadge
              tipo={infraestrutura.condicaoGeral}
              texto={getInfraLabel(infraestrutura.condicaoGeral, 'condicao')}
              tamanho="sm"
            />
          </div>
        </div>
      </div>

      {/* Classes Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Turmas ({turmas.length})
        </h3>
        <DataTable
          colunas={colunasTurmas}
          dados={turmas}
          itensPorPagina={10}
          pesquisavel={true}
        />
      </div>

      {/* Teachers Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Professores ({professores.length})
        </h3>
        <DataTable
          colunas={colunasProfessores}
          dados={professores}
          itensPorPagina={10}
          pesquisavel={true}
        />
      </div>
    </div>
  );
};

export default EscolaDetalhe;
