# Changelog - Navbar Vertical e Página de Perfil

## Data: 08/12/2025

### Resumo
Implementação de navbar vertical à esquerda e criação de página de perfil de usuário.

---

## Alterações

### 1. Layout - Navbar Vertical (`frontend/src/components/Layout.jsx`)

**Antes:** Navbar horizontal no topo da página.

**Depois:** Sidebar vertical fixa à esquerda com as seguintes características:

- **Sidebar colapsável**: Botão para expandir/recolher a sidebar
- **Ícones em todos os links**: Melhor identificação visual
- **Textos simplificados**:
  - "Importar Provas" → "Importar"
  - "Respostas dos Alunos" → "Respostas"
  - "Prova" → "Aplicar Prova"
- **Responsividade**: Menu hamburguer no mobile com scroll para garantir visibilidade de todos os itens

**Links de navegação:**
| Rota | Label | Ícone |
|------|-------|-------|
| /dashboard | Dashboard | LayoutDashboard |
| /descriptors | Descritores | BookOpen |
| /admin | Administração | Settings |
| /exams | Provas | FileText |
| /exam-import | Importar | Upload |
| /student-answers | Respostas | ClipboardList |
| /take-exam | Aplicar Prova | PenTool |
| /profile | Meu Perfil | User |

---

### 2. Página de Perfil de Usuário (`frontend/src/pages/UserProfile.jsx`)

Nova página criada com 3 abas:

#### Aba 1: Informações Pessoais
- Nome completo
- E-mail
- Telefone
- Cidade
- Função
- Data de cadastro
- Botão para editar informações

#### Aba 2: Segurança
- Formulário para alteração de senha
- Campos: senha atual, nova senha, confirmar nova senha

#### Aba 3: Preferências
- Toggle para notificações por e-mail
- Toggle para notificações push
- Toggle para relatórios semanais
- Toggle para modo escuro

---

### 3. Rota Adicionada (`frontend/src/App.jsx`)

```jsx
<Route path="profile" element={<UserProfile />} />
```

---

## Arquivos Modificados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `frontend/src/components/Layout.jsx` | Modificado |
| `frontend/src/pages/UserProfile.jsx` | Criado |
| `frontend/src/App.jsx` | Modificado |

---

## Commits

1. `feat: implementa navbar vertical e página de perfil de usuário`
2. `fix: move link de perfil para navegação principal`

---

## Branch
`claude/vertical-navbar-profile-page-01JMyyMqK6BFUzps3gECuQY3`
