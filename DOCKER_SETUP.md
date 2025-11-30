# 🏰 Church Schedule - Configuração PostgreSQL + Docker

## 📋 O que foi criado

Criei um setup completo para você rodar PostgreSQL em Docker com dados de teste:

### ✅ Arquivos criados:

1. **`init.sql`** - Script SQL com:

   - Criação de todas as tabelas
   - Tipos ENUM (ministerios)
   - Chaves estrangeiras
   - 10 membros de teste
   - 5 eventos de teste
   - 17 cargos/roles
   - 3 bandas de louvor
   - Dados completos em todas as tabelas
   - Índices para performance

2. **`docker-compose.yml`** - Configuração Docker com:

   - PostgreSQL 15 Alpine (leve e rápido)
   - Volume persistente para dados
   - Health check automático
   - Executa `init.sql` na primeira inicialização

3. **`.env.local`** - Variáveis de ambiente para desenvolvimento

4. **`controllers/index.js`** - Melhorado com:

   - Tratamento de erros
   - Logs descritivos
   - Pool de conexões
   - Teste automático ao iniciar

5. **Scripts de inicialização:**

   - `start-docker.bat` - Para Windows CMD
   - `start-docker.ps1` - Para Windows PowerShell

6. **Script de teste:**
   - `test-connection.ps1` - Verifica conexão e dados

---

## 🚀 Como usar

### Pré-requisito: Docker Desktop

Se não tiver Docker instalado:

1. Baixe em: https://www.docker.com/products/docker-desktop
2. Instale e inicie o Docker Desktop
3. Aguarde até que esteja completamente inicializado (ícone Docker na bandeja do sistema)

### Opção 1: PowerShell (Recomendado)

```powershell
# 1. Abra PowerShell na raiz do projeto
cd "c:\Users\bruno\OneDrive\Documents\GitHub\nuh\Church-Schedule"

# 2. Execute o script de inicialização
.\start-docker.ps1
```

### Opção 2: CMD

```cmd
REM Na raiz do projeto
cd c:\Users\bruno\OneDrive\Documents\GitHub\nuh\Church-Schedule
start-docker.bat
```

### Opção 3: Manual (Docker Compose)

```bash
cd "c:\Users\bruno\OneDrive\Documents\GitHub\nuh\Church-Schedule"
docker-compose up -d
```

---

## ✅ Verificar se está funcionando

### Opção 1: Script de teste

```powershell
.\test-connection.ps1
```

### Opção 2: Verificar manualmente

```bash
# Ver containers
docker ps

# Ver logs
docker-compose logs postgres

# Testar conexão
docker exec -it church-schedule-db psql -U default -d verceldb
```

---

## 📊 Credenciais e Informações

### PostgreSQL

```
Host:       localhost
Porta:      5432
Usuário:    default
Senha:      y10VZJiUpjhg
Banco:      verceldb
```

### Usuários de teste

| Email             | Senha    | Role  |
| ----------------- | -------- | ----- |
| admin@church.test | admin123 | admin |
| user@church.test  | user123  | user  |

### Dados de teste inseridos

- **Membros:** 10 (João, Maria, Pedro, etc.)
- **Eventos:** 5 (Cultos, Ensaios, Conferências)
- **Cargos:** 17 (Guitarrista, Baterista, Diácono, etc.)
- **Bandas:** 3 (Banda A, Banda B, Banda Instrumental)
- **Escalas:** 10 (membros já escalados em eventos)
- **Indisponibilidades:** 2 (alguns membros com dias indisponíveis)
- **Voluntários:** 3

---

## 🔌 Conectar o servidor Node.js

### 1. Instalar dependências

```bash
cd Codigo/server
npm install
```

### 2. Copiar .env.local para .env

```bash
cp .env.local .env
```

Ou configure manualmente em `.env`:

```env
POSTGRES_USER=default
POSTGRES_PASSWORD=y10VZJiUpjhg
POSTGRES_HOST=localhost
POSTGRES_DATABASE=verceldb
DATABASE_PORT=5432
NODE_ENV=development
PORT=3001
```

### 3. Iniciar servidor

```bash
npm run dev
```

Você deve ver:

```
✅ PostgreSQL Connected Successfully!
   Database: verceldb
   Host: localhost
   User: default
Listening to 3001
```

---

## 🛑 Parar/Reiniciar

### Parar containers

```bash
docker-compose down
```

### Reiniciar (mantém dados)

```bash
docker-compose restart
```

### Remover tudo (limpa dados)

```bash
docker-compose down -v
```

---

## 🔧 Troubleshooting

### ❌ "Port 5432 already in use"

```powershell
# Listar processos na porta 5432
netstat -ano | findstr :5432

# Matar processo (substitua PID)
taskkill /PID <PID> /F

# Ou mudar porta no docker-compose.yml: "5433:5432"
```

### ❌ "Docker daemon is not running"

- Abra o Docker Desktop
- Aguarde completamente inicializar
- Tente novamente

### ❌ "Cannot connect to database"

1. Verifique se container está rodando: `docker ps`
2. Verifique logs: `docker-compose logs postgres`
3. Reinicie: `docker-compose restart`
4. Confira credenciais em `.env`

### ❌ "Erro ao executar script PowerShell"

Se receber erro de execução:

```powershell
# Permitir execução local
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Depois execute
.\start-docker.ps1
```

---

## 📚 Comandos úteis PostgreSQL

### Acessar psql no container

```bash
docker exec -it church-schedule-db psql -U default -d verceldb
```

### Dentro do psql

```sql
\dt                          -- Listar todas as tabelas
\d members                   -- Descrever tabela 'members'
SELECT * FROM members;       -- Ver todos os membros
SELECT * FROM events;        -- Ver todos os eventos
SELECT * FROM roles;         -- Ver todos os cargos
\q                           -- Sair
```

### Backup do banco

```bash
docker exec church-schedule-db pg_dump -U default verceldb > backup.sql
```

### Restaurar backup

```bash
docker exec -i church-schedule-db psql -U default verceldb < backup.sql
```

---

## 📁 Estrutura de Tabelas

### events

- `id`, `nameEvent`, `dateEvent`, `hourEvent`, `typeEvent`, `descEvent`, `preletor`

### members

- `id`, `name`, `telefone`, `diaconia`, `louvor`, `midia`

### roles

- `id`, `descricao`, `ministerio` (enum: diaconia, louvor, midia)

### scale (Escalas)

- `id`, `idCargos`, `idEventos`, `idMembro`

### bands

- `id`, `nome`

### memberband (Membros das bandas)

- `id`, `idmember`, `idband`, `idroles`

### volunteers (Voluntários)

- `id`, `nome`, `cargo`, `idevent`

### unavailable (Indisponibilidades)

- `id`, `idMembro`, `dataInicio`, `dataFim`

### users

- `id`, `email`, `password`, `role`, `created_at`

---

## 🔐 Observações de Segurança

⚠️ **IMPORTANTE:** As credenciais aqui são apenas para DESENVOLVIMENTO

Para PRODUÇÃO:

1. Use senhas fortes
2. Ative SSL/TLS
3. Use variáveis de ambiente seguras
4. Não commite `.env` no git
5. Use secrets management (AWS Secrets, Azure KeyVault, etc.)

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique logs: `docker-compose logs`
2. Reinicie: `docker-compose restart`
3. Recrie: `docker-compose down -v && docker-compose up -d`
4. Verifique arquivo `init.sql` em `dataBase/init.sql`

---

## ✨ Próximas etapas

1. ✅ PostgreSQL rodando
2. ⏭️ Conectar Node.js server
3. ⏭️ Testar endpoints da API
4. ⏭️ Conectar frontend React
5. ⏭️ Deploy em produção

Boa sorte! 🚀
