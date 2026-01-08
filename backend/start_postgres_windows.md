# Como iniciar PostgreSQL no Windows

## Opção 1: Via Services (Serviços)
1. Pressione `Win + R`
2. Digite: `services.msc`
3. Procure por "postgresql" na lista
4. Clique com botão direito → "Iniciar" (Start)

## Opção 2: Via Prompt de Comando (Admin)
```cmd
net start postgresql-x64-15
```
(O nome pode variar: postgresql-x64-14, postgresql-x64-16, etc)

## Opção 3: Via pgAdmin
1. Abra o pgAdmin 4
2. Conecte ao servidor
3. Se não conectar, o serviço não está rodando

## Verificar se está rodando
```cmd
psql -U postgres
```
Se conectar, está funcionando!
