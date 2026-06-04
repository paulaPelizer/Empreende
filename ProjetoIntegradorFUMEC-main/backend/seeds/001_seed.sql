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
    'Missão, visão e valores',
    'Construa a base estratégica da sua empresa a partir de propósito, futuro desejado e princípios de atuação.',
    'Empresas de alimentos / comércio de alimentos',
    'Construa a base estratégica da sua empresa a partir de propósito, futuro desejado e princípios de atuação.',
    'Como definir missão, visão e valores para empresas de alimentos',
    'https://www.youtube.com/embed/VIDEO_MODULO_1',
    'Guia prático: missão, visão e valores para empresas de alimentos',
    'https://storage.googleapis.com/SEU_BUCKET/materiais/modulo-1.pdf',
    120,
    true
  ),
  (
    2,
    'Análise de mercado',
    'Observe público, concorrentes e oportunidades para melhorar o posicionamento do negócio.',
    'Empresas de alimentos / comércio de alimentos',
    'Observe público, concorrentes e oportunidades para melhorar o posicionamento do negócio.',
    'Introdução à análise de mercado para pequenos negócios',
    'https://www.youtube.com/embed/VIDEO_MODULO_2',
    'Roteiro de análise de mercado e concorrência',
    'https://storage.googleapis.com/SEU_BUCKET/materiais/modulo-2.pdf',
    90,
    true
  ),
  (
    3,
    'Modelo de negócio',
    'Organize proposta de valor, canais, fontes de receita e relacionamento com clientes.',
    'Empresas de alimentos / comércio de alimentos',
    'Organize proposta de valor, canais, fontes de receita e relacionamento com clientes.',
    'Como estruturar um modelo de negócio simples e viável',
    'https://www.youtube.com/embed/VIDEO_MODULO_3',
    'Canvas aplicado ao comércio de alimentos',
    'https://storage.googleapis.com/SEU_BUCKET/materiais/modulo-3.pdf',
    90,
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

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position)
SELECT id, 'video', 'Vídeo', 'Assista à explicação inicial', 'video', 1 FROM modules
ON CONFLICT (module_id, step_key) DO UPDATE SET label = EXCLUDED.label, description = EXCLUDED.description, content_type = EXCLUDED.content_type, position = EXCLUDED.position;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position)
SELECT id, 'avaliacao1', 'Atividade 1', 'Produza sua primeira resposta', 'activity', 2 FROM modules
ON CONFLICT (module_id, step_key) DO UPDATE SET label = EXCLUDED.label, description = EXCLUDED.description, content_type = EXCLUDED.content_type, position = EXCLUDED.position;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position)
SELECT id, 'pdf', 'PDF', 'Consulte o material de apoio', 'pdf', 3 FROM modules
ON CONFLICT (module_id, step_key) DO UPDATE SET label = EXCLUDED.label, description = EXCLUDED.description, content_type = EXCLUDED.content_type, position = EXCLUDED.position;

INSERT INTO module_steps (module_id, step_key, label, description, content_type, position)
SELECT id, 'avaliacao2', 'Atividade 2', 'Revise e aperfeiçoe a resposta', 'activity', 4 FROM modules
ON CONFLICT (module_id, step_key) DO UPDATE SET label = EXCLUDED.label, description = EXCLUDED.description, content_type = EXCLUDED.content_type, position = EXCLUDED.position;

INSERT INTO mentors (id, name, role, expertise, rating, total_sessions, avatar, bio)
VALUES (
  1,
  'Marina Costa',
  'Mentora de negócios',
  'Planejamento estratégico, validação e pequenos negócios',
  4.9,
  128,
  null,
  'Especialista em apoiar empreendedores na estruturação de modelos de negócio, posicionamento e validação inicial.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  expertise = EXCLUDED.expertise,
  rating = EXCLUDED.rating,
  total_sessions = EXCLUDED.total_sessions,
  avatar = EXCLUDED.avatar,
  bio = EXCLUDED.bio;

-- Usuário demo é criado pelo script backend/scripts/seed.js, para gerar hash de senha com bcryptjs.

SELECT setval('users_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM users), 1), 1), true);
SELECT setval('mentors_id_seq', GREATEST((SELECT MAX(id) FROM mentors), 1), true);

COMMIT;
