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

## Atualização aplicada nesta versão

Esta versão inclui os ajustes de progresso e atividades por interação real:

- Progresso inicial do usuário demo zerado no deploy (`RESET_DEMO_PROGRESS=true`).
- Progresso geral calculado por etapas concluídas no banco (`user_step_progress`).
- Cada módulo possui 4 etapas: vídeo, atividade 1, PDF e atividade 2.
- Salvar rascunho não conclui etapa.
- Enviar atividade conclui a etapa correspondente.
- Na última atividade, o botão finaliza o módulo e libera o próximo.
- Nova tela `Minhas Respostas` para consultar respostas salvas/enviadas.
- Jornada atualizada com 5 módulos oficiais:
  1. Sobre a empresa: missão, visão e valores.
  2. Análise de mercado.
  3. Modelo de negócio.
  4. Letramento digital e perspectivas para seu negócio.
  5. Ferramentas digitais para administração e comunicação.
- Módulos 4 e 5 adaptados ao ramo de alimentos e a pequenos negócios, com foco em delivery, cardápio digital, estoque, pedidos, planilhas, comunicação e controles simples.
- Conteúdos dos módulos foram diferenciados por tema.
- Links reais de vídeos e materiais foram cadastrados no seed.

Documentação complementar:

- `docs/consultar-respostas.md`
- `docs/atualizar-render.md`
