# Fix: Sincronização de Descritores com Banco de Dados

## Problema
O campo `id_exam_application` na tabela `tb_student_descriptor_achievements` não permitia valores NULL, causando erro 500 ao tentar atribuir/desatribuir descritores manualmente aos alunos.

## Solução
Permitir que o campo `id_exam_application` aceite NULL para suportar atribuições manuais de descritores (sem estar vinculado a uma aplicação de prova específica).

## Como aplicar a migração

### Opção 1: Usando psql (PostgreSQL)
```bash
psql -U <seu_usuario> -d <nome_do_banco> -f fix_descriptor_achievements.sql
```

### Opção 2: Usando linha de comando do PostgreSQL
```bash
psql -U <seu_usuario> -d <nome_do_banco>
```

Depois execute dentro do psql:
```sql
ALTER TABLE tb_student_descriptor_achievements
ALTER COLUMN id_exam_application DROP NOT NULL;
```

### Opção 3: Usando um cliente GUI (PgAdmin, DBeaver, etc.)
Conecte-se ao banco de dados e execute o conteúdo do arquivo `fix_descriptor_achievements.sql`.

## Verificação
Após executar a migração, você pode verificar se funcionou com:
```sql
\d tb_student_descriptor_achievements
```

A coluna `id_exam_application` deve mostrar que permite NULL.

## Teste
1. Reinicie o servidor Django
2. Acesse o perfil de um aluno no frontend
3. Clique em um descritor para atribuir/desatribuir
4. A operação deve funcionar sem erros
