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
    1,
    'Sobre a empresa: missão, visão e valores',
    'Construa a identidade estratégica do negócio de alimentos, conectando propósito, futuro desejado, valores e forma de atendimento.',
    'Empreendedorismo e pequenos negócios de alimentos',
    'Defina o que a empresa faz, onde quer chegar e quais princípios orientam atendimento, produção, qualidade e relação com clientes.',
    'O que são a Visão, Missão e os Valores de uma empresa - Sebrae Talks',
    'https://www.youtube.com/embed/EfKT92XtJlA',
    'Ferramenta Sebrae: Missão, Visão e Valores',
    'https://www.sebrae.com.br/Sebrae/Portal%20Sebrae/Anexos/ME_Missao-Visao-Valores.PDF',
    120,
    true
  ),
  (
    2,
    'Análise de mercado',
    'Observe clientes, concorrentes, território, preço, hábitos de consumo e oportunidades para posicionar melhor o negócio.',
    'Mercado local, alimentos e comportamento do consumidor',
    'Mapeie quem compra, onde compra, por que compra e quais alternativas existem no entorno ou no digital.',
    'Como analisar a concorrência em 5 passos simples - Sebrae PR',
    'https://www.youtube.com/embed/lvMnb6lO42k',
    'Sebrae: Como elaborar uma pesquisa de mercado',
    'https://www.sebrae.com.br/Sebrae/Portal%20Sebrae/UFs/MG/Sebrae%20de%20A%20a%20Z/Como%2BElaborar%2Buma%2BPesquisa%2Bde%2BMercado.pdf',
    120,
    true
  ),
  (
    3,
    'Modelo de negócio',
    'Organize proposta de valor, canais, receitas, recursos, parcerias e custos em um mapa visual simples e validável.',
    'Canvas, proposta de valor e validação',
    'Transforme a ideia em uma estrutura de funcionamento, com blocos visuais e um plano 5W2H para testar o próximo passo.',
    'Sebrae Canvas: crie o seu modelo de negócios',
    'https://www.youtube.com/embed/fkxRC0_x48E',
    'Sebrae: Canvas - Modelo de Negócios',
    'https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/e0660b16874d7be9b1628ea138e4cc1c/%24File/30595.pdf',
    120,
    true
  ),
  (
    4,
    'Letramento digital e perspectivas para seu negócio',
    'Adapte ferramentas digitais ao ramo de alimentos, considerando delivery, cardápio digital, presença local, atendimento e segurança de dados.',
    'Letramento digital aplicado a alimentos',
    'Escolha usos digitais simples e coerentes com o perfil do cliente: divulgação, pedidos, fotos, cardápio, avaliações, delivery e relacionamento.',
    'Transformação Digital Para Pequenos Negócios - Connect Sebrae',
    'https://www.youtube.com/embed/MJ2fWDLBtjU',
    'Sebrae PR: passo a passo para um delivery de sucesso',
    'https://api.pr.sebrae.com.br/storage/comunidade/anexos/13880/PUB_%20Fast%20Track%20de%20Intelig%C3%AAncia%20-%20Passo%20a%20Passo%20para%20um%20Delivery%20de%20Sucesso%20-%2018052023.pdf',
    120,
    true
  ),
  (
    5,
    'Ferramentas digitais para administração e comunicação',
    'Monte uma rotina simples de gestão usando planilhas, controles de estoque, caixa, pedidos, WhatsApp Business e registros de atendimento.',
    'Ferramentas de gestão para pequenos negócios',
    'Estruture controles mínimos para administrar uma pequena empresa de alimentos sem complicar: Excel/Sheets, estoque, vendas, clientes e comunicação.',
    'Controle de estoque: aprenda a controlar seu estoque de maneira simples - Sebrae PR',
    'https://www.youtube.com/embed/5Anr9ipqzbc',
    'Sebrae: ideia de negócio Churrasquinho - gestão, planilhas e automação',
    'https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/IDEIAS_DE_NEGOCIO/PDFS/ideia-de-negocio_churrasquinho.pdf',
    120,
    true
  ),
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
UPDATE modules SET is_active = false WHERE module_order NOT IN (1, 2, 3, 4, 5, 6);

-- Remove etapas antigas dos módulos oficiais antes de recriar a trilha atualizada.
DELETE FROM module_steps WHERE module_id IN (SELECT id FROM modules WHERE module_order IN (1, 2, 3, 4, 5, 6));

-- Módulo 1: Sobre a empresa: missão, visão e valores
INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'video', 'Vídeo', 'Entenda missão, visão e valores', 'video', 1,
$$ {
  "objectives": [
    "Diferenciar missão, visão e valores sem deixar os conceitos abstratos.",
    "Aplicar os conceitos a uma empresa pequena do ramo de alimentos.",
    "Preparar uma primeira versão da identidade estratégica do negócio."
  ]
} $$::jsonb FROM modules WHERE module_order = 1
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'avaliacao1', 'Atividade 1', 'Primeira versão da identidade', 'activity', 2,
$$ {
  "title": "Atividade prática 1: primeira versão da identidade da empresa",
  "description": "Escreva uma primeira versão simples da missão, visão e valores. Pense em uma empresa pequena de alimentos: o que ela entrega, para quem, com que cuidado e com qual sonho de futuro?",
  "fields": [
    {
      "key": "nome_negocio",
      "label": "Nome ou ideia do negócio",
      "placeholder": "Ex.: Bolos da Dona Ana, marmitas saudáveis, confeitaria artesanal, lanches de bairro..."
    },
    {
      "key": "missao",
      "label": "Missão",
      "placeholder": "O que a empresa faz, para quem e que valor entrega no dia a dia?"
    },
    {
      "key": "visao",
      "label": "Visão",
      "placeholder": "Onde você quer que o negócio esteja em 1 a 3 anos?"
    },
    {
      "key": "valores",
      "label": "Valores",
      "placeholder": "Liste de 3 a 5 princípios: qualidade, higiene, pontualidade, acolhimento, preço justo..."
    }
  ],
  "checklist": [
    "A missão explica claramente o que a empresa faz?",
    "A visão apresenta um futuro possível de alcançar?",
    "Os valores orientam decisões e comportamentos da empresa?",
    "O texto está simples e coerente com um negócio de alimentos?"
  ],
  "submitLabel": "Enviar atividade e avançar"
} $$::jsonb FROM modules WHERE module_order = 1
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'pdf', 'Material', 'Use o roteiro de apoio', 'pdf', 3,
$$ {
  "instructions": [
    "Abra o material de apoio e compare com sua primeira versão.",
    "Veja se missão, visão e valores estão escritos com linguagem simples.",
    "Anote melhorias para a versão final do módulo."
  ]
} $$::jsonb FROM modules WHERE module_order = 1
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'avaliacao2', 'Atividade 2', 'Versão final e tom de atendimento', 'activity', 4,
$$ {
  "title": "Atividade prática 2: identidade final e jeito de atender",
  "description": "Revise a identidade da empresa e conecte os valores ao atendimento. Para alimentos, a experiência envolve sabor, confiança, higiene, entrega, preço e relação com o cliente.",
  "fields": [
    {
      "key": "missao_final",
      "label": "Missão revisada",
      "placeholder": "Reescreva a missão de forma mais clara e direta."
    },
    {
      "key": "visao_final",
      "label": "Visão revisada",
      "placeholder": "Reescreva a visão com prazo e direção."
    },
    {
      "key": "valores_final",
      "label": "Valores revisados",
      "placeholder": "Liste valores e explique rapidamente o que cada um significa na prática."
    },
    {
      "key": "tom_atendimento",
      "label": "Tom de atendimento",
      "placeholder": "Como a empresa deve falar com clientes? Ex.: acolhedor, rápido, caseiro, profissional, divertido..."
    }
  ],
  "checklist": [
    "A versão final está melhor que a primeira?",
    "Os valores aparecem na prática do atendimento?",
    "O tom de comunicação combina com o público?",
    "A identidade ajudaria alguém a entender a empresa rapidamente?"
  ],
  "submitLabel": "Finalizar módulo"
} $$::jsonb FROM modules WHERE module_order = 1
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

-- Módulo 2: Análise de mercado
INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'video', 'Vídeo', 'Analise clientes e concorrentes', 'video', 1,
$$ {
  "objectives": [
    "Entender por que observar concorrentes ajuda a posicionar o negócio.",
    "Identificar critérios simples de comparação no ramo de alimentos.",
    "Preparar um mapa de mercado local e digital."
  ]
} $$::jsonb FROM modules WHERE module_order = 2
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'avaliacao1', 'Atividade 1', 'Mapa de clientes e concorrentes', 'activity', 2,
$$ {
  "title": "Atividade prática 1: mapa de mercado para alimentos",
  "description": "Observe o mercado como se estivesse montando um mural: clientes, concorrentes, preços, canais e oportunidades. Use respostas curtas, como post-its.",
  "fields": [
    {
      "key": "cliente_principal",
      "label": "Cliente principal",
      "placeholder": "Quem compra? Trabalhadores do bairro, estudantes, famílias, pessoas que pedem delivery, eventos..."
    },
    {
      "key": "necessidades",
      "label": "Necessidades e dores do cliente",
      "placeholder": "Rapidez, preço, comida saudável, porção maior, entrega, variedade, confiança, higiene..."
    },
    {
      "key": "concorrentes",
      "label": "Concorrentes diretos e indiretos",
      "placeholder": "Liste negócios parecidos e substitutos: padarias, marmitarias, apps, mercados, vendedores locais..."
    },
    {
      "key": "diferenciais_observados",
      "label": "O que os concorrentes fazem bem?",
      "placeholder": "Atendimento, preço, embalagem, Instagram, entrega, cardápio, promoções..."
    }
  ],
  "checklist": [
    "O cliente principal está definido?",
    "Foram listados concorrentes diretos e indiretos?",
    "A análise considera preço, canal e atendimento?",
    "Existe pelo menos uma oportunidade percebida?"
  ],
  "submitLabel": "Enviar atividade e avançar"
} $$::jsonb FROM modules WHERE module_order = 2
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'pdf', 'Material', 'Pesquisa de mercado', 'pdf', 3,
$$ {
  "instructions": [
    "Leia o roteiro de pesquisa de mercado.",
    "Escolha 3 perguntas que você faria a clientes reais.",
    "Use o material para melhorar sua análise antes da atividade final."
  ]
} $$::jsonb FROM modules WHERE module_order = 2
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'avaliacao2', 'Atividade 2', 'Mini pesquisa e oportunidade', 'activity', 4,
$$ {
  "title": "Atividade prática 2: mini pesquisa e oportunidade de mercado",
  "description": "Planeje uma pesquisa simples para validar uma oportunidade. A ideia é sair do achismo e coletar sinais reais do público.",
  "fields": [
    {
      "key": "perguntas_pesquisa",
      "label": "3 perguntas para clientes",
      "placeholder": "Ex.: Com que frequência você compra marmita? Quanto costuma pagar? O que faria você comprar de novo?"
    },
    {
      "key": "onde_pesquisar",
      "label": "Onde pesquisar?",
      "placeholder": "WhatsApp, formulário, porta da escola, vizinhos, clientes atuais, Instagram, ponto de venda..."
    },
    {
      "key": "oportunidade",
      "label": "Oportunidade identificada",
      "placeholder": "Que espaço existe no mercado? Ex.: combo almoço, entrega rápida, produto saudável, encomendas..."
    },
    {
      "key": "hipotese_teste",
      "label": "Hipótese para testar",
      "placeholder": "Ex.: Se eu oferecer combo semanal com entrega, clientes do bairro podem comprar com recorrência."
    }
  ],
  "checklist": [
    "As perguntas são simples de aplicar?",
    "A oportunidade nasce da análise, não só da intuição?",
    "A hipótese pode ser testada em pequena escala?",
    "A resposta considera clientes e concorrentes?"
  ],
  "submitLabel": "Finalizar módulo"
} $$::jsonb FROM modules WHERE module_order = 2
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

-- Módulo 3: Modelo de negócio
INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'video', 'Vídeo', 'Conheça o Canvas', 'video', 1,
$$ {
  "objectives": [
    "Entender o modelo de negócio como mapa visual.",
    "Relacionar proposta de valor, clientes, canais e receita.",
    "Preparar um plano de ação simples para testar o modelo."
  ]
} $$::jsonb FROM modules WHERE module_order = 3
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'avaliacao1', 'Atividade 1', 'Canvas enxuto', 'activity', 2,
$$ {
  "title": "Atividade prática 1: Canvas enxuto em post-its",
  "description": "Preencha os blocos essenciais do modelo de negócio com frases curtas, como se fossem post-its digitais.",
  "fields": [
    {
      "key": "segmento_clientes",
      "label": "Segmento de clientes",
      "placeholder": "Quem você atende primeiro?"
    },
    {
      "key": "proposta_valor",
      "label": "Proposta de valor",
      "placeholder": "Que problema você resolve ou que benefício entrega?"
    },
    {
      "key": "canais",
      "label": "Canais",
      "placeholder": "Como o cliente conhece, compra e recebe? Loja, WhatsApp, Instagram, delivery, encomenda..."
    },
    {
      "key": "receitas",
      "label": "Fontes de receita",
      "placeholder": "Venda direta, combos, encomendas, assinatura semanal, eventos..."
    },
    {
      "key": "custos_recursos",
      "label": "Custos e recursos principais",
      "placeholder": "Insumos, embalagens, gás, transporte, mão de obra, equipamentos, divulgação..."
    }
  ],
  "checklist": [
    "O cliente principal está claro?",
    "A proposta de valor resolve uma necessidade concreta?",
    "Os canais são viáveis para o início do negócio?",
    "Receitas, custos e recursos estão coerentes?"
  ],
  "submitLabel": "Enviar atividade e avançar"
} $$::jsonb FROM modules WHERE module_order = 3
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'pdf', 'Material', 'Apoio para Canvas', 'pdf', 3,
$$ {
  "instructions": [
    "Leia o material sobre Canvas.",
    "Compare seus blocos com os blocos do modelo de negócio.",
    "Escolha uma ação pequena para validar o modelo."
  ]
} $$::jsonb FROM modules WHERE module_order = 3
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'avaliacao2', 'Atividade 2', '5W2H visual do próximo teste', 'activity', 4,
$$ {
  "title": "Atividade prática 2: 5W2H visual do próximo teste",
  "description": "Transforme o Canvas em um plano de ação pequeno. Pense em cada campo como uma colagem de post-its: curto, visual e acionável.",
  "fields": [
    {
      "key": "what",
      "label": "O quê?",
      "placeholder": "Qual ação ou teste será feito?"
    },
    {
      "key": "why",
      "label": "Por quê?",
      "placeholder": "Por que esse teste importa para o negócio?"
    },
    {
      "key": "who",
      "label": "Quem?",
      "placeholder": "Quem executa e quem participa?"
    },
    {
      "key": "where",
      "label": "Onde?",
      "placeholder": "Em qual canal, bairro, loja, rede social ou ambiente?"
    },
    {
      "key": "when",
      "label": "Quando?",
      "placeholder": "Em que data ou semana?"
    },
    {
      "key": "how",
      "label": "Como?",
      "placeholder": "Como a ação será feita na prática?"
    },
    {
      "key": "how_much",
      "label": "Quanto custa?",
      "placeholder": "Tempo, dinheiro, materiais ou pessoas necessárias."
    },
    {
      "key": "colagens",
      "label": "Colagens/ideias visuais",
      "placeholder": "Liste imagens, palavras, prints, referências ou materiais que representam o teste."
    }
  ],
  "checklist": [
    "O plano cabe em uma ação pequena e testável?",
    "As sete perguntas do 5W2H foram respondidas?",
    "O custo ou esforço foi considerado?",
    "A ação conecta Canvas, cliente e proposta de valor?"
  ],
  "submitLabel": "Finalizar módulo"
} $$::jsonb FROM modules WHERE module_order = 3
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

-- Módulo 4: Letramento digital e perspectivas para seu negócio
INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'video', 'Vídeo', 'Transformação digital para alimentos', 'video', 1,
$$ {
  "objectives": [
    "Perceber tecnologia como apoio ao negócio, não como fim em si mesma.",
    "Relacionar digitalização a delivery, cardápio, atendimento, fotos, avaliações e presença local.",
    "Escolher ferramentas acessíveis para o perfil da empresa e dos clientes."
  ]
} $$::jsonb FROM modules WHERE module_order = 4
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'avaliacao1', 'Atividade 1', 'Diagnóstico digital do negócio', 'activity', 2,
$$ {
  "title": "Atividade prática 1: diagnóstico digital para alimentos",
  "description": "Mapeie como o negócio de alimentos aparece, vende e se comunica no digital. Pense em celular, WhatsApp, Instagram, Google, delivery e cardápio.",
  "fields": [
    {
      "key": "canais_atuais",
      "label": "Canais atuais ou desejados",
      "placeholder": "WhatsApp, Instagram, Google Perfil da Empresa, iFood, cardápio digital, QR Code, formulário..."
    },
    {
      "key": "jornada_pedido",
      "label": "Como o pedido acontece hoje?",
      "placeholder": "Cliente pergunta cardápio, escolhe, paga, retira/recebe, avalia... descreva o caminho."
    },
    {
      "key": "dificuldade_digital",
      "label": "Maior dificuldade digital",
      "placeholder": "Fotos, responder rápido, controlar pedidos, atualizar cardápio, receber pagamento, entrega, avaliações..."
    },
    {
      "key": "risco_cuidado",
      "label": "Cuidado necessário",
      "placeholder": "Dados de clientes, senhas, golpes, autorização de imagem, informações de alergênicos, higiene e confiança..."
    }
  ],
  "checklist": [
    "O diagnóstico considera o caminho real do pedido?",
    "Os canais fazem sentido para o público?",
    "Há uma dificuldade digital principal definida?",
    "O cuidado com dados, segurança ou confiança foi considerado?"
  ],
  "submitLabel": "Enviar atividade e avançar"
} $$::jsonb FROM modules WHERE module_order = 4
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'pdf', 'Material', 'Delivery e vendas digitais', 'pdf', 3,
$$ {
  "instructions": [
    "Leia o material sobre delivery e observe o que se aplica ao seu tipo de alimento.",
    "Escolha uma melhoria digital possível sem grande investimento.",
    "Prepare uma ação curta para testar com clientes reais."
  ]
} $$::jsonb FROM modules WHERE module_order = 4
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'avaliacao2', 'Atividade 2', 'Plano digital de 7 dias', 'activity', 4,
$$ {
  "title": "Atividade prática 2: plano digital de 7 dias para alimentos",
  "description": "Transforme o diagnóstico em um plano simples: uma ação digital, um canal, um indicador e um cuidado de segurança/comunicação.",
  "fields": [
    {
      "key": "objetivo_digital",
      "label": "Objetivo digital",
      "placeholder": "Ex.: divulgar cardápio, reduzir erros nos pedidos, receber encomendas, melhorar fotos, aumentar avaliações..."
    },
    {
      "key": "acao_semana",
      "label": "Ação da semana",
      "placeholder": "Ex.: criar cardápio no WhatsApp Business, postar 3 fotos, cadastrar no Google, montar formulário de encomenda..."
    },
    {
      "key": "publico_canal",
      "label": "Público e canal",
      "placeholder": "Para quem será a ação e em qual canal? Ex.: clientes do bairro pelo WhatsApp."
    },
    {
      "key": "indicador",
      "label": "Como acompanhar?",
      "placeholder": "Número de pedidos, mensagens respondidas, visualizações, avaliações, clientes cadastrados, taxa de recompra..."
    },
    {
      "key": "cuidado_dados",
      "label": "Cuidado com dados e confiança",
      "placeholder": "Como proteger telefone, endereço, pedidos, pagamentos, fotos e informações sensíveis?"
    }
  ],
  "checklist": [
    "O plano cabe em uma semana?",
    "A ação é adequada para uma pequena empresa de alimentos?",
    "O indicador mostra se houve melhora?",
    "Existe cuidado explícito com dados, segurança ou comunicação?"
  ],
  "submitLabel": "Finalizar módulo"
} $$::jsonb FROM modules WHERE module_order = 4
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

-- Módulo 5: Ferramentas digitais para administração e comunicação
INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'video', 'Vídeo', 'Controle de estoque e rotina administrativa', 'video', 1,
$$ {
  "objectives": [
    "Entender por que controles simples evitam perda de dinheiro e desperdício.",
    "Relacionar estoque, compras, produção, vendas e caixa no ramo de alimentos.",
    "Escolher uma rotina mínima de planilhas e registros para começar."
  ]
} $$::jsonb FROM modules WHERE module_order = 5
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'avaliacao1', 'Atividade 1', 'Mapa de controles essenciais', 'activity', 2,
$$ {
  "title": "Atividade prática 1: mapa de controles essenciais",
  "description": "Liste quais informações precisam ser registradas para administrar e comunicar melhor o negócio. Pense em uma empresa pequena: simples, prático e constante.",
  "fields": [
    {
      "key": "controle_estoque",
      "label": "Controle de estoque/insumos",
      "placeholder": "Quais itens precisam ser acompanhados? Farinha, carnes, embalagens, bebidas, validade, lote..."
    },
    {
      "key": "controle_vendas",
      "label": "Controle de vendas e pedidos",
      "placeholder": "O que registrar? Data, cliente, produto, quantidade, valor, forma de pagamento, canal, entrega..."
    },
    {
      "key": "controle_financeiro",
      "label": "Controle financeiro básico",
      "placeholder": "Entradas, saídas, contas a pagar, contas a receber, lucro por produto, fluxo de caixa..."
    },
    {
      "key": "controle_comunicacao",
      "label": "Controle de comunicação",
      "placeholder": "Mensagens, reclamações, elogios, clientes recorrentes, respostas padrão, pós-venda..."
    }
  ],
  "checklist": [
    "Os controles escolhidos são realmente úteis para o negócio?",
    "A proposta cabe em planilha ou ferramenta simples?",
    "O controle ajuda a reduzir erro, desperdício ou esquecimento?",
    "A comunicação com clientes foi considerada?"
  ],
  "submitLabel": "Enviar atividade e avançar"
} $$::jsonb FROM modules WHERE module_order = 5
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'pdf', 'Material', 'Planilhas, gestão e automação simples', 'pdf', 3,
$$ {
  "instructions": [
    "Leia a seção de gestão/automação do material.",
    "Observe como planilhas e sistemas simples podem apoiar estoque, vendas, produção e clientes.",
    "Prepare um desenho mínimo de ferramenta para o seu negócio."
  ]
} $$::jsonb FROM modules WHERE module_order = 5
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position, content)
SELECT id, 'avaliacao2', 'Atividade 2', 'Protótipo de gestão em planilha', 'activity', 4,
$$ {
  "title": "Atividade prática 2: protótipo de planilha/sistema mínimo",
  "description": "Desenhe a estrutura de uma ferramenta simples para administrar o negócio. Pode ser Excel, Google Sheets, caderno digital ou um sistema futuro.",
  "fields": [
    {
      "key": "abas_planilha",
      "label": "Abas ou módulos da ferramenta",
      "placeholder": "Ex.: Produtos, Insumos, Estoque, Pedidos, Caixa, Clientes, Comunicação, Indicadores..."
    },
    {
      "key": "campos_principais",
      "label": "Campos principais",
      "placeholder": "Ex.: data, produto, quantidade, validade, custo, preço, cliente, status do pedido, forma de pagamento..."
    },
    {
      "key": "rotina_atualizacao",
      "label": "Rotina de atualização",
      "placeholder": "Quem atualiza? Quando? Todo dia, a cada pedido, semanalmente, no fechamento do caixa?"
    },
    {
      "key": "indicadores",
      "label": "Indicadores simples",
      "placeholder": "Ex.: produtos mais vendidos, estoque baixo, vendas da semana, lucro estimado, pedidos atrasados, clientes recorrentes..."
    },
    {
      "key": "ferramenta_escolhida",
      "label": "Ferramenta escolhida",
      "placeholder": "Excel, Google Sheets, WhatsApp Business, Google Agenda, Trello, sistema PDV/ERP simples... explique por quê."
    }
  ],
  "checklist": [
    "A ferramenta é simples para uma pequena empresa manter?",
    "Os campos ajudam a tomar decisão?",
    "A rotina de atualização está definida?",
    "Há conexão entre administração e comunicação com clientes?"
  ],
  "submitLabel": "Finalizar jornada"
} $$::jsonb FROM modules WHERE module_order = 5
ON CONFLICT (module_id, step_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  content_type = EXCLUDED.content_type,
  position = EXCLUDED.position,
  content = EXCLUDED.content;

INSERT INTO mentors (id, name, role, expertise, rating, total_sessions, avatar, bio)
VALUES (
  1,
  'Marina Costa',
  'Mentora de negócios',
  'Planejamento estratégico, validação, letramento digital, ferramentas digitais e pequenos negócios de alimentos',
  4.9,
  128,
  null,
  'Especialista em apoiar empreendedores na estruturação de modelos de negócio, posicionamento, validação inicial e uso simples de ferramentas digitais para gestão, comunicação e operação.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  expertise = EXCLUDED.expertise,
  rating = EXCLUDED.rating,
  total_sessions = EXCLUDED.total_sessions,
  avatar = EXCLUDED.avatar,
  bio = EXCLUDED.bio;

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
