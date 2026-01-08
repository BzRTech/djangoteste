# ✅ Como Resolver o Erro de Conexão PostgreSQL

## 🔍 O Problema

Você está vendo este erro:
```
psycopg2.OperationalError: connection to server at "localhost" (::1), port 5432 failed: Connection refused
```

**Causa**: O servidor PostgreSQL não está rodando no seu computador.

---

## 🚀 Solução Rápida: Usar SQLite (RECOMENDADO)

SQLite é um banco de dados em arquivo, não precisa de servidor. Perfeito para desenvolvimento!

### Passos:

1. **Já está configurado!** Criei um arquivo `.env` com SQLite habilitado

2. **Aplicar as migrações:**
   ```powershell
   # No diretório backend/
   python manage.py migrate
   ```

3. **Criar superusuário (administrador):**
   ```powershell
   python manage.py createsuperuser
   ```
   - Username: admin (ou o que preferir)
   - Email: seu@email.com
   - Password: (escolha uma senha)

4. **Rodar o servidor:**
   ```powershell
   python manage.py runserver
   ```

5. **Pronto!** Acesse:
   - API: http://localhost:8000/api/
   - Admin: http://localhost:8000/admin/

---

## 🐘 Solução Alternativa: Iniciar PostgreSQL

Se você PRECISA usar PostgreSQL:

### Windows:

#### Opção 1: Via Serviços
1. Pressione `Win + R`
2. Digite: `services.msc` e pressione Enter
3. Procure por "postgresql" na lista
4. Clique com botão direito → "Iniciar"

#### Opção 2: Prompt de Comando (Administrador)
```cmd
net start postgresql-x64-15
```
*Nota: O nome pode variar (postgresql-x64-14, postgresql-x64-16)*

#### Opção 3: Verificar se PostgreSQL está instalado
```powershell
psql --version
```

Se não estiver instalado, baixe em: https://www.postgresql.org/download/windows/

### Depois de iniciar o PostgreSQL:

1. **Configure o `.env`:**
   ```env
   USE_SQLITE=False
   DB_NAME=djangoteste
   DB_USER=postgres
   DB_PASSWORD=sua_senha
   DB_HOST=localhost
   DB_PORT=5432
   USE_S3=False
   ```

2. **Crie o banco de dados:**
   ```powershell
   psql -U postgres
   CREATE DATABASE djangoteste;
   \q
   ```

3. **Aplique as migrações:**
   ```powershell
   python manage.py migrate
   ```

---

## 📁 Estrutura de Arquivos Criados

```
backend/
├── .env                    # Configuração (SQLite habilitado)
├── .env.example           # Modelo de configuração
├── db.sqlite3             # Banco de dados SQLite (criado após migrate)
└── RESOLVER_ERRO_POSTGRES.md  # Este arquivo
```

---

## 🧪 Testar se Funcionou

```powershell
# 1. Aplicar migrações
python manage.py migrate

# 2. Criar superusuário
python manage.py createsuperuser

# 3. Rodar servidor
python manage.py runserver

# 4. Em outro terminal, testar API
curl http://localhost:8000/api/users/me/
```

---

## 🆘 Troubleshooting

### Erro: "no such table: custom_user"
**Solução**: Você esqueceu de rodar `python manage.py migrate`

### Erro: "unapplied migrations"
**Solução**: Rode `python manage.py migrate`

### Erro: "Authentication credentials were not provided"
**Solução**: Normal! Você precisa fazer login primeiro:
1. Acesse: http://localhost:8000/admin/
2. Faça login com o superusuário
3. Agora pode usar a API

### Erro: "No module named 'psycopg2'"
**Solução**: Se estiver usando SQLite, você NÃO precisa do psycopg2!
Mas se quiser instalar: `pip install psycopg2-binary`

---

## 💡 Dica: Quando usar cada banco?

| Situação | Banco Recomendado |
|----------|-------------------|
| Desenvolvimento local | **SQLite** (simples, sem configuração) |
| Produção | **PostgreSQL** (robusto, escalável) |
| Testes | **SQLite** (rápido) |
| Múltiplos desenvolvedores | **PostgreSQL** (centralizado) |

---

## ✅ Checklist Rápido

- [ ] Arquivo `.env` existe com `USE_SQLITE=True`
- [ ] Rodou `python manage.py migrate`
- [ ] Criou superusuário com `python manage.py createsuperuser`
- [ ] Rodou `python manage.py runserver`
- [ ] Acessou http://localhost:8000/admin/ e fez login
- [ ] Testou criar um usuário no admin

**Se todos os passos funcionaram, está pronto para usar! 🎉**
