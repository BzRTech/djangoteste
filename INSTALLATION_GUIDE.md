# 🚀 Guia de Instalação e Configuração

## 📋 Pré-requisitos

- Python 3.8+
- PostgreSQL instalado e rodando
- Node.js e npm (para o frontend)

## 🔧 Backend (Django)

### 1. Instalar Dependências

```bash
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install django-filter
pip install python-dotenv
pip install psycopg2-binary
```

Ou use o requirements.txt:

```bash
pip install -r requirements.txt
```

### 2. Configurar Banco de Dados

Crie um arquivo `.env` na raiz do projeto:

```env
DB_NAME=seu_banco
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```

### 3. Aplicar Migrações (se necessário)

```bash
python manage.py migrate
```

### 4. Criar Superusuário (opcional)

```bash
python manage.py createsuperuser
```

### 5. Iniciar Servidor

```bash
python manage.py runserver
```

O servidor estará rodando em: `http://127.0.0.1:8000`

---

## 🎨 Frontend (React)

### 1. Instalar Dependências

```bash
cd "0 frontend/school-frontend"
npm install
```

### 2. Criar Estrutura de Pastas

```bash
cd src
mkdir pages
mkdir components/dashboard
mkdir components/descriptors
```

### 3. Copiar Arquivos

Copie todos os arquivos fornecidos para suas respectivas pastas:

**src/**
- `App.jsx` (substituir o existente)

**src/components/**
- `Layout.jsx`

**src/pages/**
- `Dashboard.jsx`
- `DescriptorCatalog.jsx`

**src/components/dashboard/**
- `StatsCards.jsx`
- `ChartsGrid.jsx`
- `StudentsTable.jsx`

**src/components/descriptors/**
- `DescriptorStats.jsx`
- `DescriptorFilters.jsx`
- `DescriptorList.jsx`

### 4. Iniciar Frontend

```bash
npm start
```

O app estará rodando em: `http://localhost:3000`

---

## ✅ Testando a API

### Opção 1: Navegador

Acesse diretamente no navegador:
- http://127.0.0.1:8000/api/
- http://127.0.0.1:8000/api/students/
- http://127.0.0.1:8000/api/classes/

### Opção 2: Postman/Insomnia

Configure uma coleção com as URLs da documentação.

### Opção 3: Página de Teste HTML

Abra o arquivo `test-api.html` no navegador.

### Opção 4: Python Requests

```python
import requests

# Listar alunos
response = requests.get('http://127.0.0.1:8000/api/students/')
print(response.json())

# Criar aluno
data = {
    'student_serial': 12345,
    'student_name': 'João Silva',
    'id_class': 1,
    'status': 'enrolled'
}
response = requests.post('http://127.0.0.1:8000/api/students/', json=data)
print(response.json())
```

---

## 🧪 Endpoints para Testar

### Básicos
```bash
GET http://127.0.0.1:8000/api/cities/
GET http://127.0.0.1:8000/api/schools/
GET http://127.0.0.1:8000/api/teachers/
GET http://127.0.0.1:8000/api/classes/
GET http://127.0.0.1:8000/api/students/
```

### Com Filtros
```bash
GET http://127.0.0.1:8000/api/students/?id_class=1
GET http://127.0.0.1:8000/api/students/?status=enrolled
GET http://127.0.0.1:8000/api/students/?search=João
```

### Descritores
```bash
GET http://127.0.0.1:8000/api/distractors/
GET http://127.0.0.1:8000/api/distractors/?subject=Matemática
GET http://127.0.0.1:8000/api/distractors/?grade=5
```

### Exames e Questões
```bash
GET http://127.0.0.1:8000/api/exams/
GET http://127.0.0.1:8000/api/exams/1/questions/
GET http://127.0.0.1:8000/api/questions/?id_exam=1
```

### Progresso
```bash
GET http://127.0.0.1:8000/api/learning-progress/
GET http://127.0.0.1:8000/api/learning-progress/by_student/?student_id=5
GET http://127.0.0.1:8000/api/learning-progress/low_performance/?threshold=50
```

---

## 🐛 Troubleshooting

### Erro: "No module named 'rest_framework'"
```bash
pip install djangorestframework
```

### Erro: "No module named 'corsheaders'"
```bash
pip install django-cors-headers
```

### Erro: "No module named 'django_filters'"
```bash
pip install django-filter
```

### Erro: CORS policy
Verifique se `django-cors-headers` está instalado e configurado em `settings.py`.

### Erro: Database connection
Verifique o arquivo `.env` e se o PostgreSQL está rodando.

### Frontend não conecta com Backend
- Verifique se o Django está rodando em `http://127.0.0.1:8000`
- Verifique o CORS no `settings.py`
- Abra o console do navegador (F12) para ver erros

---

## 📊 Verificando Dados

### Django Admin

1. Crie um superusuário:
```bash
python manage.py createsuperuser
```

2. Acesse: http://127.0.0.1:8000/admin

3. Registre os modelos em `api/admin.py`:

```python
from django.contrib import admin
from students.models import *

admin.site.register(TbCity)
admin.site.register(TbSchool)
admin.site.register(TbTeacher)
admin.site.register(TbClass)
admin.site.register(TbStudents)
admin.site.register(TbDistractorCatalog)
# ... etc
```

---

## 🎯 Próximos Passos

1. ✅ Backend rodando
2. ✅ Frontend rodando
3. ✅ Testar endpoints básicos
4. ✅ Testar navegação entre páginas
5. 📝 Adicionar mais funcionalidades
6. 🔒 Implementar autenticação
7. 📊 Adicionar mais dashboards

---

## 📝 Comandos Úteis

```bash
# Backend
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Frontend
npm start
npm run build
npm test

# Git
git status
git add .
git commit -m "mensagem"
git push
```

---

## 📚 Recursos

- Django REST Framework: https://www.django-rest-framework.org/
- React Router: https://reactrouter.com/
- Tailwind CSS: https://tailwindcss.com/
- Recharts: https://recharts.org/