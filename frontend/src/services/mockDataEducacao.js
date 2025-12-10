// Mock Data Service para Dashboard Educacional
// Dados fictícios realistas para desenvolvimento

// Geração de IDs únicos
const generateId = () => Math.random().toString(36).substr(2, 9);

// Lista de nomes de escolas brasileiras típicas
const nomesEscolas = [
  "E.M. Castro Alves",
  "E.M. Monteiro Lobato",
  "E.M. Machado de Assis",
  "E.M. Cecília Meireles",
  "E.M. Carlos Drummond de Andrade",
  "E.M. Paulo Freire",
  "E.M. Anísio Teixeira",
  "E.M. Darcy Ribeiro",
  "E.M. Santos Dumont",
  "E.M. Dom Pedro II",
  "E.M. Princesa Isabel",
  "E.M. Tiradentes",
  "E.M. José de Alencar",
  "E.M. Rachel de Queiroz",
  "E.M. Clarice Lispector",
  "E.M. Vinicius de Moraes",
  "E.M. Jorge Amado",
  "E.M. Manuel Bandeira",
  "E.M. Cora Coralina",
  "E.M. Gilberto Freyre",
  "E.M. Sérgio Buarque",
  "E.M. Zilda Arns",
  "E.M. Milton Santos",
  "E.M. Oscar Niemeyer",
  "E.M. Portinari",
  "E.M. Villa-Lobos",
  "E.M. Pixinguinha",
  "E.M. Chico Mendes",
  "E.M. Marina Silva",
  "E.M. Betinho",
  "E.M. Ruth Rocha",
  "E.M. Ana Maria Machado"
];

const bairros = [
  "Centro", "Vila Nova", "Jardim das Flores", "Parque Industrial",
  "Bela Vista", "São José", "Santa Maria", "Boa Esperança",
  "Jardim América", "Vila Rica", "Alto da Colina", "Lagoa Azul",
  "Primavera", "Sol Nascente", "Nova Cidade", "Recanto Verde"
];

const nomesProfessores = [
  "Maria Silva", "José Santos", "Ana Oliveira", "Pedro Costa",
  "Fernanda Lima", "Carlos Souza", "Patrícia Ferreira", "Roberto Almeida",
  "Juliana Martins", "Ricardo Pereira", "Camila Rodrigues", "André Barbosa",
  "Luciana Ribeiro", "Marcos Gomes", "Renata Araújo", "Felipe Cardoso",
  "Isabela Mendes", "Thiago Moreira", "Daniela Castro", "Lucas Correia",
  "Mariana Dias", "Gustavo Vieira", "Amanda Nunes", "Bruno Rocha"
];

const nomesAlunos = [
  "João Pedro", "Maria Clara", "Lucas Gabriel", "Ana Beatriz",
  "Pedro Henrique", "Laura Sophia", "Gabriel Augusto", "Valentina",
  "Matheus", "Helena", "Arthur", "Alice", "Davi", "Sophia",
  "Bernardo", "Isabella", "Enzo", "Manuela", "Lorenzo", "Julia",
  "Miguel", "Heloísa", "Guilherme", "Luísa", "Nicolas", "Lorena",
  "Samuel", "Lívia", "Rafael", "Beatriz", "Heitor", "Maria Luísa"
];

// Coordenadas base (região fictícia no Brasil central)
const latBase = -15.8;
const lngBase = -47.9;

// Gerar escolas
export const gerarEscolas = (quantidade = 32) => {
  const escolas = [];
  const etapas = ['INFANTIL', 'FUNDAMENTAL_1', 'FUNDAMENTAL_2'];
  const turnos = ['MANHA', 'TARDE', 'INTEGRAL'];

  for (let i = 0; i < quantidade; i++) {
    const etapa = etapas[Math.floor(Math.random() * etapas.length)];
    const ideb = 3.5 + Math.random() * 3; // IDEB entre 3.5 e 6.5
    const metaIdeb = ideb + (Math.random() * 0.5 - 0.2); // Meta próxima ao IDEB
    const totalAlunos = 200 + Math.floor(Math.random() * 500);

    escolas.push({
      id: generateId(),
      nome: nomesEscolas[i] || `E.M. Escola ${i + 1}`,
      endereco: {
        logradouro: `Rua ${nomesEscolas[i]?.split(' ').pop() || 'Principal'}`,
        numero: `${100 + Math.floor(Math.random() * 900)}`,
        bairro: bairros[Math.floor(Math.random() * bairros.length)],
        cep: `7${Math.floor(10000000 + Math.random() * 9000000)}`,
        latitude: latBase + (Math.random() - 0.5) * 0.15,
        longitude: lngBase + (Math.random() - 0.5) * 0.2
      },
      diretor: nomesProfessores[Math.floor(Math.random() * nomesProfessores.length)],
      telefone: `(61) 3${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      email: `escola${i + 1}@educacao.gov.br`,
      etapa,
      etapas: [etapa],
      turnos: turnos.slice(0, 1 + Math.floor(Math.random() * 2)),
      zona: Math.random() > 0.2 ? 'URBANA' : 'RURAL',
      ideb: parseFloat(ideb.toFixed(1)),
      metaIdeb: parseFloat(metaIdeb.toFixed(1)),
      totalAlunos,
      totalTurmas: Math.floor(totalAlunos / 30),
      totalProfessores: Math.floor(totalAlunos / 20),
      taxaAprovacao: 85 + Math.random() * 12,
      taxaFrequencia: 88 + Math.random() * 10,
      distorcaoIdadeSerie: 5 + Math.random() * 20,
      infraestrutura: {
        biblioteca: Math.random() > 0.25,
        labInformatica: Math.random() > 0.4,
        quadra: ['COBERTA', 'DESCOBERTA', 'NAO_POSSUI'][Math.floor(Math.random() * 3)],
        internet: ['BANDA_LARGA', 'LENTA', 'NAO_POSSUI'][Math.floor(Math.random() * 3)],
        acessibilidade: ['COMPLETA', 'PARCIAL', 'NAO_POSSUI'][Math.floor(Math.random() * 3)],
        condicaoGeral: ['BOA', 'REGULAR', 'PRECARIA'][Math.floor(Math.random() * 3)],
        totalSalas: 8 + Math.floor(Math.random() * 12),
        capacidadeMaxima: totalAlunos + Math.floor(Math.random() * 100) - 50
      }
    });
  }

  return escolas;
};

// Escolas geradas
export const escolas = gerarEscolas(32);

// Dashboard Visão Geral
export const dashboardVisaoGeral = {
  kpis: {
    totalMatriculas: escolas.reduce((acc, e) => acc + e.totalAlunos, 0),
    variacaoMatriculas: 3.2,
    totalEscolas: escolas.length,
    totalProfessores: escolas.reduce((acc, e) => acc + e.totalProfessores, 0),
    variacaoProfessores: 12,
    idebMedio: parseFloat((escolas.reduce((acc, e) => acc + e.ideb, 0) / escolas.length).toFixed(1)),
    variacaoIdeb: 0.4,
    taxaAprovacao: parseFloat((escolas.reduce((acc, e) => acc + e.taxaAprovacao, 0) / escolas.length).toFixed(1)),
    variacaoAprovacao: 1.2
  },
  escolas: escolas.map(e => ({
    id: e.id,
    nome: e.nome,
    latitude: e.endereco.latitude,
    longitude: e.endereco.longitude,
    ideb: e.ideb,
    totalAlunos: e.totalAlunos,
    etapa: e.etapa
  })),
  alertas: [
    { id: generateId(), tipo: 'CRITICO', mensagem: '3 escolas com IDEB abaixo da meta', data: new Date() },
    { id: generateId(), tipo: 'ATENCAO', mensagem: '5 turmas com lotação acima de 35 alunos', data: new Date() },
    { id: generateId(), tipo: 'SUCESSO', mensagem: '8 escolas atingiram a meta do IDEB', data: new Date() },
    { id: generateId(), tipo: 'ATENCAO', mensagem: '127 alunos com frequência abaixo de 75%', data: new Date() },
    { id: generateId(), tipo: 'CRITICO', mensagem: '2 escolas com infraestrutura precária', data: new Date() },
    { id: generateId(), tipo: 'SUCESSO', mensagem: 'Taxa de aprovação geral aumentou 1.2pp', data: new Date() }
  ]
};

// Desempenho Acadêmico
export const desempenhoAcademico = {
  idebMedio: dashboardVisaoGeral.kpis.idebMedio,
  metaIdeb: 5.5,
  proficienciaPortugues: 245,
  proficienciaMatematica: 238,

  evolucaoHistorica: [
    { ano: 2019, ideb: 4.5, portugues: 220, matematica: 215 },
    { ano: 2020, ideb: 4.6, portugues: 225, matematica: 220 },
    { ano: 2021, ideb: 4.8, portugues: 232, matematica: 228 },
    { ano: 2022, ideb: 5.0, portugues: 240, matematica: 235 },
    { ano: 2023, ideb: 5.2, portugues: 245, matematica: 238 }
  ],

  comparativoEscolas: escolas.map(e => ({
    escolaId: e.id,
    escolaNome: e.nome,
    ideb: e.ideb,
    meta: e.metaIdeb,
    atingiuMeta: e.ideb >= e.metaIdeb
  })).sort((a, b) => b.ideb - a.ideb),

  distribuicaoNiveis: escolas.slice(0, 10).map(e => ({
    escola: e.nome.replace('E.M. ', ''),
    insuficiente: 5 + Math.random() * 15,
    basico: 20 + Math.random() * 20,
    adequado: 30 + Math.random() * 25,
    avancado: 15 + Math.random() * 20
  }))
};

// Fluxo Escolar
export const fluxoEscolar = {
  taxaAprovacao: dashboardVisaoGeral.kpis.taxaAprovacao,
  taxaReprovacao: 5.8,
  taxaAbandono: 1.9,
  distorcaoIdadeSerie: 12.4,

  porEtapa: [
    { etapa: 'Educação Infantil', aprovacao: 98.5, reprovacao: 0.5, abandono: 1.0 },
    { etapa: 'Fundamental I', aprovacao: 94.2, reprovacao: 4.3, abandono: 1.5 },
    { etapa: 'Fundamental II', aprovacao: 89.8, reprovacao: 7.8, abandono: 2.4 }
  ],

  funilProgressao: [
    { serie: '1º Ano', totalAlunos: 1450, concluiram: 1420 },
    { serie: '2º Ano', totalAlunos: 1380, concluiram: 1350 },
    { serie: '3º Ano', totalAlunos: 1320, concluiram: 1280 },
    { serie: '4º Ano', totalAlunos: 1250, concluiram: 1200 },
    { serie: '5º Ano', totalAlunos: 1180, concluiram: 1130 },
    { serie: '6º Ano', totalAlunos: 1100, concluiram: 1020 },
    { serie: '7º Ano', totalAlunos: 980, concluiram: 900 },
    { serie: '8º Ano', totalAlunos: 880, concluiram: 810 },
    { serie: '9º Ano', totalAlunos: 790, concluiram: 750 }
  ],

  distorcaoPorEscola: escolas.slice(0, 10).map(e => ({
    escola: e.nome.replace('E.M. ', ''),
    series: [
      { serie: '1º', percentualDistorcao: 2 + Math.random() * 8 },
      { serie: '2º', percentualDistorcao: 4 + Math.random() * 10 },
      { serie: '3º', percentualDistorcao: 6 + Math.random() * 12 },
      { serie: '4º', percentualDistorcao: 8 + Math.random() * 14 },
      { serie: '5º', percentualDistorcao: 10 + Math.random() * 15 },
      { serie: '6º', percentualDistorcao: 12 + Math.random() * 18 },
      { serie: '7º', percentualDistorcao: 14 + Math.random() * 20 },
      { serie: '8º', percentualDistorcao: 15 + Math.random() * 22 },
      { serie: '9º', percentualDistorcao: 16 + Math.random() * 24 }
    ]
  }))
};

// Frequência
export const frequencia = {
  taxaFrequenciaGeral: 94.2,
  totalAbsenteismoCronico: 847,
  totalInfrequentes: 127,

  frequenciaMensal: [
    { mes: 'Fev', frequencia: 96.5 },
    { mes: 'Mar', frequencia: 95.8 },
    { mes: 'Abr', frequencia: 94.2 },
    { mes: 'Mai', frequencia: 93.8 },
    { mes: 'Jun', frequencia: 92.5 },
    { mes: 'Jul', frequencia: 91.2 },
    { mes: 'Ago', frequencia: 94.5 },
    { mes: 'Set', frequencia: 95.2 },
    { mes: 'Out', frequencia: 94.8 },
    { mes: 'Nov', frequencia: 93.5 },
    { mes: 'Dez', frequencia: 92.0 }
  ],

  porEscola: escolas.map(e => ({
    escolaId: e.id,
    escolaNome: e.nome,
    frequencia: e.taxaFrequencia,
    alunosCriticos: Math.floor(e.totalAlunos * (1 - e.taxaFrequencia / 100) * 0.3)
  })).sort((a, b) => a.frequencia - b.frequencia),

  alunosCriticos: Array.from({ length: 30 }, (_, i) => {
    const escola = escolas[Math.floor(Math.random() * escolas.length)];
    const faltas = 25 + Math.floor(Math.random() * 30);
    return {
      alunoId: generateId(),
      nome: `${nomesAlunos[Math.floor(Math.random() * nomesAlunos.length)]} ${['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira'][Math.floor(Math.random() * 5)]}`,
      escola: escola.nome,
      serie: `${1 + Math.floor(Math.random() * 9)}º Ano`,
      percentualFaltas: faltas,
      diasLetivos: 180,
      faltas: Math.floor(180 * faltas / 100)
    };
  }).sort((a, b) => b.percentualFaltas - a.percentualFaltas)
};

// Corpo Docente
export const corpoDocente = {
  totalProfessores: dashboardVisaoGeral.kpis.totalProfessores,
  efetivos: Math.floor(dashboardVisaoGeral.kpis.totalProfessores * 0.72),
  contratados: Math.floor(dashboardVisaoGeral.kpis.totalProfessores * 0.28),

  formacao: {
    semSuperior: 8,
    graduacao: 145,
    especializacao: 245,
    mestrado: 78,
    doutorado: 11
  },

  adequacaoFormacao: 82.5,
  regularidadeMedia: 4.8,
  relacaoAlunoProfessor: 18.5,

  porEscola: escolas.map(e => ({
    escolaId: e.id,
    escolaNome: e.nome,
    totalProfessores: e.totalProfessores,
    comPosGraduacao: Math.floor(e.totalProfessores * (0.6 + Math.random() * 0.3)),
    adequados: Math.floor(e.totalProfessores * (0.7 + Math.random() * 0.25))
  })),

  listaProfessores: Array.from({ length: 50 }, (_, i) => {
    const escola = escolas[Math.floor(Math.random() * escolas.length)];
    const disciplinas = ['Português', 'Matemática', 'Ciências', 'História', 'Geografia', 'Educação Física', 'Artes', 'Inglês'];
    const formacoes = ['Graduação', 'Especialização', 'Mestrado', 'Doutorado'];

    return {
      id: generateId(),
      nome: nomesProfessores[i % nomesProfessores.length] + (i >= nomesProfessores.length ? ` ${Math.floor(i / nomesProfessores.length) + 1}` : ''),
      escola: escola.nome,
      disciplina: disciplinas[Math.floor(Math.random() * disciplinas.length)],
      formacao: formacoes[Math.floor(Math.random() * formacoes.length)],
      vinculo: Math.random() > 0.3 ? 'EFETIVO' : 'CONTRATADO',
      anosNaEscola: Math.floor(Math.random() * 15)
    };
  })
};

// Infraestrutura
export const infraestrutura = {
  resumoRede: {
    percentualComBiblioteca: 78,
    percentualComLabInfo: 62,
    percentualComQuadra: 84,
    percentualComInternet: 91,
    percentualAcessivel: 45
  },

  condicaoGeral: {
    boa: escolas.filter(e => e.infraestrutura.condicaoGeral === 'BOA').length,
    regular: escolas.filter(e => e.infraestrutura.condicaoGeral === 'REGULAR').length,
    precaria: escolas.filter(e => e.infraestrutura.condicaoGeral === 'PRECARIA').length
  },

  porEscola: escolas.map(e => ({
    escolaId: e.id,
    escolaNome: e.nome,
    ...e.infraestrutura,
    alunosAtuais: e.totalAlunos
  })),

  problemasUrgentes: [
    { escolaId: escolas[0].id, escolaNome: escolas[0].nome, problema: 'Telhado com infiltrações', prioridade: 'ALTA' },
    { escolaId: escolas[5].id, escolaNome: escolas[5].nome, problema: 'Falta de acessibilidade', prioridade: 'ALTA' },
    { escolaId: escolas[12].id, escolaNome: escolas[12].nome, problema: 'Laboratório de informática sem manutenção', prioridade: 'MEDIA' },
    { escolaId: escolas[8].id, escolaNome: escolas[8].nome, problema: 'Quadra descoberta danificada', prioridade: 'MEDIA' },
    { escolaId: escolas[20].id, escolaNome: escolas[20].nome, problema: 'Internet lenta', prioridade: 'BAIXA' },
    { escolaId: escolas[15].id, escolaNome: escolas[15].nome, problema: 'Biblioteca desatualizada', prioridade: 'BAIXA' }
  ]
};

// Financeiro
export const financeiro = {
  orcamentoTotal: 48500000,
  orcamentoExecutado: 35280000,
  percentualExecutado: 72.7,
  custoPorAluno: 3895,
  fundebRecebido: 32500000,

  distribuicaoDespesas: [
    { categoria: 'Pessoal e Encargos', valor: 28200000, percentual: 58.1 },
    { categoria: 'Material Didático', valor: 4850000, percentual: 10.0 },
    { categoria: 'Alimentação Escolar', valor: 5820000, percentual: 12.0 },
    { categoria: 'Transporte Escolar', valor: 3880000, percentual: 8.0 },
    { categoria: 'Manutenção e Infraestrutura', valor: 2910000, percentual: 6.0 },
    { categoria: 'Tecnologia e Equipamentos', valor: 1455000, percentual: 3.0 },
    { categoria: 'Capacitação de Professores', valor: 970000, percentual: 2.0 },
    { categoria: 'Outros', valor: 415000, percentual: 0.9 }
  ],

  custoPorEscola: escolas.map(e => ({
    escolaId: e.id,
    escolaNome: e.nome,
    custoTotal: e.totalAlunos * (3500 + Math.random() * 1000),
    custoPorAluno: 3500 + Math.random() * 1000,
    totalAlunos: e.totalAlunos
  })).sort((a, b) => b.custoPorAluno - a.custoPorAluno),

  evolucaoAnual: [
    { ano: 2019, orcamento: 38000000, executado: 35500000 },
    { ano: 2020, orcamento: 40000000, executado: 36200000 },
    { ano: 2021, orcamento: 42500000, executado: 39800000 },
    { ano: 2022, orcamento: 45000000, executado: 42100000 },
    { ano: 2023, orcamento: 48500000, executado: 35280000 }
  ]
};

// Perfil dos Alunos
export const perfilAlunos = {
  totalAlunos: dashboardVisaoGeral.kpis.totalMatriculas,

  genero: {
    masculino: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.51),
    feminino: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.49)
  },

  etnia: {
    branca: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.32),
    preta: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.12),
    parda: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.45),
    amarela: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.02),
    indigena: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.01),
    naoDeclarada: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.08)
  },

  alunosComDeficiencia: {
    total: 385,
    tipos: [
      { tipo: 'Deficiência Intelectual', quantidade: 145 },
      { tipo: 'Transtorno do Espectro Autista', quantidade: 98 },
      { tipo: 'Deficiência Física', quantidade: 52 },
      { tipo: 'Deficiência Auditiva', quantidade: 38 },
      { tipo: 'Deficiência Visual', quantidade: 28 },
      { tipo: 'Altas Habilidades/Superdotação', quantidade: 24 }
    ]
  },

  nivelSocioeconomico: {
    muitoBaixo: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.08),
    baixo: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.22),
    medioBaixo: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.35),
    medio: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.25),
    medioAlto: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.08),
    alto: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.02)
  },

  bolsaFamilia: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.38),

  zona: {
    urbana: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.82),
    rural: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.18)
  },

  transporte: {
    utilizaTransporteEscolar: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.24),
    naoUtiliza: Math.floor(dashboardVisaoGeral.kpis.totalMatriculas * 0.76)
  }
};

// Gerar detalhes de escola específica
export const getEscolaDetalhe = (escolaId) => {
  const escola = escolas.find(e => e.id === escolaId) || escolas[0];

  return {
    ...escola,
    indicadores: {
      totalMatriculas: escola.totalAlunos,
      totalTurmas: escola.totalTurmas,
      totalProfessores: escola.totalProfessores,
      ideb: escola.ideb,
      metaIdeb: escola.metaIdeb,
      taxaAprovacao: escola.taxaAprovacao,
      taxaFrequencia: escola.taxaFrequencia,
      distorcaoIdadeSerie: escola.distorcaoIdadeSerie
    },
    turmas: Array.from({ length: escola.totalTurmas }, (_, i) => {
      const series = ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano'];
      const turnos = ['Manhã', 'Tarde'];
      const serie = series[i % series.length];
      const turno = turnos[i % turnos.length];

      return {
        id: generateId(),
        nome: `${serie} ${String.fromCharCode(65 + Math.floor(i / series.length))}`,
        serie,
        turno,
        professor: nomesProfessores[Math.floor(Math.random() * nomesProfessores.length)],
        totalAlunos: 25 + Math.floor(Math.random() * 10),
        capacidade: 35
      };
    }),
    professores: Array.from({ length: escola.totalProfessores }, (_, i) => ({
      id: generateId(),
      nome: nomesProfessores[i % nomesProfessores.length],
      disciplina: ['Português', 'Matemática', 'Ciências', 'História', 'Geografia'][Math.floor(Math.random() * 5)],
      formacao: ['Graduação', 'Especialização', 'Mestrado'][Math.floor(Math.random() * 3)]
    })),
    historicoIdeb: [
      { ano: 2019, valor: escola.ideb - 0.7 + Math.random() * 0.3 },
      { ano: 2020, valor: escola.ideb - 0.5 + Math.random() * 0.3 },
      { ano: 2021, valor: escola.ideb - 0.3 + Math.random() * 0.2 },
      { ano: 2022, valor: escola.ideb - 0.1 + Math.random() * 0.1 },
      { ano: 2023, valor: escola.ideb }
    ]
  };
};

// Filtros globais (default)
export const filtrosGlobais = {
  anoLetivo: 2023,
  etapa: 'TODOS',
  escola: 'TODAS',
  zona: 'TODAS',
  turno: 'TODOS'
};

// Export all data
export default {
  dashboardVisaoGeral,
  desempenhoAcademico,
  fluxoEscolar,
  frequencia,
  corpoDocente,
  infraestrutura,
  financeiro,
  perfilAlunos,
  escolas,
  getEscolaDetalhe,
  filtrosGlobais
};
