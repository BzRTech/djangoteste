import React from 'react';
import {
  Users,
  Heart,
  Bus,
  Banknote
} from 'lucide-react';
import {
  KPICard,
  PieChartComponent,
  BarChartComparativo
} from '../../components/dashboard';
import { perfilAlunos } from '../../services/mockDataEducacao';

const PerfilAlunos = () => {
  const {
    totalAlunos,
    genero,
    etnia,
    alunosComDeficiencia,
    nivelSocioeconomico,
    bolsaFamilia,
    zona,
    transporte
  } = perfilAlunos;

  // Prepare gender data
  const dadosGenero = [
    { nome: 'Masculino', valor: genero.masculino },
    { nome: 'Feminino', valor: genero.feminino }
  ];

  // Prepare ethnicity data
  const dadosEtnia = [
    { nome: 'Branca', valor: etnia.branca },
    { nome: 'Preta', valor: etnia.preta },
    { nome: 'Parda', valor: etnia.parda },
    { nome: 'Amarela', valor: etnia.amarela },
    { nome: 'Indigena', valor: etnia.indigena },
    { nome: 'Nao Declarada', valor: etnia.naoDeclarada }
  ];

  // Prepare zone data
  const dadosZona = [
    { nome: 'Urbana', valor: zona.urbana },
    { nome: 'Rural', valor: zona.rural }
  ];

  // Prepare socioeconomic data
  const dadosNSE = [
    { nivel: 'Muito Baixo', quantidade: nivelSocioeconomico.muitoBaixo },
    { nivel: 'Baixo', quantidade: nivelSocioeconomico.baixo },
    { nivel: 'Medio-Baixo', quantidade: nivelSocioeconomico.medioBaixo },
    { nivel: 'Medio', quantidade: nivelSocioeconomico.medio },
    { nivel: 'Medio-Alto', quantidade: nivelSocioeconomico.medioAlto },
    { nivel: 'Alto', quantidade: nivelSocioeconomico.alto }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Perfil dos Alunos
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Caracteristicas demograficas e socioeconomicas dos estudantes
        </p>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          titulo="Total de Alunos"
          valor={totalAlunos}
          icone={Users}
          corIcone="blue"
        />
        <KPICard
          titulo="Alunos com Deficiencia"
          valor={alunosComDeficiencia.total}
          icone={Heart}
          corIcone="purple"
          subtitulo={`${((alunosComDeficiencia.total / totalAlunos) * 100).toFixed(1)}% do total`}
        />
        <KPICard
          titulo="Beneficiarios Bolsa Familia"
          valor={bolsaFamilia}
          icone={Banknote}
          corIcone="green"
          subtitulo={`${((bolsaFamilia / totalAlunos) * 100).toFixed(1)}% do total`}
        />
        <KPICard
          titulo="Usam Transporte Escolar"
          valor={transporte.utilizaTransporteEscolar}
          icone={Bus}
          corIcone="orange"
          subtitulo={`${((transporte.utilizaTransporteEscolar / totalAlunos) * 100).toFixed(1)}% do total`}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PieChartComponent
          dados={dadosGenero}
          campoValor="valor"
          campoNome="nome"
          titulo="Distribuicao por Genero"
          tipo="donut"
          altura={280}
          cores={['#3B82F6', '#EC4899']}
        />

        <PieChartComponent
          dados={dadosZona}
          campoValor="valor"
          campoNome="nome"
          titulo="Distribuicao por Zona"
          tipo="donut"
          altura={280}
          cores={['#8B5CF6', '#10B981']}
        />

        <PieChartComponent
          dados={[
            { nome: 'Usa Transporte', valor: transporte.utilizaTransporteEscolar },
            { nome: 'Nao Usa', valor: transporte.naoUtiliza }
          ]}
          campoValor="valor"
          campoNome="nome"
          titulo="Uso de Transporte Escolar"
          tipo="donut"
          altura={280}
          cores={['#F59E0B', '#6B7280']}
        />
      </div>

      {/* Ethnicity Chart */}
      <PieChartComponent
        dados={dadosEtnia}
        campoValor="valor"
        campoNome="nome"
        titulo="Distribuicao Etnico-Racial"
        tipo="pie"
        altura={350}
        cores={['#F3F4F6', '#1F2937', '#A78BFA', '#FCD34D', '#EF4444', '#9CA3AF']}
      />

      {/* Socioeconomic Distribution */}
      <BarChartComparativo
        dados={dadosNSE}
        campoX="nivel"
        campoY="quantidade"
        titulo="Nivel Socioeconomico (INSE)"
        horizontal={false}
        altura={300}
        corBarra="#8B5CF6"
      />

      {/* Disabilities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Alunos com Deficiencia ({alunosComDeficiencia.total} total)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alunosComDeficiencia.tipos.map((tipo, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{tipo.tipo}</span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{tipo.quantidade}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Zona Urbana</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {((zona.urbana / totalAlunos) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{zona.urbana.toLocaleString('pt-BR')} alunos</p>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Zona Rural</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {((zona.rural / totalAlunos) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{zona.rural.toLocaleString('pt-BR')} alunos</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">NSE Baixo/Muito Baixo</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {(((nivelSocioeconomico.baixo + nivelSocioeconomico.muitoBaixo) / totalAlunos) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{(nivelSocioeconomico.baixo + nivelSocioeconomico.muitoBaixo).toLocaleString('pt-BR')} alunos</p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Inclusao (PcD)</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {((alunosComDeficiencia.total / totalAlunos) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{alunosComDeficiencia.total.toLocaleString('pt-BR')} alunos</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <Banknote className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="font-semibold text-lg">Bolsa Familia</h3>
          <p className="text-sm opacity-90 mt-2">
            {((bolsaFamilia / totalAlunos) * 100).toFixed(1)}% dos alunos sao beneficiarios
            do programa Bolsa Familia, indicando vulnerabilidade socioeconomica.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <Heart className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="font-semibold text-lg">Educacao Inclusiva</h3>
          <p className="text-sm opacity-90 mt-2">
            {alunosComDeficiencia.total} alunos com deficiencia atendidos na rede.
            Principal demanda: {alunosComDeficiencia.tipos[0]?.tipo}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerfilAlunos;
