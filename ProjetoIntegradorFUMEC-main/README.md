# Empreende+ / Projeto Integrador FUMEC

Aplicação React/Vite com backend Node.js + Express e PostgreSQL para uma jornada empreendedora com login, módulos, vídeos, materiais e atividades práticas.

## Rodar localmente com Docker

```bash
docker compose up --build
```

API local:

```text
http://localhost:8080/api
```

Frontend local:

```bash
cp .env.example .env
npm install
npm run dev
```

Usuário demo:

```text
email: demo@empreende.com
senha: 123456
```

## Deploy no Render

Este pacote já está preparado para Render com o arquivo:

```text
render.yaml
```

Ele define:

- `empreende-api`: backend Node/Express.
- `empreende-frontend`: frontend Vite como Static Site.
- `empreende-db`: PostgreSQL no Render.

Roteiro completo:

```text
docs/render-deploy.md
```

## Variáveis principais

Frontend:

```env
VITE_API_URL=http://localhost:8080/api
VITE_SKIP_AUTH=false
```

Backend:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
JWT_SECRET=troque-por-uma-chave-grande-e-secreta
CORS_ORIGIN=http://localhost:5173
```

## Estrutura

```text
backend/              API Express + PostgreSQL
backend/migrations/   Criação das tabelas
backend/seeds/        Dados iniciais dos módulos
src/                  Frontend React/Vite
render.yaml           Blueprint para Render
docs/render-deploy.md Roteiro de deploy
```
