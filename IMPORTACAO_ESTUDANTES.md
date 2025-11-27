# 📊 Importação em Lote de Estudantes

## Visão Geral

Este sistema permite importar múltiplos estudantes de uma só vez através do upload de uma planilha Excel ou CSV no Django Admin.

## Como Usar

### 1. Acesse o Admin do Django

Faça login no admin Django e navegue até a seção de **Alunos** (TbStudents).

### 2. Clique em "Importar em Lote"

Na listagem de alunos, você verá um botão verde **"📊 Importar em Lote"** no canto superior direito.

### 3. Baixe o Modelo

Clique no botão **"⬇️ Baixar Modelo"** para obter uma planilha de exemplo com:
- Formato correto das colunas
- Exemplos de dados
- Instruções detalhadas

### 4. Preencha a Planilha

A planilha modelo contém as seguintes colunas:

#### Colunas Obrigatórias:
- **student_serial**: Número de matrícula único (número inteiro)
- **student_name**: Nome completo do estudante
- **class_name**: Nome exato da turma (deve existir no sistema)

#### Colunas Opcionais:
- **enrollment_date**: Data de matrícula no formato `AAAA-MM-DD` (ex: 2025-01-15)
- **status**: Status do estudante (padrão: `enrolled`)

### 5. Exemplo de Dados

```
student_serial | student_name      | class_name        | enrollment_date | status
12345          | João da Silva     | Turma A - 5º Ano  | 2025-01-15     | enrolled
12346          | Maria Santos      | Turma B - 6º Ano  | 2025-01-15     | enrolled
12347          | Pedro Oliveira    | Turma A - 5º Ano  | 2025-01-16     | enrolled
```

### 6. Faça o Upload

1. Clique em **"Escolher Arquivo"**
2. Selecione sua planilha preenchida (.xlsx, .xls ou .csv)
3. Clique em **"✅ Importar Estudantes"**

### 7. Verifique os Resultados

O sistema mostrará:
- ✅ Quantos estudantes foram importados com sucesso
- ❌ Lista de erros encontrados (se houver)

## ⚠️ Observações Importantes

### Validações

1. **Student Serial Único**:
   - Se o número de matrícula já existir, o estudante será **atualizado** com os novos dados
   - Caso contrário, um novo estudante será criado

2. **Turma Deve Existir**:
   - O nome da turma deve corresponder **exatamente** a uma turma existente no sistema
   - Caso contrário, a linha será ignorada com erro

3. **Formato de Data**:
   - Use apenas o formato `AAAA-MM-DD` para enrollment_date
   - Exemplos válidos: `2025-01-15`, `2024-12-20`

### Formatos Aceitos

- ✅ `.xlsx` (Excel)
- ✅ `.xls` (Excel antigo)
- ✅ `.csv` (valores separados por vírgula)

### Tratamento de Erros

- Se houver erros em algumas linhas, as linhas válidas serão importadas
- Os erros serão listados com o número da linha para fácil correção
- Máximo de 10 erros são exibidos por vez

## Estrutura Técnica

### Arquivos Criados

```
backend/students/
├── admin.py                                      # Admin customizado
└── templates/
    └── admin/
        └── students/
            ├── import_students.html              # Página de upload
            └── tbstudents/
                └── change_list.html              # Lista com botão de importação
```

### Dependências Instaladas

- `openpyxl==3.1.5` - Para ler/escrever arquivos Excel
- `pandas==2.3.3` - Para processamento de dados

### URLs Customizadas

- `/admin/students/tbstudents/importar-estudantes/` - Página de importação
- `/admin/students/tbstudents/download-modelo/` - Download da planilha modelo

## Fluxo de Processamento

1. **Upload**: Arquivo enviado pelo usuário
2. **Validação**: Verifica formato e colunas obrigatórias
3. **Processamento Linha a Linha**:
   - Busca turma pelo nome
   - Valida dados do estudante
   - Verifica se student_serial existe
   - Cria ou atualiza registro
4. **Resultado**: Mostra resumo de sucessos e erros

## Segurança

- ✅ Proteção CSRF habilitada
- ✅ Validação de tipo de arquivo
- ✅ Validação de dados antes da inserção
- ✅ Tratamento de exceções
- ✅ Apenas usuários autenticados no admin podem acessar

## Próximos Passos

Quando você enviar a planilha de exemplo, posso ajustar o formato da importação para corresponder exatamente aos seus dados!

---

**Desenvolvido para Django Admin**
