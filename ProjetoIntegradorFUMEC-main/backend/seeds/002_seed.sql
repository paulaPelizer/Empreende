BEGIN;
INSERT INTO modules (
  module_order,
  title,
  description,
  sector,
  subtitle,
  video_title,
  video_url,
  pdf_title,
  pdf_url,
  duration_minutes,
  is_active
) VALUES
  
  (
  6,
  'Controle financeiro e operacional com Excel',
  'Aprenda a utilizar planilhas para acompanhar receitas, despesas, estoque, custos de produção e resultados do negócio.',
  'Excel aplicado à gestão de pequenos negócios de alimentos',
  'Desenvolva controles simples para monitorar o fluxo de caixa, calcular custos, registrar vendas e apoiar decisões que contribuam para a sustentabilidade e o crescimento do empreendimento.',
  'Planilha de Controle de Contas a Receber? - Sebrae Talks',
  'https://www.youtube.com/watch?v=zDy8nB8JwSI&list=PLsYLe6nbpei7AIpBsoVIkydFWFXGesuqe&index=10',
  'Informática – Excel básico - Escola de Governo do Distrito Federal',
  'https://egov.df.gov.br/wp-content/uploads/2023/07/Apostila.pdf',
  120,
  true
  )
ON CONFLICT (module_order) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sector = EXCLUDED.sector,
  subtitle = EXCLUDED.subtitle,
  video_title = EXCLUDED.video_title,
  video_url = EXCLUDED.video_url,
  pdf_title = EXCLUDED.pdf_title,
  pdf_url = EXCLUDED.pdf_url,
  duration_minutes = EXCLUDED.duration_minutes,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Mantém apenas os cinco módulos oficiais da jornada.
UPDATE modules SET is_active = false WHERE module_order NOT IN (6);

-- Remove etapas antigas dos módulos oficiais antes de recriar a trilha atualizada.
DELETE FROM module_steps WHERE module_id IN (SELECT id FROM modules WHERE module_order IN (6));

-- Módulo 6: Gestão do negócio com Excel

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'video', 'Vídeo', 'Utilize o Excel para controlar seu negócio', 'video', 1,
$$ {
  "objectives": [
    "Entender como planilhas podem apoiar a gestão de um pequeno negócio.",
    "Identificar quais informações devem ser registradas para acompanhar resultados.",
    "Conhecer controles básicos de caixa, estoque, vendas e custos."
  ]
} $$::jsonb FROM modules WHERE module_order = 6
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;


INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'avaliacao1', 'Atividade 1', 'Planejamento dos controles da empresa', 'activity', 2,
$$ {
  "title": "Atividade prática 1: definindo os controles da empresa",
  "description": "Antes de criar planilhas, é importante saber quais informações precisam ser acompanhadas. Pense nos dados que ajudam você a entender se o negócio está funcionando bem.",
  "fields": [
    {
      "key": "informacoes_financeiras",
      "label": "Informações financeiras que precisam ser controladas",
      "placeholder": "Ex.: vendas diárias, despesas, compras de ingredientes, contas a pagar..."
    },
    {
      "key": "informacoes_operacionais",
      "label": "Informações operacionais que precisam ser controladas",
      "placeholder": "Ex.: estoque, produção diária, pedidos, entregas..."
    },
    {
      "key": "maior_dificuldade",
      "label": "Maior dificuldade atual na gestão",
      "placeholder": "Ex.: não saber o lucro, perder o controle do estoque, esquecer pagamentos..."
    },
    {
      "key": "planilhas_necessarias",
      "label": "Quais planilhas seriam mais úteis?",
      "placeholder": "Ex.: fluxo de caixa, controle de estoque, vendas por produto, controle de clientes..."
    }
  ],
  "checklist": [
    "As principais informações do negócio foram identificadas?",
    "Os controles escolhidos ajudam na tomada de decisão?",
    "As dificuldades atuais foram consideradas?",
    "As planilhas propostas fazem sentido para o porte do negócio?"
  ],
  "submitLabel": "Enviar atividade e avançar"
} $$::jsonb FROM modules WHERE module_order = 6
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;


INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'pdf', 'Material', 'Modelos de planilhas de gestão', 'pdf', 3,
$$ {
  "instructions": [
    "Analise os modelos de planilhas apresentados no material.",
    "Observe quais informações são registradas em cada controle.",
    "Identifique quais modelos podem ser adaptados para sua realidade.",
    "Faça anotações para utilizar na atividade final."
  ]
} $$::jsonb FROM modules WHERE module_order = 6
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;


INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'avaliacao2', 'Atividade 2', 'Estrutura de gestão em Excel', 'activity', 4,
$$ {
  "title": "Atividade prática 2: montando sua estrutura de gestão",
  "description": "Planeje como você utilizaria o Excel para acompanhar a saúde financeira e operacional do negócio. O objetivo é criar uma rotina simples e sustentável de gestão.",
  "fields": [
    {
      "key": "controle_caixa",
      "label": "Como será feito o controle de caixa?",
      "placeholder": "Explique quais entradas e saídas serão registradas diariamente."
    },
    {
      "key": "controle_estoque",
      "label": "Como será feito o controle de estoque?",
      "placeholder": "Quais produtos ou insumos serão acompanhados e com qual frequência?"
    },
    {
      "key": "indicadores",
      "label": "Indicadores que deseja acompanhar",
      "placeholder": "Ex.: faturamento mensal, lucro, ticket médio, produtos mais vendidos..."
    },
    {
      "key": "rotina_atualizacao",
      "label": "Rotina de atualização das planilhas",
      "placeholder": "Quem irá atualizar? Com que frequência? Diariamente, semanalmente ou mensalmente?"
    }
  ],
  "checklist": [
    "A proposta contempla o controle financeiro do negócio?",
    "Existe um método para acompanhar o estoque?",
    "Os indicadores escolhidos ajudam na tomada de decisão?",
    "A rotina de atualização é realista e pode ser mantida?"
  ],
  "submitLabel": "Finalizar módulo"
} $$::jsonb FROM modules WHERE module_order = 6
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;


SELECT setval('users_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM users), 1), 1), true);
SELECT setval('modules_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM modules), 1), 1), true);
SELECT setval('mentors_id_seq', GREATEST((SELECT MAX(id) FROM mentors), 1), true);

COMMIT;
