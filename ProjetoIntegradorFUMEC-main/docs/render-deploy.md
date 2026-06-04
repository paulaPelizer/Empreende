# Deploy do Empreende+ no Render

Este projeto foi ajustado para rodar no Render com:

- **Frontend React/Vite** como Static Site.
- **Backend Node.js + Express** como Web Service.
- **Banco PostgreSQL** como Render Postgres.

## 1. Subir o projeto para o GitHub

No terminal, dentro da pasta `ProjetoIntegradorFUMEC-main`:

```bash
git init
git add .
git commit -m "prepare render deploy"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

Se o repositório já existir, use apenas `git add`, `git commit` e `git push`.

## 2. Deploy mais simples: Blueprint

O arquivo `render.yaml` já está na raiz do projeto. No Render:

1. Acesse o Dashboard do Render.
2. Clique em **New +**.
3. Escolha **Blueprint**.
4. Conecte o repositório do GitHub.
5. Selecione o arquivo `render.yaml`.
6. Confirme a criação dos serviços.

O Blueprint deve criar:

- `empreende-api`
- `empreende-frontend`
- `empreende-db`

## 3. Conferir variáveis do backend

No serviço `empreende-api`, confira em **Environment**:

```env
NODE_ENV=production
DATABASE_URL=<gerado pelo Render>
JWT_SECRET=<gerado pelo Render>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
DB_SSL=false
```

Para MVP acadêmico, `CORS_ORIGIN=*` ajuda a evitar bloqueio no primeiro deploy. Depois que a URL final do frontend estiver confirmada, você pode trocar por:

```env
CORS_ORIGIN=https://empreende-frontend.onrender.com
```

Se o Render gerar outro domínio com sufixo, use exatamente a URL real do frontend.

## 4. Conferir variáveis do frontend

No serviço `empreende-frontend`, confira:

```env
VITE_API_URL=https://empreende-api.onrender.com/api
VITE_SKIP_AUTH=false
```

Se o Render gerar outra URL para a API, troque `VITE_API_URL` pela URL real, sempre terminando com `/api`.

Exemplo:

```env
VITE_API_URL=https://empreende-api-abc1.onrender.com/api
```

Depois de alterar variável no frontend, clique em **Manual Deploy > Clear build cache & deploy**.

## 5. Migrations e seed

O backend usa este comando de inicialização no Render:

```bash
npm run render:start
```

Ele executa automaticamente:

```bash
npm run migrate
npm run seed
node src/server.js
```

Isso cria as tabelas e insere dados iniciais. O seed é idempotente, ou seja, pode rodar mais de uma vez sem duplicar os módulos principais.

Usuário demo:

```text
email: demo@empreende.com
senha: 123456
```

## 6. Testar a API

Depois do deploy da API, abra:

```text
https://empreende-api.onrender.com/api/health
```

Se estiver tudo certo, deve retornar algo parecido com:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## 7. Testar o frontend

Abra a URL do Static Site e faça login com:

```text
email: demo@empreende.com
senha: 123456
```

Depois acesse a jornada e confira se os módulos carregam.

## 8. Onde trocar links dos vídeos e materiais

Os links ficam na tabela `modules`, nos campos:

- `video_url`
- `pdf_url`

No protótipo, você pode trocar esses links de duas formas:

### Opção A — pelo banco do Render

Abra o Postgres no Render e execute SQL como:

```sql
UPDATE modules
SET video_url = 'https://www.youtube.com/embed/SEU_VIDEO',
    pdf_url = 'https://drive.google.com/file/d/SEU_ARQUIVO/view'
WHERE module_order = 1;
```

### Opção B — alterando o seed

Edite `backend/seeds/001_seed.sql`, troque os links placeholder e faça novo deploy.

## 9. Limitações do plano gratuito

O Render é ótimo para MVP, teste e apresentação, mas o plano gratuito tem limitações. Web Services gratuitos podem hibernar quando ficam sem uso, e o banco gratuito é temporário. Para produção, migre para um banco pago ou use outro Postgres permanente.
