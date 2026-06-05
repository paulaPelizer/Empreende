# Empreende+

Aplicação web desenvolvida para apoiar uma jornada formativa de empreendedorismo voltada a pequenos negócios, com foco em empresas do ramo de alimentos. A plataforma permite que o usuário acesse módulos de aprendizagem, assista vídeos, consulte materiais de apoio, realize atividades práticas e acompanhe seu progresso ao longo da jornada.

## Visão geral

O projeto foi estruturado como uma aplicação full stack, composta por:

* **Frontend:** React + Vite + TypeScript
* **Backend:** Node.js + Express
* **Banco de dados:** PostgreSQL
* **Hospedagem:** Render
* **Deploy:** Render Blueprint via `render.yaml`

A aplicação publicada no Render funciona com três serviços principais:

```text
empreende-frontend  → Frontend React/Vite
empreende-api       → Backend Node.js/Express
empreende-db        → Banco PostgreSQL
```

## Link da aplicação

```text
https://empreende-frontend.onrender.com/
```

## Objetivo do projeto

O objetivo da aplicação é oferecer uma jornada digital simples e acessível para pequenos empreendedores, especialmente do setor de alimentos, auxiliando na organização inicial do negócio, análise de mercado, construção do modelo de negócio, letramento digital e uso de ferramentas digitais para administração e comunicação.

## Jornada formativa

A jornada é composta por 5 módulos:

1. **Sobre a empresa: missão, visão e valores**
2. **Análise de mercado**
3. **Modelo de negócio**
4. **Letramento digital e perspectivas para seu negócio**
5. **Ferramentas digitais para administração e comunicação**

Cada módulo possui etapas de aprendizagem, incluindo:

* vídeo;
* atividade prática;
* material de apoio;
* atividade final ou fechamento do módulo.

O progresso do usuário é atualizado conforme ele interage com essas etapas.

## Funcionalidades principais

* Cadastro e login de usuários.
* Autenticação com JWT.
* Exibição dos módulos da jornada.
* Exibição de vídeos por módulo.
* Links para materiais de apoio.
* Registro de respostas das atividades práticas.
* Controle de progresso por usuário e por módulo.
* Dashboard com resumo da jornada.
* Tela de consulta das respostas enviadas.
* Estrutura preparada para mentoria, comunidade, certificados e configurações.

## Arquitetura da aplicação

```text
Usuário
  ↓
Frontend React/Vite
  ↓
API Node.js/Express
  ↓
Banco PostgreSQL no Render
```

O frontend consome a API por meio da variável de ambiente:

```env
VITE_API_URL=https://empreende-api.onrender.com/api
```

O backend acessa o banco por meio da variável:

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
```

## Estrutura do projeto

```text
ProjetoIntegradorFUMEC-main/
├── backend/
│   ├── migrations/
│   │   └── 001_init.sql
│   ├── seeds/
│   │   └── 001_seed.sql
│   ├── src/
│   │   ├── db.js
│   │   ├── server.js
│   │   └── routes/
│   ├── package.json
│   └── .env.render.example
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── main.tsx
├── docs/
├── package.json
├── render.yaml
└── README.md
```

## Banco de dados

O banco utilizado é um PostgreSQL hospedado no Render, criado como o serviço:

```text
empreende-db
```

As principais tabelas são:

```text
users
modules
module_steps
user_step_progress
module_activity_responses
user_activities
mentors
mentoring_sessions
discussions
discussion_replies
discussion_likes
notification_settings
preference_settings
```

### Tabelas principais da jornada

#### `users`

Armazena os usuários cadastrados na plataforma.

#### `modules`

Armazena os módulos da jornada formativa.

#### `module_steps`

Armazena as etapas de cada módulo, como vídeo, atividade, material de apoio e finalização.

#### `user_step_progress`

Registra quais etapas foram concluídas por cada usuário.

#### `module_activity_responses`

Registra as respostas enviadas nas atividades práticas. As respostas são armazenadas em formato JSON, permitindo que cada módulo tenha formulários diferentes.

## Consulta das respostas no banco

As respostas das atividades ficam na tabela:

```text
module_activity_responses
```

Uma consulta útil para visualizar as respostas com e-mail do usuário, módulo e etapa é:

```sql
SELECT
  u.email,
  m.module_order,
  m.title AS modulo,
  s.label AS etapa,
  jsonb_pretty(r.form_values) AS respostas,
  jsonb_pretty(r.checks) AS checklist,
  r.submitted,
  r.updated_at
FROM module_activity_responses r
JOIN users u ON u.id = r.user_id
JOIN modules m ON m.id = r.module_id
LEFT JOIN module_steps s
  ON s.module_id = r.module_id
 AND s.step_key = r.step_key
ORDER BY r.updated_at DESC;
```

## Como rodar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO/ProjetoIntegradorFUMEC-main
```

### 2. Instalar dependências do frontend

```bash
npm install
```

### 3. Instalar dependências do backend

```bash
cd backend
npm install
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/` com base no exemplo:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/empreende_db
JWT_SECRET=sua_chave_secreta
PORT=8080
CORS_ORIGIN=http://localhost:5173
```

Na raiz do frontend, crie ou ajuste o arquivo `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

### 5. Rodar o backend

Dentro da pasta `backend/`:

```bash
npm run dev
```

### 6. Rodar o frontend

Na raiz do projeto:

```bash
npm run dev
```

A aplicação local deve abrir em:

```text
http://localhost:5173
```

## Deploy no Render

O deploy é feito pelo Render usando o arquivo:

```text
render.yaml
```

Esse arquivo cria e configura:

```text
empreende-frontend
empreende-api
empreende-db
```

Após fazer alterações no código, o fluxo de atualização é:

```bash
git add .
git commit -m "descrição da alteração"
git push origin main
```

Depois do push, o Render pode fazer deploy automático. Se necessário, também é possível forçar manualmente em:

```text
Render Dashboard
→ empreende-frontend ou empreende-api
→ Manual Deploy
→ Clear build cache & deploy
```

## Variáveis de ambiente no Render

### Frontend

```env
VITE_API_URL=https://empreende-api.onrender.com/api
```

### Backend

```env
DATABASE_URL=definida automaticamente pelo Render
JWT_SECRET=chave secreta da aplicação
CORS_ORIGIN=https://empreende-frontend.onrender.com
NODE_ENV=production
RESET_DEMO_PROGRESS=true
```

A variável `RESET_DEMO_PROGRESS=true` pode ser usada em ambiente de demonstração para reiniciar o progresso do usuário demo após o deploy. Em uma versão de produção, recomenda-se alterar para:

```env
RESET_DEMO_PROGRESS=false
```

## Usuário de demonstração

```text
E-mail: demo@empreende.com
Senha: 123456
```

## Observações sobre o plano gratuito do Render

A aplicação está hospedada no Render em ambiente adequado para MVP, testes e apresentação acadêmica. Em planos gratuitos, alguns serviços podem hibernar após períodos sem uso, fazendo com que o primeiro acesso demore alguns segundos.

Para uso em produção, recomenda-se avaliar:

* banco de dados persistente sem expiração;
* domínio próprio;
* controle de cadastro por convite;
* políticas de backup;
* autenticação mais robusta;
* painel administrativo;
* logs e monitoramento;
* ambiente separado para produção e desenvolvimento.

## Possíveis melhorias futuras

* Criar painel administrativo para visualizar respostas dos participantes.
* Adicionar exportação das respostas em CSV ou Excel.
* Criar controle de turmas ou grupos.
* Criar cadastro por código de convite.
* Adicionar upload de materiais próprios.
* Criar relatórios de progresso por participante.
* Melhorar a área de certificados.
* Adicionar trilhas personalizadas por perfil de negócio.
* Criar área de mentoria com agendamento real.
* Integrar notificações por e-mail.

## Tecnologias utilizadas

* React
* Vite
* TypeScript
* Node.js
* Express
* PostgreSQL
* Render
* JWT
* SQL
* HTML
* CSS
* JavaScript

## Status do projeto

Projeto em fase de MVP funcional, com frontend, backend e banco de dados integrados e publicados em ambiente cloud pelo Render.
