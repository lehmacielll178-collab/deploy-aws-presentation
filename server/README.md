# 💈 Barbershop Scheduling API

API de agendamento para barbearia construída com **Fastify**, **Prisma** e **TypeScript** — criada como **exemplo de deploy na AWS** com Docker e Nginx.

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Rotas da API](#rotas-da-api)
- [Configuração Local](#configuração-local)
- [Deploy com Docker](#deploy-com-docker)
- [Deploy na AWS](#deploy-na-aws)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Fluxo de Autenticação](#fluxo-de-autenticação)

---

## Visão Geral

O sistema é um CRUD simples para gestão de horários de barbearia. Ele possui:

- **Administrador único** (o barbeiro): capaz de criar, editar e remover horários, além de marcar dias como fechados.
- **Rotas públicas**: qualquer pessoa pode consultar os horários disponíveis da semana sem autenticação, sujeitas a rate limiting.
- **Rate limiting via Nginx**: as rotas públicas são protegidas contra abuso com configuração de limite de requisições tanto no Nginx quanto no Fastify.

---

## Tecnologias

| Tecnologia | Papel |
|---|---|
| **Fastify** | Servidor HTTP — rápido e com tipagem nativa |
| **Prisma** | ORM — abstração do banco com migrations e type-safety |
| **SQLite** | Banco de dados — simplicidade para desenvolvimento e deploy |
| **Zod** | Validação de dados — schemas com inferência de tipos |
| **@fastify/jwt** | Autenticação JWT |
| **@fastify/rate-limit** | Rate limiting no nível da aplicação |
| **Nginx** | Proxy reverso com rate limiting adicional |
| **Docker + Compose** | Containerização para deploy |

---

## Arquitetura do Projeto

```
src/
├── config/
│   └── env.ts              # Validação e tipagem das variáveis de ambiente com Zod
│
├── dtos/                   # Data Transfer Objects — schemas Zod para validação de entrada
│   ├── auth.dto.ts
│   ├── schedule.dto.ts
│   └── day-config.dto.ts
│
├── services/               # Regras de negócio e acesso ao banco via Prisma
│   ├── auth.service.ts
│   ├── schedule.service.ts
│   └── day-config.service.ts
│
├── controllers/            # Recebe requisição, valida via DTO, chama service, retorna resposta
│   ├── auth.controller.ts
│   ├── schedule.controller.ts
│   └── day-config.controller.ts
│
├── middlewares/
│   └── auth.middleware.ts  # authenticate + requireAdmin
│
├── routes/                 # Registro de rotas no Fastify
│   ├── auth.routes.ts
│   ├── public-schedule.routes.ts
│   └── admin.routes.ts
│
├── prisma/
│   ├── client.ts           # Singleton do PrismaClient
│   └── seed.ts             # Cria admin padrão se não existir
│
├── app.ts                  # Monta o app Fastify com plugins e rotas
└── server.ts               # Entry point — conecta DB, garante admin, inicia servidor

prisma/
├── schema.prisma           # Definição dos modelos do banco
└── migrations/             # Histórico de migrations SQL

nginx/
└── nginx.conf              # Configuração do proxy reverso com rate limiting

docker-compose.yml          # Orquestração: api + nginx + volume SQLite
Dockerfile                  # Build multi-stage (builder + production)
```

### Separação de responsabilidades

- **DTOs** (`/dtos`): Definem e validam a _forma_ dos dados de entrada usando Zod. São usados nos controllers antes de qualquer lógica de negócio.
- **Services** (`/services`): Contêm a lógica de negócio. Fazem acesso ao banco via Prisma. Não conhecem Fastify.
- **Controllers** (`/controllers`): Fazem a ponte entre HTTP e os services. Recebem `request`/`reply`, chamam o DTO para validar, chamam o service, e retornam a resposta HTTP.
- **Routes** (`/routes`): Registram as rotas no Fastify, associam controllers e middlewares de autenticação.
- **Middlewares** (`/middlewares`): Lógica transversal — autenticação JWT e verificação de permissão de admin.

---

## Rotas da API

### Públicas (`/schedules`)
> Sujeitas a rate limiting (30 req/min por IP via Nginx)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/schedules/week` | Horários da semana. Query: `?startDate=YYYY-MM-DD` |
| `GET` | `/schedules/day/:date` | Horários de um dia específico |
| `GET` | `/health` | Health check do serviço |

### Autenticação (`/auth`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/login` | Login do admin. Body: `{ email, password }` |
| `GET` | `/auth/me` | Dados do usuário autenticado (requer token) |

### Admin (`/admin`) — 🔒 Requer JWT com role `ADMIN`

#### Horários
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/admin/schedules` | Criar um horário |
| `POST` | `/admin/schedules/bulk` | Criar múltiplos horários para um dia |
| `PATCH` | `/admin/schedules/:id` | Atualizar status ou label de um horário |
| `DELETE` | `/admin/schedules/:id` | Remover um horário |

#### Configuração de dias
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/admin/day-config` | Marcar um dia como aberto ou fechado |
| `GET` | `/admin/day-config/closed` | Listar todos os dias fechados |
| `GET` | `/admin/day-config/:date` | Status de um dia específico |

### Status de Horários

| Status | Descrição |
|---|---|
| `AVAILABLE` | Horário livre para agendamento |
| `BOOKED` | Horário ocupado |
| `CLOSED` | Horário bloqueado (almoço, pausa, etc.) |

---

## Configuração Local

### Pré-requisitos

- Node.js 20+
- npm

### Instalação

```bash
# 1. Clone o repositório
git clone <repo-url>
cd barbershop-api

# 2. Instale dependências
npm install

# 3. Configure o .env
cp .env.example .env
# Edite o .env conforme necessário

# 4. Execute as migrations e gere o Prisma Client
npx prisma migrate dev --name init
npx prisma generate

# 5. Inicie o servidor em modo desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

Na primeira execução, o sistema cria automaticamente o usuário admin com as credenciais definidas no `.env`.

### Scripts disponíveis

```bash
npm run dev          # Inicia em modo desenvolvimento com hot-reload
npm run build        # Compila TypeScript para /dist
npm start            # Inicia a versão compilada
npm run db:generate  # Gera o Prisma Client
npm run db:migrate   # Aplica migrations (produção)
npm run db:migrate:dev # Cria e aplica migration em desenvolvimento
npm run db:studio    # Abre o Prisma Studio (GUI do banco)
npm run db:seed      # Cria admin padrão manualmente
```

---

## Deploy com Docker

```bash
# Build e inicialização dos containers
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Parar e remover volumes (apaga o banco!)
docker-compose down -v
```

A aplicação ficará disponível na porta `80` via Nginx.

### Variáveis para produção

Crie um arquivo `.env` na raiz com:

```env
JWT_SECRET=uma-chave-super-secreta-e-longa
ADMIN_EMAIL=admin@suabarbearia.com
ADMIN_PASSWORD=SenhaForte123!
ADMIN_NAME=João Barbeiro
```

---

## Deploy na AWS

### Opção 1: EC2 (recomendado para este exemplo)

1. **Crie uma instância EC2** (Ubuntu 22.04, t3.micro é suficiente).

2. **Configure o Security Group** com as portas:
   - `22` (SSH) — restrito ao seu IP
   - `80` (HTTP) — aberto para `0.0.0.0/0`
   - `443` (HTTPS) — aberto para `0.0.0.0/0` (quando configurar SSL)

3. **Instale Docker na instância:**
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-plugin
   sudo usermod -aG docker $USER
   ```

4. **Clone o projeto e faça deploy:**
   ```bash
   git clone <repo-url> ~/barbershop-api
   cd ~/barbershop-api
   cp .env.example .env
   # Edite o .env com credenciais de produção
   nano .env
   docker compose up -d --build
   ```

5. **Acesse** pelo IP público da instância: `http://<EC2_PUBLIC_IP>`

### Opção 2: Com SSL via Certbot

Após o deploy básico, instale o Certbot para HTTPS:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d seudominio.com
```

Atualize o `nginx/nginx.conf` para redirecionar HTTP → HTTPS e habilite a porta `443` no `docker-compose.yml`.

### Dicas de produção na AWS

- **Elastic IP**: associe um IP fixo à instância para evitar mudança de IP a cada restart.
- **Route 53**: use para apontar seu domínio para o IP da EC2.
- **EBS Volume**: o SQLite é persistido em um volume Docker. Para maior durabilidade, considere montar o volume em um EBS dedicado.
- **Backups**: faça backup periódico do arquivo `.db` com scripts cron ou AWS Backup.
- **Logs**: use `docker compose logs -f api` para monitorar a aplicação. Para produção, considere integrar com CloudWatch Logs.

---

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `DATABASE_URL` | `file:./dev.db` | Caminho do arquivo SQLite |
| `JWT_SECRET` | — | Chave secreta para assinar tokens JWT |
| `PORT` | `3000` | Porta do servidor Fastify |
| `ADMIN_EMAIL` | `admin@barbearia.com` | E-mail do admin padrão |
| `ADMIN_PASSWORD` | `admin123` | Senha do admin padrão |
| `ADMIN_NAME` | `Administrador` | Nome do admin padrão |

---

## Fluxo de Autenticação

```
1. POST /auth/login  →  { email, password }
2. API valida credenciais e retorna JWT (expira em 8h)
3. Todas as rotas /admin/* exigem: Authorization: Bearer <token>
4. O middleware requireAdmin verifica JWT + role === "ADMIN"
```

### Exemplo de uso (cURL)

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barbearia.com","password":"admin123"}' \
  | jq -r '.token')

# Criar horário (admin)
curl -X POST http://localhost/admin/schedules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-03-10",
    "startTime": "09:00",
    "endTime": "09:30",
    "status": "AVAILABLE"
  }'

# Criar vários horários de uma vez (admin)
curl -X POST http://localhost/admin/schedules/bulk \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-03-10",
    "slots": [
      { "startTime": "10:00", "endTime": "10:30" },
      { "startTime": "10:30", "endTime": "11:00" },
      { "startTime": "11:00", "endTime": "11:30" }
    ]
  }'

# Fechar um dia
curl -X POST http://localhost/admin/day-config \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-03-15","isClosed":true,"reason":"Feriado"}'

# Consultar semana (público)
curl http://localhost/schedules/week
curl http://localhost/schedules/week?startDate=2025-03-10
```
