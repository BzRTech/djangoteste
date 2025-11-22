# 📁 Estrutura do Frontend - React

## 🗂️ Nova Estrutura de Pastas

```
frontend/src/
├── App.jsx                          # Router principal
├── index.js                         # Entry point
├── index.css                        # Estilos globais
│
├── components/                      # Componentes reutilizáveis
│   ├── Layout.jsx                   # Layout com navbar e footer
│   │
│   ├── dashboard/                   # Componentes do Dashboard
│   │   ├── StatsCards.jsx          # Cards de estatísticas
│   │   ├── ChartsGrid.jsx          # Grid de gráficos
│   │   └── StudentsTable.jsx       # Tabela de alunos
│   │
│   └── descriptors/                 # Componentes dos Descritores
│       ├── DescriptorStats.jsx     # Cards de estatísticas
│       ├── DescriptorFilters.jsx   # Filtros de busca
│       └── DescriptorList.jsx      # Lista de descritores
│
└── pages/                           # Páginas completas
    ├── Dashboard.jsx                # Página do Dashboard
    └── DescriptorCatalog.jsx        # Página do Catálogo
```

## 🚀 Como Implementar

### 1. Criar a estrutura de pastas

```bash
cd frontend/src
mkdir pages
mkdir components/dashboard
mkdir components/descriptors
```

### 2. Mover e criar arquivos

**App.jsx** (substituir o existente)
- Implementa React Router
- Define rotas principais

**components/Layout.jsx** (novo)
- Navbar com navegação
- Menu mobile responsivo
- Footer

**pages/Dashboard.jsx** (novo)
- Lógica de fetch dos dados
- Composição dos componentes do dashboard

**pages/DescriptorCatalog.jsx** (novo)
- Lógica de fetch e filtros
- Composição dos componentes de descritores

**Componentes do Dashboard:**
- `components/dashboard/StatsCards.jsx` - Cards de estatísticas
- `components/dashboard/ChartsGrid.jsx` - Gráficos (Bar, Pie, Line)
- `components/dashboard/StudentsTable.jsx` - Tabela de alunos

**Componentes dos Descritores:**
- `components/descriptors/DescriptorStats.jsx` - Cards de estatísticas
- `components/descriptors/DescriptorFilters.jsx` - Sistema de filtros
- `components/descriptors/DescriptorList.jsx` - Lista de descritores

### 3. Deletar arquivos antigos (opcional)

Você pode deletar:
- `src/components/StudentTable.jsx` (substituído)
- `src/components/DescriptorCatalog.jsx` (movido para pages)
- `src/models/Dashboard.jsx` (não usado)

## 🎨 Navegação

### Rotas Disponíveis:

- `/` → Redireciona para `/dashboard`
- `/dashboard` → Página do Dashboard
- `/descriptors` → Catálogo de Descritores

### Menu de Navegação:

O componente `Layout.jsx` fornece uma navbar com:
- Logo do sistema
- Links de navegação (Dashboard e Descritores)
- Menu mobile responsivo
- Active state visual nos links

## 📦 Dependências Necessárias

Todas já estão no package.json:
- `react-router-dom` - Roteamento
- `recharts` - Gráficos
- `lucide-react` - Ícones

## 🔄 Fluxo de Dados

### Dashboard:
```
Dashboard (page)
  ↓ fetch data
  ├─→ StatsCards (students, classes, teachers, schools)
  ├─→ ChartsGrid (students, classes)
  └─→ StudentsTable (students)
```

### Descriptor Catalog:
```
DescriptorCatalog (page)
  ↓ fetch & filter data
  ├─→ DescriptorStats (distractors, subjects, grades, filtered)
  ├─→ DescriptorFilters (filter states & handlers)
  └─→ DescriptorList (filteredDistractors)
```

## 🎯 Vantagens da Nova Estrutura

1. **Separação de Responsabilidades**
   - Pages: Lógica e fetch de dados
   - Components: Apresentação e UI

2. **Reutilização**
   - Componentes podem ser usados em outras páginas
   - Fácil manutenção e testes

3. **Organização**
   - Fácil encontrar componentes
   - Estrutura escalável

4. **Navegação Intuitiva**
   - URLs claras e RESTful
   - Menu sempre visível

## 🔧 Próximos Passos Possíveis

1. Adicionar página de detalhes de aluno
2. Criar página de gerenciamento de turmas
3. Implementar página de relatórios
4. Adicionar autenticação
5. Implementar temas (dark mode)

## 📝 Notas Importantes

- Todos os componentes usam Tailwind CSS
- API base configurada em cada página: `http://127.0.0.1:8000/api`
- Estados de loading e erro tratados em cada página
- Layout responsivo (mobile-first)

## 🐛 Troubleshooting

**Erro: "Cannot find module './pages/Dashboard'"**
- Certifique-se de criar a pasta `pages/` e os arquivos dentro dela

**Erro: "useRoutes is not a function"**
- Verifique se `react-router-dom` está instalado: `npm install react-router-dom`

**Navegação não funciona**
- Verifique se `<Router>` está envolvendo as rotas no App.jsx
- Confirme que está usando `<Link>` ou `<NavLink>` do react-router-dom

## ✅ Checklist de Implementação

- [ ] Criar estrutura de pastas
- [ ] Atualizar App.jsx com Router
- [ ] Criar Layout.jsx
- [ ] Criar pages/Dashboard.jsx
- [ ] Criar pages/DescriptorCatalog.jsx
- [ ] Criar componentes do dashboard
- [ ] Criar componentes dos descritores
- [ ] Testar navegação
- [ ] Testar responsividade
- [ ] Deletar arquivos antigos (opcional)