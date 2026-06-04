# Como atualizar o deploy no Render

Depois de substituir os arquivos no repositório, rode:

```powershell
git status
git add .
git commit -m "atualiza jornada para cinco modulos"
git push origin main
```

O Render deve iniciar o deploy automaticamente. Se não iniciar:

```text
Render → Blueprint empreende+ → Manual sync
```

Depois confira:

```text
empreende-api → Events/Logs → Deploy live
empreende-frontend → Events/Logs → Deploy live
```

Teste a API:

```text
https://empreende-api.onrender.com/api/health
```

A variável `RESET_DEMO_PROGRESS=true` está no `render.yaml` para zerar o usuário demo a cada deploy. Isso ajuda a apresentação começar com progresso 0%. Se quiser preservar respostas do usuário demo em deploys futuros, altere para:

```yaml
- key: RESET_DEMO_PROGRESS
  value: 'false'
```
