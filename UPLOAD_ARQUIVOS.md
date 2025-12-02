# 📤 Upload de Arquivos de Provas - Guia Completo

Este guia explica como configurar e usar o sistema de upload de arquivos de provas para AWS S3 ou storage local.

## 📋 Visão Geral

O sistema permite fazer upload dos arquivos físicos das provas (PDF, imagens, Word) e armazenar no AWS S3 ou localmente.

**Formatos aceitos:**
- PDF (`.pdf`)
- Imagens (`.jpg`, `.jpeg`, `.png`)
- Word (`.doc`, `.docx`)

**Tamanho máximo:** 50MB por arquivo

---

## 🔧 Configuração

### Opção 1: Storage Local (Desenvolvimento)

Para usar armazenamento local (arquivos salvos no servidor):

**1. Configure o .env:**
```bash
USE_S3=False
```

**2. Pronto!** Os arquivos serão salvos em `/backend/media/exams/`

### Opção 2: AWS S3 (Produção)

Para usar AWS S3:

**1. Instale as dependências:**
```bash
cd backend
pip install boto3 django-storages
```

**2. Configure o .env:**
```bash
USE_S3=True
AWS_ACCESS_KEY_ID=sua_access_key_aqui
AWS_SECRET_ACCESS_KEY=sua_secret_key_aqui
AWS_STORAGE_BUCKET_NAME=nome-do-seu-bucket
AWS_S3_REGION_NAME=us-east-1
```

**3. Configure o bucket S3:**

No console AWS S3:
- Crie um bucket (ou use existente)
- Configure permissões públicas de leitura
- Habilite CORS se necessário:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

**4. Configure IAM Policy:**

Crie uma política IAM com as seguintes permissões:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::SEU-BUCKET/*"
        }
    ]
}
```

---

## 🚀 Como Usar

### Passo 1: Executar Migration SQL

Antes de usar, execute a migration para adicionar o campo no banco:

```bash
cd backend
psql -U seu_usuario -d seu_banco < migrations/add_exam_file_field.sql
```

Ou execute manualmente no PostgreSQL:

```sql
ALTER TABLE tb_exams ADD COLUMN exam_file VARCHAR(500) NULL;
```

### Passo 2: Importar Gabarito da Prova

1. Acesse **"Importar Provas"** no menu
2. Vá na aba **"Upload Gabarito"**
3. Faça upload do CSV com o gabarito
4. ✅ Prova criada!

### Passo 3: Fazer Upload do Arquivo da Prova

1. Vá na aba **"Provas Importadas"**
2. Encontre a prova que você acabou de importar
3. Clique em **"Fazer Upload"** na seção "Arquivo da prova"
4. Selecione o PDF/imagem da prova
5. Aguarde o upload
6. ✅ Arquivo enviado!

### Passo 4: Visualizar Arquivo

Após o upload, você verá um link **"Ver arquivo da prova"** que abre o arquivo em uma nova aba.

---

## 📊 Estrutura de Arquivos

### Storage Local

```
backend/
  media/
    exams/
      PROVA2024_MAT_5/
        uuid-random.pdf
        uuid-random2.jpg
```

### AWS S3

```
seu-bucket.s3.amazonaws.com/
  exams/
    PROVA2024_MAT_5_uuid-random.pdf
    PROVA2024_PORT_5_uuid-random2.jpg
```

---

## 🔒 Segurança

### URLs Únicas

Cada arquivo recebe um nome único com UUID:
```
PROVA2024_MAT_5_a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf
```

Isso evita:
- ❌ Sobrescrever arquivos existentes
- ❌ Conflitos de nome
- ❌ Acesso não autorizado por adivinhação de URL

### Validações

O sistema valida:
- ✅ Tipo de arquivo (apenas formatos permitidos)
- ✅ Tamanho máximo (50MB)
- ✅ Prova deve existir no sistema
- ✅ Usuário tem permissão

---

## 🛠️ API Reference

### Upload de Arquivo

**Endpoint:**
```http
POST /api/exams/{exam_id}/upload_file/
Content-Type: multipart/form-data
```

**Request:**
```javascript
const formData = new FormData();
formData.append('file', file);

fetch(`/api/exams/123/upload_file/`, {
  method: 'POST',
  body: formData
});
```

**Response (sucesso):**
```json
{
  "success": true,
  "message": "Arquivo enviado com sucesso",
  "file_url": "https://bucket.s3.amazonaws.com/exams/PROVA2024_MAT_5_uuid.pdf",
  "file_name": "prova_matematica.pdf",
  "file_size": 1048576
}
```

**Response (erro):**
```json
{
  "error": "Tipo de arquivo não permitido. Use: .pdf, .jpg, .jpeg, .png, .doc, .docx"
}
```

---

## ❓ FAQ

### 1. Posso substituir o arquivo de uma prova?

**Sim!** Basta fazer upload de um novo arquivo. O sistema:
- Gera novo UUID único
- Atualiza o campo `exam_file`
- Arquivo antigo fica no storage (não é deletado automaticamente)

### 2. Como deletar um arquivo antigo do S3?

**Opção A - Manualmente no console AWS:**
1. Acesse o bucket S3
2. Navegue até a pasta `exams/`
3. Delete arquivos não utilizados

**Opção B - Lifecycle Policy (automático):**
Configure regra no S3 para deletar arquivos após X dias.

### 3. O que acontece se o upload falhar?

O sistema retorna erro detalhado:
- ❌ Arquivo muito grande → Reduza tamanho
- ❌ Formato inválido → Use PDF, JPG ou PNG
- ❌ Erro de conexão S3 → Verifique credenciais
- ❌ Bucket não encontrado → Verifique nome do bucket

### 4. Posso fazer upload antes de importar o gabarito?

**Não.** A prova deve existir no sistema primeiro:
1. Primeiro: Importar gabarito (cria a prova)
2. Depois: Upload do arquivo

### 5. Como testar localmente sem S3?

Configure `USE_S3=False` no `.env`. Os arquivos serão salvos em:
```
backend/media/exams/
```

Para servir arquivos locais em desenvolvimento:

**urls.py:**
```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... suas rotas
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### 6. Qual o custo do S3?

**Preços AWS S3 (us-east-1):**
- Armazenamento: $0.023/GB/mês
- Upload (PUT): $0.005 por 1.000 requests
- Download (GET): $0.0004 por 1.000 requests

**Exemplo:**
- 1000 provas de 2MB cada = 2GB
- Custo mensal: ~$0.05 (5 centavos)

### 7. Como migrar de local para S3?

**1. Copie arquivos para S3:**
```bash
aws s3 sync backend/media/exams/ s3://seu-bucket/exams/
```

**2. Atualize URLs no banco:**
```sql
UPDATE tb_exams
SET exam_file = REPLACE(
    exam_file,
    '/media/',
    'https://seu-bucket.s3.amazonaws.com/'
);
```

**3. Configure .env:**
```bash
USE_S3=True
```

---

## 🔍 Troubleshooting

### Erro: "boto3 module not found"

**Solução:**
```bash
pip install boto3 django-storages
```

### Erro: "Access Denied" no S3

**Causas possíveis:**
1. Credenciais AWS incorretas
2. Bucket sem permissão pública
3. IAM policy sem permissões

**Solução:**
- Verifique `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`
- Configure permissões do bucket
- Revise IAM policy

### Erro: "Bucket does not exist"

**Solução:**
- Verifique `AWS_STORAGE_BUCKET_NAME`
- Certifique-se que o bucket existe na região `AWS_S3_REGION_NAME`

### Upload fica "Loading..." infinitamente

**Causas:**
1. Arquivo muito grande (>50MB)
2. Timeout de rede
3. CORS não configurado

**Solução:**
- Reduza tamanho do arquivo
- Aumente timeout no nginx/apache
- Configure CORS no bucket S3

### URL do arquivo retorna 403 Forbidden

**Solução:**
Configure ACL público no S3:
```python
# settings.py
AWS_DEFAULT_ACL = 'public-read'
```

---

## 📈 Monitoramento

### Logs de Upload

O Django registra todos os uploads:

```python
# views.py logs
INFO: Upload iniciado - Prova: PROVA2024_MAT_5, Arquivo: prova.pdf
INFO: Upload concluído - URL: https://bucket.s3.amazonaws.com/exams/...
ERROR: Falha no upload - Erro: Access Denied
```

### Métricas S3 (CloudWatch)

No console AWS CloudWatch:
- **NumberOfObjects**: Total de arquivos
- **BucketSizeBytes**: Tamanho total
- **AllRequests**: Total de requisições
- **4xxErrors**: Erros de cliente
- **5xxErrors**: Erros de servidor

---

## 🎯 Boas Práticas

### ✅ Faça:

- ✓ Use S3 em produção
- ✓ Configure lifecycle policies
- ✓ Monitore custos no AWS Billing
- ✓ Faça backup do bucket
- ✓ Use CloudFront para CDN (opcional)
- ✓ Comprima PDFs antes de fazer upload

### ❌ Evite:

- ✗ Commitar credenciais AWS no git
- ✗ Usar permissões muito abertas no IAM
- ✗ Esquecer de configurar CORS
- ✗ Upload de arquivos sem validação
- ✗ Arquivos maiores que 50MB

---

## 🚀 Melhorias Futuras

### Recursos que podem ser adicionados:

1. **Preview de PDF no navegador** - Visualizar sem download
2. **Compressão automática** - Reduzir tamanho de imagens
3. **Múltiplos arquivos** - Anexar várias páginas
4. **Versionamento** - Manter histórico de versões
5. **CDN (CloudFront)** - Acelerar downloads
6. **OCR automático** - Extrair texto de PDFs
7. **Conversão automática** - Word → PDF
8. **Thumbnail** - Gerar preview em miniatura

---

## 📞 Suporte

**Problemas com S3?**
- Documentação AWS: https://docs.aws.amazon.com/s3/
- FAQ S3: https://aws.amazon.com/s3/faqs/

**Problemas com Django Storage?**
- django-storages docs: https://django-storages.readthedocs.io/

---

**Última atualização:** Dezembro 2024
**Versão:** 1.0
