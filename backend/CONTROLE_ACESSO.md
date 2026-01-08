# Sistema de Controle de Acesso

Este documento descreve o sistema de controle de acesso implementado no Django backend.

## Grupos de Usuários

O sistema possui 4 grupos de usuários com diferentes níveis de acesso:

### 1. 👁️ Gestor
- **Permissão**: Apenas leitura (visualização)
- **Acesso**: Dashboard
- **Descrição**: Pode apenas visualizar o dashboard e dados do sistema, sem permissão para criar, editar ou deletar

### 2. 🏛️ Coordenador
- **Permissão**: Acesso completo aos dados da sua cidade
- **Acesso**: Todos os endpoints (CRUD completo)
- **Restrição**: Vê apenas dados relacionados à cidade associada ao seu usuário
- **Descrição**: Tem controle total sobre escolas, turmas, alunos e professores da sua cidade

### 3. 👨‍💼 Gerente
- **Permissão**: Edição sem cadastro
- **Acesso**: GET, PUT, PATCH, DELETE (sem POST)
- **Descrição**: Pode visualizar, editar e deletar registros, mas NÃO pode criar novos registros

### 4. 🔑 Administrador
- **Permissão**: Acesso total
- **Acesso**: Todos os endpoints, todas as cidades
- **Descrição**: Controle completo do sistema, sem restrições geográficas

## Modelo de Usuário

### Campos do CustomUser
```python
- username: Nome de usuário (login)
- email: Email do usuário
- first_name: Primeiro nome
- last_name: Sobrenome
- role: Papel do usuário (gestor/coordenador/gerente/administrador)
- city: Cidade associada (obrigatório para coordenadores)
- phone: Telefone (opcional)
- is_active: Usuário ativo
- is_staff: Acesso ao admin
- is_superuser: Superusuário Django
```

### Propriedades úteis
```python
user.is_gestor          # True se for gestor
user.is_coordenador     # True se for coordenador
user.is_gerente         # True se for gerente
user.is_administrador   # True se for administrador
```

## Endpoints da API

### Gerenciamento de Usuários

**Base URL**: `/api/users/`

#### Listar usuários
```http
GET /api/users/
```
- Administrador: vê todos os usuários
- Coordenador: vê apenas usuários da sua cidade
- Gerente/Gestor: vê todos os usuários (sem poder criar)

#### Criar usuário
```http
POST /api/users/
Content-Type: application/json

{
    "username": "usuario",
    "email": "email@example.com",
    "password": "senha123",
    "password_confirm": "senha123",
    "first_name": "Nome",
    "last_name": "Sobrenome",
    "role": "coordenador",
    "city": 1,
    "phone": "11999999999"
}
```
- Apenas Administrador pode criar

#### Visualizar usuário específico
```http
GET /api/users/{id}/
```

#### Atualizar usuário
```http
PUT /api/users/{id}/
PATCH /api/users/{id}/
Content-Type: application/json

{
    "email": "novoemail@example.com",
    "first_name": "Novo Nome",
    "role": "gerente"
}
```
- Administrador e Gerente podem editar

#### Deletar usuário
```http
DELETE /api/users/{id}/
```
- Apenas Administrador pode deletar

#### Ver informações do usuário logado
```http
GET /api/users/me/
```
- Retorna dados do usuário autenticado

#### Mudar senha
```http
POST /api/users/{id}/change_password/
Content-Type: application/json

{
    "old_password": "senha_antiga",
    "new_password": "senha_nova",
    "new_password_confirm": "senha_nova"
}
```
- Usuário só pode mudar sua própria senha (exceto admin)

#### Listar roles disponíveis
```http
GET /api/users/roles/
```
- Retorna lista de todos os roles disponíveis

## Filtros por Cidade (Coordenadores)

Coordenadores têm acesso filtrado automaticamente nos seguintes endpoints:

### Cidades
- **GET** `/api/cities/` - Vê apenas sua cidade

### Escolas
- **GET** `/api/schools/` - Vê apenas escolas da sua cidade
- **POST/PUT/DELETE** - Pode gerenciar escolas da sua cidade

### Turmas
- **GET** `/api/classes/` - Vê apenas turmas de escolas da sua cidade
- **POST/PUT/DELETE** - Pode gerenciar turmas da sua cidade

### Alunos
- **GET** `/api/students/` - Vê apenas alunos de escolas da sua cidade
- **POST/PUT/DELETE** - Pode gerenciar alunos da sua cidade

### Dashboard
- **GET** `/api/dashboard-secretaria/visao_geral/` - Vê apenas dados da sua cidade
- Todos os indicadores são filtrados por cidade automaticamente

## Autenticação

### Configuração Atual
O sistema usa:
- **SessionAuthentication**: Login via sessão Django
- **BasicAuthentication**: Login via header HTTP Basic Auth

### Login via Admin Django
1. Acesse: `http://localhost:8000/admin/`
2. Faça login com usuário/senha
3. A sessão será criada automaticamente

### Login via API (BasicAuth)
```http
GET /api/users/me/
Authorization: Basic base64(username:password)
```

## Configuração do Banco de Dados

### Aplicar Migrações
```bash
# Ativar ambiente virtual
source venv/bin/activate

# Aplicar migrações
python manage.py migrate

# Criar superusuário (administrador inicial)
python manage.py createsuperuser
```

### Criar Usuários Iniciais

#### Via Admin Django
1. Acesse `/admin/`
2. Vá em "Users" (Usuários)
3. Clique em "Add User" (Adicionar Usuário)
4. Preencha os campos:
   - Username
   - Password
   - Role
   - City (para coordenadores)

#### Via Shell Django
```bash
python manage.py shell
```

```python
from students.models import CustomUser, TbCity

# Criar cidade (se não existir)
cidade = TbCity.objects.create(city="São Paulo", state="SP")

# Criar administrador
admin = CustomUser.objects.create_user(
    username='admin',
    email='admin@example.com',
    password='senha123',
    role='administrador',
    first_name='Admin',
    last_name='Sistema'
)

# Criar coordenador
coordenador = CustomUser.objects.create_user(
    username='coord_sp',
    email='coord@sp.com',
    password='senha123',
    role='coordenador',
    city=cidade,
    first_name='João',
    last_name='Silva'
)

# Criar gerente
gerente = CustomUser.objects.create_user(
    username='gerente1',
    email='gerente@example.com',
    password='senha123',
    role='gerente',
    first_name='Maria',
    last_name='Santos'
)

# Criar gestor
gestor = CustomUser.objects.create_user(
    username='gestor1',
    email='gestor@example.com',
    password='senha123',
    role='gestor',
    first_name='Pedro',
    last_name='Costa'
)
```

## Classes de Permissão

### RoleBasedPermission
Permissão principal que combina todas as regras:
- Administrador: acesso total
- Coordenador: acesso completo aos dados da sua cidade
- Gerente: pode editar mas não criar
- Gestor: apenas leitura

### DashboardPermission
Permissão específica para dashboard:
- Todos podem acessar
- Coordenadores veem apenas dados da sua cidade

### IsAdministrador
Permite acesso apenas para administradores

### IsCoordenadorOrAdmin
Permite acesso para coordenadores (da sua cidade) e administradores

### IsGerenteOrAdmin
Permite acesso para gerentes (edição sem criação) e administradores

## Exemplos de Uso

### Exemplo 1: Coordenador criando escola
```python
# Usuário logado: coordenador de São Paulo
# POST /api/schools/
{
    "school": "Escola Municipal João Silva",
    "director_name": "Maria Santos",
    "id_city": 1,  # São Paulo (sua cidade)
    "address": "Rua das Flores, 123"
}
# ✅ Permitido - escola está na cidade do coordenador
```

### Exemplo 2: Coordenador tentando criar escola em outra cidade
```python
# Usuário logado: coordenador de São Paulo
# POST /api/schools/
{
    "school": "Escola Municipal de Santos",
    "id_city": 2,  # Santos (outra cidade)
}
# ❌ Bloqueado - escola não está na cidade do coordenador
```

### Exemplo 3: Gerente tentando criar aluno
```python
# Usuário logado: gerente
# POST /api/students/
{
    "student_name": "João Silva",
    "id_class": 1
}
# ❌ Bloqueado - gerente não pode criar (apenas editar)
```

### Exemplo 4: Gerente editando aluno
```python
# Usuário logado: gerente
# PUT /api/students/123/
{
    "student_name": "João Silva Junior",
    "status": "enrolled"
}
# ✅ Permitido - gerente pode editar
```

### Exemplo 5: Gestor visualizando dashboard
```python
# Usuário logado: gestor
# GET /api/dashboard-secretaria/visao_geral/
# ✅ Permitido - gestor pode visualizar dashboard
```

### Exemplo 6: Gestor tentando criar turma
```python
# Usuário logado: gestor
# POST /api/classes/
{
    "class_name": "3º Ano A"
}
# ❌ Bloqueado - gestor só tem permissão de leitura
```

## Segurança

### Proteção de Endpoints
- Todos os endpoints requerem autenticação (`IsAuthenticated`)
- Permissões são verificadas em nível de ViewSet e objeto
- Filtros automáticos por cidade para coordenadores

### Mudança de Senha
- Usuários podem mudar apenas sua própria senha
- Administradores podem mudar senha de qualquer usuário
- Senha antiga deve ser verificada

### Validações
- Senhas devem ser confirmadas na criação
- Email deve ser único
- Username deve ser único
- Coordenadores DEVEM ter uma cidade associada

## Troubleshooting

### Erro: "Authentication credentials were not provided"
- Certifique-se de estar autenticado
- Use BasicAuth ou faça login via admin

### Erro: "You do not have permission to perform this action"
- Verifique seu role (gestor/coordenador/gerente/administrador)
- Coordenadores: verifique se está tentando acessar dados da sua cidade
- Gerentes: verifique se não está tentando criar (POST)
- Gestores: verifique se não está tentando modificar dados

### Erro ao aplicar migrações
```bash
# Verifique se o PostgreSQL está rodando
sudo service postgresql start

# Verifique as variáveis de ambiente no .env
cat .env

# Aplique as migrações novamente
python manage.py migrate
```

## Arquivos Modificados

### Backend
- `students/models.py` - Modelo CustomUser
- `api/permissions.py` - Classes de permissão (NOVO)
- `api/serializers.py` - Serializers para CustomUser
- `api/views.py` - ViewSet CustomUser e filtros
- `api/urls.py` - Rota /api/users/
- `students/admin.py` - Admin do Django
- `config/settings.py` - AUTH_USER_MODEL e REST_FRAMEWORK

### Migrations
- `students/migrations/0003_*.py` - Migração do CustomUser

## Próximos Passos (Opcional)

1. **JWT Authentication**: Implementar autenticação via tokens JWT
2. **Refresh Tokens**: Sistema de refresh tokens
3. **Logs de Auditoria**: Registrar ações dos usuários
4. **2FA**: Autenticação de dois fatores
5. **Rate Limiting**: Limitar requisições por usuário
6. **Email Verification**: Verificação de email no cadastro
7. **Password Reset**: Recuperação de senha via email
