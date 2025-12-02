# 📚 Arquivos de Exemplo para Teste

Esta pasta contém arquivos de exemplo para testar o sistema de importação de provas.

## 📁 Arquivos Disponíveis

### 1. `gabarito_teste.csv`
Arquivo CSV com gabarito de uma prova de teste de Matemática 5º Ano.

**Contém:**
- 10 questões
- Código da prova: `PROVA_TESTE_2024`
- Disciplina: Matemática
- Respostas corretas já marcadas
- Descritores vinculados (D01, D02, D03)

### 2. `respostas_teste.csv`
Arquivo CSV com respostas de 10 alun[];

**Contém:**
- Matrícula dos alunos: 10001 a 10010
- Turma: 1 (ajuste conforme sua turma de teste)
- Respostas variadas (alguns com acertos, alguns com erros)
- Aluno 10009 deixou questões 5 e 10 em branco

### 3. `prova_exemplo.txt`
Arquivo de texto com a prova completa formatada.

**Uso:** Pode ser convertido para PDF ou usado como está para fazer upload como arquivo da prova.

---

## 🧪 Como Testar o Sistema Completo

### Pré-requisitos

1. **Execute a migration SQL:**
```bash
cd backend
psql -U seu_usuario -d seu_banco < migrations/add_exam_file_field.sql
```

2. **Cadastre os descritores de teste:**
Vá em **"Descritores"** e adicione:
- D01 - Operações básicas de adição
- D02 - Resolução de equações simples
- D03 - Unidades de medida

3. **Crie uma turma de teste:**
Vá em **"Administração"** > **"Turmas"** e crie:
- Nome: "5º Ano A - Teste"
- ID será gerado automaticamente (anote para usar no CSV)

4. **Cadastre alunos de teste:**
Vá em **"Administração"** > **"Alunos"** e adicione alunos com matrículas 10001 a 10010, ou use o import em lote:

```csv
student_name,student_serial,id_class,status
João Silva,10001,1,enrolled
Maria Santos,10002,1,enrolled
Pedro Costa,10003,1,enrolled
Ana Lima,10004,1,enrolled
Carlos Souza,10005,1,enrolled
Beatriz Alves,10006,1,enrolled
Lucas Oliveira,10007,1,enrolled
Fernanda Pereira,10008,1,enrolled
Rafael Mendes,10009,1,enrolled
Juliana Rocha,10010,1,enrolled
```

---

### Passo 1: Importar Gabarito

1. Acesse **"Importar Provas"**
2. Aba **"Upload Gabarito"**
3. Selecione `gabarito_teste.csv`
4. Clique **"Importar Gabarito"**
5. ✅ Aguarde confirmação: "1 prova(s) importada(s)"

**Resultado esperado:**
```
✓ Importação concluída!
Prova: Avaliação Diagnóstica - Teste
Código: PROVA_TESTE_2024
Questões: 10
```

---

### Passo 2: Upload do Arquivo da Prova (Opcional)

1. Vá na aba **"Provas Importadas"**
2. Encontre "Avaliação Diagnóstica - Teste"
3. Clique **"Fazer Upload"**
4. Selecione `prova_exemplo.txt` (ou converta para PDF primeiro)
5. ✅ Arquivo enviado!

**Você verá um link:** "Ver arquivo da prova"

---

### Passo 3: Importar Respostas dos Alunos

**IMPORTANTE:** Edite `respostas_teste.csv` antes!

Troque o `id_turma` pelo ID da sua turma de teste:
```csv
codigo_prova,id_turma,matricula_aluno,q1,q2,q3...
PROVA_TESTE_2024,1,10001,A,C,B,D,E...
                 ↑
              Seu ID aqui
```

1. Aba **"Upload Respostas"**
2. Selecione `respostas_teste.csv` editado
3. Clique **"Processar Respostas"**
4. ✅ Aguarde: "Respostas de 10 aluno(s) importadas"

**Resultado esperado:**
```
✓ Processamento concluído!
Respostas de 10 aluno(s) importadas
Aplicação criada: Avaliação Diagnóstica - Teste | Turma: 5º Ano A
```

---

### Passo 4: Ver Resultados

1. Vá em **"Respostas dos Alunos"**
2. Selecione a aplicação "Avaliação Diagnóstica - Teste"
3. Visualize:
   - ✅ Notas de cada aluno
   - ✅ Questões corretas/erradas
   - ✅ **Descritores conquistados automaticamente**
   - ✅ Estatísticas da turma

**Exemplo de resultados:**
- Aluno 10001: 13,5/13,5 (100%) - 10 acertos
- Aluno 10002: 12,0/13,5 (89%) - 9 acertos
- Aluno 10003: 10,5/13,5 (78%) - 8 acertos
- Aluno 10009: 11,5/13,5 (85%) - 8 acertos (2 em branco)

---

### Passo 5: Verificar Descritores Conquistados

1. Acesse **"Perfil do Aluno"** de qualquer aluno (ex: João Silva)
2. Na seção "Descritores Conquistados" você verá:
   - ✅ D01 - Conquistado (acertou questões 1, 3, 6, 9)
   - ✅ D02 - Conquistado (acertou questões 2, 5, 8)
   - ✅ D03 - Conquistado (acertou questões 4, 7, 10)

---

## 📊 Resultados Esperados

### Gabarito Oficial
```
Q1: A  (1.0 pts - easy - D01)
Q2: C  (1.5 pts - medium - D02)
Q3: B  (1.0 pts - hard - D01)
Q4: D  (1.0 pts - easy - D03)
Q5: E  (2.0 pts - medium - D02)
Q6: A  (1.0 pts - easy - D01)
Q7: C  (1.5 pts - medium - D03)
Q8: B  (1.0 pts - hard - D02)
Q9: D  (1.5 pts - medium - D01)
Q10: E (2.0 pts - hard - D03)

Total: 13,5 pontos
```

### Análise por Aluno

**Aluno 10001 (João Silva):**
- Gabarito: A C B D E A C B D E
- Respostas: A C B D E A C B D E
- Resultado: 10/10 acertos (100%)
- Descritores: D01, D02, D03 ✅

**Aluno 10004 (Ana Lima):**
- Gabarito: A C B D E A C B D E
- Respostas: A C B D A A C B C E
- Erros: Q5 (marcou A), Q9 (marcou C)
- Resultado: 8/10 acertos (89%)
- Descritores: D01 ✅, D02 ⚠️ (parcial), D03 ✅

**Aluno 10009 (Rafael Mendes):**
- Gabarito: A C B D E A C B D E
- Respostas: A C B D _ A C B D _
- Em branco: Q5, Q10
- Resultado: 8/10 acertos (78%)
- Descritores: D01 ✅, D02 ⚠️ (parcial), D03 ⚠️ (parcial)

---

## 🔧 Ajustes Necessários

### Arquivo: `respostas_teste.csv`

**Antes de importar, edite estas linhas:**

```csv
codigo_prova,id_turma,matricula_aluno,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10
PROVA_TESTE_2024,1,10001,A,C,B,D,E,A,C,B,D,E
                 ↑
    Troque pelo ID da sua turma de teste
```

**Como descobrir o ID da turma:**
1. Vá em "Administração" > "Turmas"
2. Veja o ID na listagem
3. Ou use a API: `GET /api/classes/`

---

## ⚠️ Troubleshooting

### Erro: "Descritor D01 não encontrado"
**Solução:** Cadastre os descritores antes de importar:
- Vá em "Descritores"
- Adicione D01, D02, D03 manualmente

### Erro: "Turma ID 1 não encontrada"
**Solução:**
- Crie uma turma de teste primeiro
- Atualize o `id_turma` no CSV

### Erro: "Aluno matrícula 10001 não encontrado"
**Solução:**
- Cadastre os alunos antes
- Ou use o import em lote de alunos

### Upload de arquivo não funciona
**Solução:**
- Execute a migration SQL primeiro
- Verifique configuração do `.env`
- Se usar S3, verifique credenciais

---

## 📝 Conversão de TXT para PDF

Para converter `prova_exemplo.txt` para PDF:

### No Linux/Mac:
```bash
enscript prova_exemplo.txt -o - | ps2pdf - prova_exemplo.pdf
```

### Online:
- https://www.text2pdf.com/
- https://www.convertfiles.com/

### No Windows:
- Abra no Notepad++
- File > Print > Microsoft Print to PDF

---

## 🎯 Checklist de Teste

- [ ] Migration SQL executada
- [ ] Descritores D01, D02, D03 cadastrados
- [ ] Turma de teste criada (anotar ID)
- [ ] Alunos 10001-10010 cadastrados
- [ ] `respostas_teste.csv` editado com ID correto
- [ ] Gabarito importado com sucesso
- [ ] Arquivo da prova uploaded (opcional)
- [ ] Respostas importadas com sucesso
- [ ] Resultados visíveis em "Respostas dos Alunos"
- [ ] Descritores atribuídos automaticamente
- [ ] Perfil do aluno mostra descritores conquistados

---

## 📞 Suporte

Se encontrar problemas durante o teste:
1. Verifique os logs do Django
2. Consulte `IMPORTACAO_PROVAS.md`
3. Consulte `UPLOAD_ARQUIVOS.md`

---

**Boa sorte com os testes! 🚀**
