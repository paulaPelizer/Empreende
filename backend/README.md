# Backend Empreende+

API Node.js + Express + PostgreSQL para a plataforma Empreende+.

## Rodar localmente sem Docker

```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

## Rodar localmente com Docker Compose

Na raiz do projeto:

```bash
docker compose up --build
```

A API sobe em:

```text
http://localhost:8080/api
```

Usuário demo:

```text
email: demo@empreende.com
senha: 123456
```

## Deploy no Render

O script usado no Render é:

```bash
npm run render:start
```

Ele executa migrations, seed e depois inicia o servidor:

```bash
npm run migrate && npm run seed && node src/server.js
```

Variáveis esperadas:

```env
NODE_ENV=production
DATABASE_URL=<Render Internal Database URL>
JWT_SECRET=<chave secreta>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
DB_SSL=false
```

## Principais rotas

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET /api/jornada`
- `GET /api/jornada/modules/:id/content`
- `PUT /api/jornada/modules/:id/activity`
- `POST /api/jornada/modules/:id/complete-step`
- `GET /api/mentoria`
- `GET /api/comunidade`
- `GET /api/certificados`
- `GET /api/configuracoes`

## Conteúdos dos módulos

Os links de vídeo e PDF ficam na tabela `modules`, nos campos:

- `video_url`
- `pdf_url`
