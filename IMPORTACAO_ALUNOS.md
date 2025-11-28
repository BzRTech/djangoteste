# Importação de Alunos em Lote

## Descrição
Esta funcionalidade permite importar múltiplos alunos de uma vez usando arquivos CSV ou Excel (XLSX/XLS).

## Melhorias Implementadas

### ✅ Suporte para Nomes de Colunas em Português
Agora você pode usar nomes de colunas em **português** ou **inglês**. O sistema aceita ambos os formatos!

**Mapeamento de colunas:**
- `Nome do Aluno` / `Nome` / `Aluno` → `student_name`
- `Matrícula` → `student_serial`
- `Turma` / `Classe` → `id_class`
- `Data de Matrícula` / `Data` → `enrollment_date`
- `Status` / `Situação` → `status`

### ✅ Busca de Turma por Nome
Agora você pode usar o **nome da turma** em vez do ID numérico!

**Exemplos aceitos:**
- `5º Ano A` - busca exata pelo nome da turma
- `5º ano` - busca turmas que contenham "5º ano"
- `1` - busca pelo ID da turma (formato antigo ainda funciona)

O sistema tenta encontrar a turma de várias formas:
1. Busca por ID numérico (se for um número)
2. Busca exata pelo nome (case-insensitive)
3. Busca parcial pelo nome
4. Extrai o ano e busca turmas correspondentes

## Formato do Arquivo

### Exemplo com Nomes em Português (Recomendado)
```csv
Nome do Aluno,Matrícula,Turma,Data de Matrícula,Status
João Pedro Silva,2001,5º Ano A,2024-01-15,enrolled
Maria Eduarda Santos,2002,5º Ano A,2024-01-15,enrolled
Pedro Henrique Oliveira,2003,5º Ano B,2024-01-15,enrolled
```

### Exemplo com Nomes em Inglês (Compatível)
```csv
student_name,student_serial,id_class,enrollment_date,status
João Pedro Silva,2001,1,2024-01-15,enrolled
Maria Eduarda Santos,2002,1,2024-01-15,enrolled
```

## Campos

| Campo | Obrigatório | Formato | Descrição |
|-------|-------------|---------|-----------|
| **Nome do Aluno** | ✅ Sim | Texto | Nome completo do aluno |
| **Matrícula** | ✅ Sim | Número | Número único de matrícula |
| **Turma** | ✅ Sim | Texto ou Número | Nome da turma (ex: "5º Ano A") ou ID |
| **Data de Matrícula** | ❌ Não | YYYY-MM-DD | Data de matrícula (padrão: data atual) |
| **Status** | ❌ Não | Texto | Status do aluno (padrão: "enrolled") |

## Como Usar

1. **Acesse a Interface**
   - Vá para a página de Administração
   - Clique na aba "Importar"

2. **Baixe o Modelo**
   - Clique em "Baixar Modelo CSV"
   - O arquivo virá com exemplos de preenchimento

3. **Preencha os Dados**
   - Abra o arquivo no Excel, Google Sheets ou editor de texto
   - Preencha os dados dos alunos
   - **Use nomes de turmas reais** (ex: "5º Ano A", "6º Ano B")
   - Certifique-se de que as matrículas são únicas

4. **Faça o Upload**
   - Arraste o arquivo para a área de upload ou clique para selecionar
   - Clique em "Importar Alunos"

5. **Verifique o Resultado**
   - O sistema mostrará quantos alunos foram criados/atualizados
   - Se houver erros, eles serão listados por linha

## Exemplo de Arquivo de Teste

Um arquivo de exemplo está disponível em: `exemplo_importacao_alunos.csv`

## Validações

O sistema valida:
- ✅ Nome do aluno não pode estar vazio
- ✅ Matrícula deve ser um número único
- ✅ Turma deve existir no sistema
- ✅ Data de matrícula deve estar no formato YYYY-MM-DD
- ✅ Se a matrícula já existir, os dados do aluno serão **atualizados**

## Tratamento de Erros

Se houver erros durante a importação:
- Os erros são listados por linha
- A transação é atômica: se houver erros críticos, nenhum aluno é importado
- Linhas com erro são ignoradas, mas as demais são processadas

## Exemplo de Resposta

### Sucesso
```json
{
  "success": true,
  "message": "5 alunos criados, 2 alunos atualizados",
  "created": 5,
  "updated": 2,
  "errors": null
}
```

### Com Erros
```json
{
  "success": true,
  "message": "3 alunos criados, 0 alunos atualizados",
  "created": 3,
  "updated": 0,
  "errors": [
    "Linha 2: Matrícula é obrigatória",
    "Linha 5: Turma '7º Ano Z' não encontrada"
  ]
}
```

## Dicas

💡 **Use nomes em português** para facilitar o preenchimento pelos usuários finais

💡 **Baixe o modelo CSV** sempre que for importar para garantir o formato correto

💡 **Teste com poucos registros primeiro** para verificar se as turmas estão sendo encontradas corretamente

💡 **Matrículas duplicadas** farão com que os dados do aluno sejam atualizados, não criará um novo registro

## Resolução de Problemas

### "Turma não encontrada"
- Verifique se a turma existe no sistema
- Tente usar o nome exato da turma como está cadastrado
- Use o ID da turma como alternativa

### "Matrícula deve ser um número"
- Certifique-se de que a coluna de matrícula contém apenas números
- Remova espaços ou caracteres especiais

### "Data de matrícula inválida"
- Use o formato YYYY-MM-DD (ex: 2024-01-15)
- Ou deixe em branco para usar a data atual

## Arquivos Modificados

- `backend/api/views.py` - Endpoint de importação atualizado
- `frontend/src/pages/AdminCRUD.jsx` - Template CSV em português
- `exemplo_importacao_alunos.csv` - Arquivo de exemplo
