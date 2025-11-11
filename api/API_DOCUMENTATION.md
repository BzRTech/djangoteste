# 📚 Documentação Completa da API

Base URL: `http://127.0.0.1:8000/api/`

## 🏫 Estrutura e Localização

### Cidades
- **GET** `/cities/` - Lista todas as cidades
- **POST** `/cities/` - Cria nova cidade
- **GET** `/cities/{id}/` - Detalhes de uma cidade
- **PUT/PATCH** `/cities/{id}/` - Atualiza cidade
- **DELETE** `/cities/{id}/` - Remove cidade

**Filtros:** `?search=nome_cidade`

### Escolas
- **GET** `/schools/` - Lista todas as escolas
- **POST** `/schools/` - Cria nova escola
- **GET** `/schools/{id}/` - Detalhes de uma escola
- **PUT/PATCH** `/schools/{id}/` - Atualiza escola
- **DELETE** `/schools/{id}/` - Remove escola

**Filtros:** 
- `?id_city=1` - Filtra por cidade
- `?id_city__state=CE` - Filtra por estado
- `?search=nome_escola` - Busca por nome

### Professores
- **GET** `/teachers/` - Lista todos os professores
- **POST** `/teachers/` - Cria novo professor
- **GET** `/teachers/{id}/` - Detalhes de um professor
- **PUT/PATCH** `/teachers/{id}/` - Atualiza professor
- **DELETE** `/teachers/{id}/` - Remove professor

**Filtros:** 
- `?status=active` - Filtra por status
- `?search=nome` - Busca por nome ou matrícula

### Professor-Escola (Vínculos)
- **GET** `/teacher-schools/` - Lista todos os vínculos
- **POST** `/teacher-schools/` - Cria novo vínculo
- **GET** `/teacher-schools/{id}/` - Detalhes de um vínculo
- **PUT/PATCH** `/teacher-schools/{id}/` - Atualiza vínculo
- **DELETE** `/teacher-schools/{id}/` - Remove vínculo

**Filtros:** 
- `?id_teacher=1` - Filtra por professor
- `?id_school=2` - Filtra por escola
- `?status=active` - Filtra por status

### Turmas
- **GET** `/classes/` - Lista todas as turmas
- **POST** `/classes/` - Cria nova turma
- **GET** `/classes/{id}/` - Detalhes de uma turma
- **PUT/PATCH** `/classes/{id}/` - Atualiza turma
- **DELETE** `/classes/{id}/` - Remove turma

**Filtros:** 
- `?id_school=1` - Filtra por escola
- `?id_teacher=2` - Filtra por professor
- `?school_year=2024` - Filtra por ano letivo
- `?grade=5` - Filtra por série
- `?shift=morning` - Filtra por turno

### Alunos
- **GET** `/students/` - Lista todos os alunos
- **POST** `/students/` - Cria novo aluno
- **GET** `/students/{id_student}/` - Detalhes de um aluno
- **PUT/PATCH** `/students/{id_student}/` - Atualiza aluno
- **DELETE** `/students/{id_student}/` - Remove aluno

**Filtros:** 
- `?id_class=1` - Filtra por turma
- `?status=enrolled` - Filtra por status
- `?search=nome` - Busca por nome ou matrícula

---

## 📊 Indicadores IDEB

### Indicadores das Escolas
- **GET** `/school-ideb-indicators/` - Lista indicadores
- **POST** `/school-ideb-indicators/` - Cria indicador
- **GET** `/school-ideb-indicators/{id}/` - Detalhes
- **PUT/PATCH** `/school-ideb-indicators/{id}/` - Atualiza
- **DELETE** `/school-ideb-indicators/{id}/` - Remove

**Filtros:** 
- `?id_school=1` - Filtra por escola
- `?fiscal_year=2024` - Filtra por ano fiscal

### Indicadores das Turmas
- **GET** `/class-ideb-indicators/` - Lista indicadores
- **POST** `/class-ideb-indicators/` - Cria indicador
- **GET** `/class-ideb-indicators/{id}/` - Detalhes
- **PUT/PATCH** `/class-ideb-indicators/{id}/` - Atualiza
- **DELETE** `/class-ideb-indicators/{id}/` - Remove

**Filtros:** 
- `?id_class=1` - Filtra por turma
- `?fiscal_year=2024` - Filtra por ano fiscal

---

## 🎯 Competências e Descritores

### Competências IDEB
- **GET** `/competencies/` - Lista todas as competências
- **POST** `/competencies/` - Cria nova competência
- **GET** `/competencies/{id}/` - Detalhes
- **PUT/PATCH** `/competencies/{id}/` - Atualiza
- **DELETE** `/competencies/{id}/` - Remove

**Filtros:** 
- `?subject=Matemática` - Filtra por disciplina
- `?grade=5` - Filtra por série
- `?search=codigo` - Busca por código ou nome

### Catálogo de Descritores
- **GET** `/distractors/` - Lista todos os descritores
- **POST** `/distractors/` - Cria novo descritor
- **GET** `/distractors/{id}/` - Detalhes
- **PUT/PATCH** `/distractors/{id}/` - Atualiza
- **DELETE** `/distractors/{id}/` - Remove

**Filtros:** 
- `?subject=Português` - Filtra por disciplina
- `?grade=5` - Filtra por série
- `?learning_field=Leitura` - Filtra por campo
- `?search=texto` - Busca em nome e descrição

---

## 📝 Exames e Questões

### Exames
- **GET** `/exams/` - Lista todos os exames
- **POST** `/exams/` - Cria novo exame
- **GET** `/exams/{id}/` - Detalhes
- **GET** `/exams/{id}/questions/` - Lista questões do exame
- **PUT/PATCH** `/exams/{id}/` - Atualiza
- **DELETE** `/exams/{id}/` - Remove

**Filtros:** 
- `?subject=Matemática` - Filtra por disciplina
- `?school_year=2024` - Filtra por ano letivo
- `?search=codigo` - Busca por código ou nome

### Questões
- **GET** `/questions/` - Lista todas as questões
- **POST** `/questions/` - Cria nova questão
- **GET** `/questions/{id}/` - Detalhes (inclui alternativas)
- **PUT/PATCH** `/questions/{id}/` - Atualiza
- **DELETE** `/questions/{id}/` - Remove

**Filtros:** 
- `?id_exam=1` - Filtra por exame
- `?difficulty_level=medium` - Filtra por dificuldade
- `?id_distractor=5` - Filtra por descritor

### Alternativas
- **GET** `/alternatives/` - Lista todas as alternativas
- **POST** `/alternatives/` - Cria nova alternativa
- **GET** `/alternatives/{id}/` - Detalhes
- **PUT/PATCH** `/alternatives/{id}/` - Atualiza
- **DELETE** `/alternatives/{id}/` - Remove

**Filtros:** 
- `?id_question=10` - Filtra por questão
- `?is_correct=true` - Filtra corretas/incorretas

### Questão-Competência (Relação)
- **GET** `/question-competencies/` - Lista relações
- **POST** `/question-competencies/` - Cria relação
- **GET** `/question-competencies/{id}/` - Detalhes
- **DELETE** `/question-competencies/{id}/` - Remove

**Filtros:** 
- `?id_question=10` - Filtra por questão
- `?id_competency=5` - Filtra por competência

---

## 📋 Aplicações e Resultados

### Aplicações de Exames
- **GET** `/exam-applications/` - Lista aplicações
- **POST** `/exam-applications/` - Cria aplicação
- **GET** `/exam-applications/{id}/` - Detalhes
- **GET** `/exam-applications/{id}/results/` - Resultados da aplicação
- **PUT/PATCH** `/exam-applications/{id}/` - Atualiza
- **DELETE** `/exam-applications/{id}/` - Remove

**Filtros:** 
- `?id_exam=1` - Filtra por exame
- `?id_class=2` - Filtra por turma
- `?id_teacher=3` - Filtra por professor
- `?status=completed` - Filtra por status
- `?application_type=diagnostic` - Filtra por tipo
- `?fiscal_year=2024` - Filtra por ano

### Metadados de Avaliação
- **GET** `/assessment-metadata/` - Lista metadados
- **POST** `/assessment-metadata/` - Cria metadado
- **GET** `/assessment-metadata/{id}/` - Detalhes
- **PUT/PATCH** `/assessment-metadata/{id}/` - Atualiza
- **DELETE** `/assessment-metadata/{id}/` - Remove

**Filtros:** 
- `?application_type=formative` - Filtra por tipo
- `?assessment_period=Q1` - Filtra por período
- `?fiscal_year=2024` - Filtra por ano

### Respostas dos Alunos
- **GET** `/student-answers/` - Lista respostas
- **POST** `/student-answers/` - Cria resposta
- **GET** `/student-answers/{id}/` - Detalhes
- **PUT/PATCH** `/student-answers/{id}/` - Atualiza
- **DELETE** `/student-answers/{id}/` - Remove

**Filtros:** 
- `?id_student=5` - Filtra por aluno
- `?id_exam_application=10` - Filtra por aplicação
- `?id_question=20` - Filtra por questão
- `?is_correct=true` - Filtra corretas/incorretas

### Resultados dos Exames
- **GET** `/exam-results/` - Lista resultados
- **POST** `/exam-results/` - Cria resultado
- **GET** `/exam-results/{id}/` - Detalhes
- **PUT/PATCH** `/exam-results/{id}/` - Atualiza
- **DELETE** `/exam-results/{id}/` - Remove

**Filtros:** 
- `?id_student=5` - Filtra por aluno
- `?id_exam_application=10` - Filtra por aplicação
- `?ordering=-total_score` - Ordena por nota (desc)

---

## 🏆 Progresso e Conquistas

### Conquistas de Descritores
- **GET** `/student-achievements/` - Lista conquistas
- **POST** `/student-achievements/` - Cria conquista
- **GET** `/student-achievements/{id}/` - Detalhes
- **DELETE** `/student-achievements/{id}/` - Remove

**Filtros:** 
- `?id_student=5` - Filtra por aluno
- `?id_distractor=10` - Filtra por descritor
- `?id_exam_application=15` - Filtra por aplicação

### Progresso de Aprendizagem
- **GET** `/learning-progress/` - Lista progresso
- **GET** `/learning-progress/by_student/?student_id=5` - Progresso de um aluno
- **GET** `/learning-progress/low_performance/?threshold=50` - Baixo desempenho
- **POST** `/learning-progress/` - Cria registro
- **GET** `/learning-progress/{id}/` - Detalhes
- **PUT/PATCH** `/learning-progress/{id}/` - Atualiza
- **DELETE** `/learning-progress/{id}/` - Remove

**Filtros:** 
- `?id_student=5` - Filtra por aluno
- `?id_competency=10` - Filtra por competência
- `?id_exam_application=15` - Filtra por aplicação
- `?ordering=-competency_mastery` - Ordena por domínio

---

## 📊 Exemplos de Uso

### Buscar alunos de uma turma específica
```bash
GET /api/students/?id_class=5
```

### Buscar questões de um exame com suas alternativas
```bash
GET /api/exams/10/questions/
```

### Buscar resultados de uma aplicação
```bash
GET /api/exam-applications/20/results/
```

### Buscar progresso de um aluno
```bash
GET /api/learning-progress/by_student/?student_id=15
```

### Buscar alunos com baixo desempenho
```bash
GET /api/learning-progress/low_performance/?threshold=40
```

### Buscar descritores por disciplina e série
```bash
GET /api/distractors/?subject=Matemática&grade=5
```

### Buscar turmas de uma escola em um ano específico
```bash
GET /api/classes/?id_school=3&school_year=2024
```

---

## 🔒 Autenticação

Atualmente configurado como `AllowAny` (sem autenticação).

Para produção, configure:
```python
# config/settings.py
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

---

## 📝 Notas

- Todos os endpoints suportam paginação (padrão: 1000 itens)
- Use `?page=2` para navegar entre páginas
- Respostas em formato JSON
- CORS habilitado para desenvolvimento
- Endpoints com relações retornam dados completos (ex: `student_name`, `class_name`)