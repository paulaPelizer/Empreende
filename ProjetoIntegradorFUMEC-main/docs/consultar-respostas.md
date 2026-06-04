# Como consultar as respostas das atividades

As respostas das atividades ficam salvas no PostgreSQL, na tabela:

```sql
module_activity_responses
```

Cada registro guarda:

- `user_id`: usuário que respondeu;
- `module_id`: módulo da jornada;
- `step_key`: atividade do módulo (`avaliacao1` ou `avaliacao2`);
- `form_values`: respostas em JSON;
- `checks`: checklist marcado em JSON;
- `submitted`: indica se foi apenas rascunho ou envio final;
- `created_at` e `updated_at`.

## Pelo próprio sistema

No menu lateral, abra:

```text
Minhas Respostas
```

Essa tela chama a rota autenticada:

```http
GET /api/jornada/responses
```

## Pelo banco no Render

No Render:

```text
Dashboard → empreende-db → Connect
```

Use o cliente SQL do próprio Render, se disponível, ou copie a string de conexão para DBeaver, TablePlus, Beekeeper Studio ou psql.

Consulta útil:

```sql
SELECT
  u.email,
  m.module_order,
  m.title AS modulo,
  ms.label AS atividade,
  mar.submitted,
  mar.form_values,
  mar.checks,
  mar.updated_at
FROM module_activity_responses mar
JOIN users u ON u.id = mar.user_id
JOIN modules m ON m.id = mar.module_id
LEFT JOIN module_steps ms
  ON ms.module_id = mar.module_id
 AND ms.step_key = mar.step_key
ORDER BY mar.updated_at DESC;
```

Para ver apenas respostas enviadas, não rascunhos:

```sql
SELECT
  u.email,
  m.title AS modulo,
  ms.label AS atividade,
  mar.form_values,
  mar.updated_at
FROM module_activity_responses mar
JOIN users u ON u.id = mar.user_id
JOIN modules m ON m.id = mar.module_id
LEFT JOIN module_steps ms
  ON ms.module_id = mar.module_id
 AND ms.step_key = mar.step_key
WHERE mar.submitted = true
ORDER BY mar.updated_at DESC;
```

## Tabelas principais de progresso

```text
user_step_progress          → etapas concluídas: vídeo, atividade 1, PDF, atividade 2
module_activity_responses   → respostas e checklists das atividades
modules                     → módulos da jornada
module_steps                → etapas e conteúdo pedagógico de cada módulo
```
