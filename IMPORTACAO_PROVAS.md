# 📤 Importação de Provas - Guia Completo

Este guia explica como usar o sistema de importação de provas via CSV/Excel para gerenciar provas físicas aplicadas em papel.

## 📋 Visão Geral do Fluxo

```
1. Professor aplica prova física em papel na turma
2. Professor importa o gabarito oficial via CSV
3. Sistema cria automaticamente: prova + questões + alternativas + descritores
4. Professor importa as respostas dos alunos via CSV
5. Sistema calcula resultados e atribui descritores automaticamente
```

## 🎯 Funcionalidades

### ✅ O que o sistema faz automaticamente:

- ✓ Cria a prova no sistema
- ✓ Cria todas as questões com numeração
- ✓ Cria alternativas genéricas (A, B, C, D, E)
- ✓ Marca a alternativa correta
- ✓ Vincula descritores BNCC às questões
- ✓ Cria aplicação da prova para a turma
- ✓ Compara respostas dos alunos com gabarito
- ✓ Calcula pontuação total
- ✓ Atribui descritores conquistados automaticamente
- ✓ Gera relatórios de desempenho

---

## 📝 Parte 1: Importação do Gabarito

### Formato do CSV - Gabarito

**Colunas obrigatórias:**

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| `codigo_prova` | Código único da prova | `PROVA2024_MAT_5` |
| `nome_prova` | Nome descritivo | `Avaliação Diagnóstica Matemática` |
| `disciplina` | Disciplina | `Matemática`, `Português`, etc. |
| `ano_escolar` | Ano escolar | `1`, `2`, `3`, ..., `9` |
| `numero_questao` | Número da questão | `1`, `2`, `3`, ... |
| `resposta_correta` | Letra da resposta | `A`, `B`, `C`, `D`, `E` |
| `codigo_descritor` | Código do descritor | `D01`, `D02`, etc. |
| `pontos` | Pontos da questão | `1.0`, `1.5`, `2.0` |
| `dificuldade` | Nível de dificuldade | `easy`, `medium`, `hard` |

**Colunas opcionais:**

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| `enunciado` | Texto da questão | `Qual é o resultado de 5 + 3?` |

### Exemplo de CSV - Gabarito

```csv
codigo_prova,nome_prova,disciplina,ano_escolar,numero_questao,resposta_correta,codigo_descritor,pontos,dificuldade,enunciado
PROVA2024_MAT_5,Avaliação Diagnóstica Matemática,Matemática,5,1,A,D01,1.0,easy,Qual é o resultado de 5 + 3?
PROVA2024_MAT_5,Avaliação Diagnóstica Matemática,Matemática,5,2,C,D02,1.5,medium,Resolva a equação 2x = 10
PROVA2024_MAT_5,Avaliação Diagnóstica Matemática,Matemática,5,3,B,D01,1.0,hard,Calcule a área de um quadrado de lado 4cm
PROVA2024_MAT_5,Avaliação Diagnóstica Matemática,Matemática,5,4,D,D03,1.0,easy,Quanto é 12 ÷ 3?
PROVA2024_MAT_5,Avaliação Diagnóstica Matemática,Matemática,5,5,E,D02,2.0,medium,Qual é o próximo número da sequência: 2, 4, 6, 8, __?
```

### ⚠️ Validações do Sistema - Gabarito

O sistema valida automaticamente:

- ✓ Código da prova não pode estar vazio
- ✓ Nome da prova não pode estar vazio
- ✓ Número da questão deve ser um inteiro positivo
- ✓ Resposta correta deve ser A, B, C, D ou E
- ✓ Pontos devem ser um número decimal positivo
- ✓ Dificuldade deve ser `easy`, `medium` ou `hard`
- ✓ Código do descritor deve existir no catálogo BNCC

**Se um descritor não for encontrado:**
- ⚠️ Sistema cria a questão normalmente
- ⚠️ Descritor não será vinculado
- ⚠️ Aviso será exibido com lista de descritores não encontrados

---

## 👥 Parte 2: Importação das Respostas dos Alunos

### Formato do CSV - Respostas

**Colunas fixas:**

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| `codigo_prova` | Mesmo código do gabarito | `PROVA2024_MAT_5` |
| `id_turma` | ID da turma no sistema | `1`, `2`, `3`, ... |
| `matricula_aluno` | Matrícula do aluno | `12345` |

**Colunas de respostas (dinâmicas):**

| Coluna | Descrição | Valores Aceitos |
|--------|-----------|-----------------|
| `q1` | Resposta questão 1 | `A`, `B`, `C`, `D`, `E` ou vazio |
| `q2` | Resposta questão 2 | `A`, `B`, `C`, `D`, `E` ou vazio |
| `q3` | Resposta questão 3 | `A`, `B`, `C`, `D`, `E` ou vazio |
| `...` | ... | ... |
| `qN` | Resposta questão N | `A`, `B`, `C`, `D`, `E` ou vazio |

**⚠️ Importante:**
- Se deixar vazio, conta como questão em branco
- Número de colunas `qN` deve corresponder ao número de questões da prova

### Exemplo de CSV - Respostas

```csv
codigo_prova,id_turma,matricula_aluno,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10
PROVA2024_MAT_5,1,12345,A,C,B,D,A,E,C,B,A,D
PROVA2024_MAT_5,1,67890,B,C,A,D,C,A,B,D,E,A
PROVA2024_MAT_5,1,11111,A,C,B,D,E,C,B,A,D,C
PROVA2024_MAT_5,1,22222,A,B,B,D,A,E,C,B,A,D
PROVA2024_MAT_5,1,33333,A,C,,D,A,E,,B,A,D
```

**No exemplo acima:**
- Aluno `12345`: respondeu todas as 10 questões
- Aluno `33333`: deixou questões 3 e 7 em branco

### ⚠️ Validações do Sistema - Respostas

O sistema valida automaticamente:

- ✓ Código da prova deve existir no sistema (importado previamente)
- ✓ ID da turma deve existir
- ✓ Matrícula do aluno deve existir E estar vinculada à turma informada
- ✓ Respostas devem ser A, B, C, D, E ou vazias
- ✓ Aluno não pode ter respostas duplicadas para a mesma prova

**Se o aluno já fez a prova:**
- ❌ Sistema não permite duplicar respostas
- ❌ Retorna erro específico para o aluno

---

## 🚀 Como Usar - Passo a Passo

### Passo 1: Acessar a Página de Importação

1. Faça login no sistema
2. Clique em **"Importar Provas"** no menu principal
3. Você verá 3 abas:
   - **Upload Gabarito**
   - **Upload Respostas**
   - **Provas Importadas**

### Passo 2: Importar Gabarito

1. Acesse a aba **"Upload Gabarito"**
2. Clique em **"Baixar Template CSV"** para ter um exemplo
3. Preencha seu CSV com os dados da prova
4. Clique em **"Escolher arquivo"** e selecione seu CSV
5. Visualize o preview dos dados
6. Clique em **"Importar Gabarito"**
7. Aguarde o processamento
8. ✅ Sucesso! A prova foi criada

**Resultado esperado:**
```
✓ Importação concluída!
1 prova(s) importada(s)

Prova: Avaliação Diagnóstica Matemática
Código: PROVA2024_MAT_5
Questões: 10
```

### Passo 3: Verificar Prova Importada

1. Acesse a aba **"Provas Importadas"**
2. Verifique se sua prova aparece na lista
3. Confira: código, nome, disciplina, ano e número de questões

### Passo 4: Importar Respostas dos Alunos

1. Acesse a aba **"Upload Respostas"**
2. Clique em **"Baixar Template CSV"** para ter um exemplo
3. Preencha seu CSV com as respostas dos alunos
4. **Importante**: Use o mesmo `codigo_prova` do gabarito
5. Clique em **"Escolher arquivo"** e selecione seu CSV
6. Visualize o preview dos dados
7. Clique em **"Processar Respostas"**
8. Aguarde o processamento
9. ✅ Sucesso! Respostas processadas

**Resultado esperado:**
```
✓ Processamento concluído!
Respostas de 25 aluno(s) importadas com sucesso

Aplicações criadas:
- Avaliação Diagnóstica Matemática | Turma: 5º Ano A
```

### Passo 5: Verificar Resultados

1. Vá para **"Respostas dos Alunos"** no menu
2. Selecione a aplicação da prova
3. Visualize:
   - Notas de cada aluno
   - Questões corretas/erradas
   - Descritores conquistados
   - Estatísticas da turma

---

## 📊 O que Acontece nos Bastidores

### Ao importar o gabarito:

1. Sistema valida todas as linhas do CSV
2. Cria ou atualiza a prova (pelo `codigo_prova`)
3. Para cada questão:
   - Cria registro em `TbQuestions`
   - Cria 5 alternativas (A, B, C, D, E)
   - Marca a alternativa correta
   - Vincula o descritor BNCC (se encontrado)

### Ao importar respostas:

1. Sistema valida todas as linhas do CSV
2. Busca ou cria a aplicação da prova para a turma
3. Para cada aluno:
   - Busca questões da prova
   - Compara respostas com gabarito
   - Cria registros em `TbStudentAnswers`
   - Calcula pontuação total
   - Cria resultado em `TbExamResults`
   - **Atribui descritores automaticamente** em `TbStudentDescriptorAchievements`
     - Apenas questões corretas ganham descritor
     - Evita duplicação de descritores

---

## ❓ Perguntas Frequentes (FAQ)

### 1. Posso importar várias provas de uma vez?

**Sim!** No mesmo CSV de gabarito, basta usar códigos de prova diferentes.

```csv
codigo_prova,nome_prova,disciplina,ano_escolar,numero_questao,resposta_correta,codigo_descritor,pontos,dificuldade
PROVA2024_MAT_5,Matemática 5º Ano,Matemática,5,1,A,D01,1.0,easy
PROVA2024_MAT_5,Matemática 5º Ano,Matemática,5,2,C,D02,1.5,medium
PROVA2024_PORT_5,Português 5º Ano,Português,5,1,B,D10,1.0,easy
PROVA2024_PORT_5,Português 5º Ano,Português,5,2,D,D11,1.0,medium
```

### 2. E se eu errar uma resposta do gabarito?

**Solução:** Reimporte o gabarito com o mesmo `codigo_prova`. O sistema vai:
- Atualizar as informações da prova
- **Deletar questões antigas**
- Criar as novas questões corretas

⚠️ **Cuidado:** Se já houver respostas de alunos, elas serão perdidas!

### 3. O que fazer se um descritor não existir?

**Opção 1:** Cadastre o descritor antes no sistema:
- Vá em **"Descritores"** > **"Catálogo BNCC"**
- Adicione o descritor com o código correto

**Opção 2:** Importe assim mesmo:
- Sistema criará a questão normalmente
- Apenas não vinculará o descritor
- Você pode vincular manualmente depois

### 4. Posso usar Excel em vez de CSV?

**Sim!** O sistema aceita:
- `.csv` (UTF-8)
- `.xlsx` (Excel moderno)
- `.xls` (Excel antigo)

### 5. Como garantir que os alunos estão cadastrados?

**Antes de importar respostas:**
1. Vá em **"Administração"** > **"Alunos"**
2. Verifique se todos os alunos estão cadastrados
3. Confira se as matrículas estão corretas
4. Verifique se estão vinculados à turma correta

**Ou use a importação em lote:**
1. Vá em **"Administração"** > **"Importar Alunos"**
2. Importe CSV com lista de alunos

### 6. E se o aluno deixar questões em branco?

**Apenas deixe a coluna vazia:**

```csv
codigo_prova,id_turma,matricula_aluno,q1,q2,q3,q4,q5
PROVA2024_MAT_5,1,12345,A,,B,,E
```

Neste caso:
- Questões 1, 3, 5: respondidas
- Questões 2, 4: em branco (conta como erro)

### 7. Posso importar respostas de turmas diferentes?

**Sim!** No mesmo CSV, use IDs de turmas diferentes:

```csv
codigo_prova,id_turma,matricula_aluno,q1,q2,q3
PROVA2024_MAT_5,1,12345,A,C,B
PROVA2024_MAT_5,1,67890,B,C,A
PROVA2024_MAT_5,2,11111,A,B,C
PROVA2024_MAT_5,2,22222,C,D,E
```

Sistema criará aplicações separadas para cada turma.

---

## 🔧 Solução de Problemas

### Erro: "Prova não encontrada"

**Causa:** CSV de respostas usa código de prova que não foi importado ainda.

**Solução:**
1. Vá na aba **"Provas Importadas"**
2. Verifique se a prova existe
3. Se não existir, importe o gabarito primeiro

### Erro: "Aluno não encontrado na turma"

**Causa:** Matrícula não existe ou aluno está em outra turma.

**Solução:**
1. Vá em **"Administração"** > **"Alunos"**
2. Busque pela matrícula
3. Verifique se está na turma correta
4. Se necessário, corrija a turma ou a matrícula

### Erro: "Descritor D99 não encontrado"

**Causa:** Código do descritor não existe no catálogo BNCC.

**Solução 1 (Ignorar):**
- Questão será criada sem descritor
- Pode vincular manualmente depois

**Solução 2 (Cadastrar):**
1. Vá em **"Descritores"**
2. Adicione o descritor `D99`
3. Reimporte o gabarito

### Erro: "Biblioteca openpyxl não instalada"

**Causa:** Sistema não tem suporte a Excel.

**Solução:**
- Use formato CSV em vez de Excel
- Ou peça ao administrador para instalar `openpyxl`

---

## 📚 Endpoints da API (Para Desenvolvedores)

### Importar Gabarito

```http
POST /api/exams/import_answer_key/
Content-Type: multipart/form-data

file: [arquivo CSV/Excel]
```

**Response (sucesso):**
```json
{
  "success": true,
  "message": "1 prova(s) importada(s)",
  "exams": [
    {
      "codigo": "PROVA2024_MAT_5",
      "nome": "Avaliação Diagnóstica Matemática",
      "questoes": 10,
      "criada": true
    }
  ],
  "errors": null
}
```

### Importar Respostas

```http
POST /api/exam-applications/import_student_answers/
Content-Type: multipart/form-data

file: [arquivo CSV/Excel]
```

**Response (sucesso):**
```json
{
  "success": true,
  "message": "Respostas de 25 aluno(s) importadas com sucesso",
  "processed_students": 25,
  "created_applications": [
    {
      "exam": "Avaliação Diagnóstica Matemática",
      "class": "5º Ano A"
    }
  ],
  "errors": null
}
```

---

## 📝 Boas Práticas

### ✅ Faça:

- ✓ Teste com um arquivo pequeno primeiro (3-5 alunos)
- ✓ Use códigos de prova únicos e descritivos
- ✓ Mantenha backup dos CSVs originais
- ✓ Valide os dados antes de importar
- ✓ Importe gabarito ANTES das respostas

### ❌ Evite:

- ✗ Importar gabarito após já ter respostas de alunos
- ✗ Usar acentos ou caracteres especiais nos códigos de prova
- ✗ Duplicar códigos de prova para provas diferentes
- ✗ Importar respostas sem cadastrar alunos antes
- ✗ Misturar respostas de provas diferentes no mesmo CSV

---

## 🎓 Exemplo Completo - Passo a Passo

### Cenário: Avaliação Diagnóstica de Matemática

**1. Criar arquivo `gabarito_matematica_5ano.csv`:**

```csv
codigo_prova,nome_prova,disciplina,ano_escolar,numero_questao,resposta_correta,codigo_descritor,pontos,dificuldade,enunciado
MAT_DIAG_2024,Avaliação Diagnóstica Matemática,Matemática,5,1,A,D01,1.0,easy,Quanto é 5 + 3?
MAT_DIAG_2024,Avaliação Diagnóstica Matemática,Matemática,5,2,C,D02,1.0,medium,Resolva: 2x = 10
MAT_DIAG_2024,Avaliação Diagnóstica Matemática,Matemática,5,3,B,D01,1.5,medium,Área de quadrado lado 4cm
MAT_DIAG_2024,Avaliação Diagnóstica Matemática,Matemática,5,4,D,D03,1.0,easy,Quanto é 12 ÷ 3?
MAT_DIAG_2024,Avaliação Diagnóstica Matemática,Matemática,5,5,E,D02,2.0,hard,Sequência: 2,4,6,8,__?
```

**2. Importar gabarito:**
- Acessar **"Importar Provas"** > **"Upload Gabarito"**
- Fazer upload do arquivo
- Conferir resultado: 5 questões criadas ✓

**3. Criar arquivo `respostas_5ano_a.csv`:**

```csv
codigo_prova,id_turma,matricula_aluno,q1,q2,q3,q4,q5
MAT_DIAG_2024,1,10001,A,C,B,D,E
MAT_DIAG_2024,1,10002,A,B,B,D,E
MAT_DIAG_2024,1,10003,B,C,A,D,E
MAT_DIAG_2024,1,10004,A,C,B,D,A
MAT_DIAG_2024,1,10005,A,C,B,D,E
```

**4. Importar respostas:**
- Acessar **"Importar Provas"** > **"Upload Respostas"**
- Fazer upload do arquivo
- Conferir resultado: 5 alunos processados ✓

**5. Ver resultados:**
- Acessar **"Respostas dos Alunos"**
- Selecionar aplicação
- Visualizar:
  - Aluno 10001: 10/10 (100%) - 5 acertos
  - Aluno 10002: 8,5/10 (85%) - 4 acertos
  - Aluno 10003: 5,5/10 (55%) - 3 acertos
  - Aluno 10004: 8,5/10 (85%) - 4 acertos
  - Aluno 10005: 10/10 (100%) - 5 acertos

---

## 📞 Suporte

**Problemas ou dúvidas?**
- Entre em contato com o administrador do sistema
- Consulte os logs de erro para mais detalhes
- Verifique a documentação técnica da API

---

**Última atualização:** Dezembro 2024
**Versão:** 1.0
