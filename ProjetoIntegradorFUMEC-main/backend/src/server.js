import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, transaction } from './db.js';
import { requireAuth } from './middleware/auth.js';
import { asyncHandler } from './utils/asyncHandler.js';
import {
  toDiscussion,
  toMentor,
  toModule,
  toModuleContent,
  toSession,
  toUser,
} from './utils/formatters.js';

const app = express();
const PORT = Number(process.env.PORT ?? 8080);
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET precisa estar definido no .env.');
}

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error(`Origem bloqueada por CORS: ${origin}`));
    },
    credentials: true,
  }),
);

function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  });
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

async function ensureUserSettings(userId) {
  await query(
    `INSERT INTO notification_settings (user_id)
     VALUES ($1)
     ON CONFLICT (user_id) DO NOTHING`,
    [userId],
  );
  await query(
    `INSERT INTO preference_settings (user_id)
     VALUES ($1)
     ON CONFLICT (user_id) DO NOTHING`,
    [userId],
  );
}

async function getModulesForUser(userId) {
  const { rows } = await query(
    `SELECT
       m.*,
       COUNT(ms.id)::int AS lessons,
       COALESCE(COUNT(usp.id), 0)::int AS completed_lessons,
       CASE WHEN m.module_order > 1 AND COALESCE(prev.completed_count, 0) < COALESCE(prev.total_count, 1)
            THEN false ELSE false END AS is_locked,
       CASE WHEN COUNT(ms.id) = 0 THEN 0
            ELSE ROUND((COALESCE(COUNT(usp.id), 0)::numeric / COUNT(ms.id)::numeric) * 100)::int
       END AS progress,
       CONCAT(CEIL(m.duration_minutes::numeric / 60), 'h') AS duration
     FROM modules m
     LEFT JOIN module_steps ms ON ms.module_id = m.id
     LEFT JOIN user_step_progress usp
       ON usp.module_id = m.id
      AND usp.step_key = ms.step_key
      AND usp.user_id = $1
     LEFT JOIN LATERAL (
       SELECT
         COUNT(ms2.id)::int AS total_count,
         COUNT(usp2.id)::int AS completed_count
       FROM modules m2
       LEFT JOIN module_steps ms2 ON ms2.module_id = m2.id
       LEFT JOIN user_step_progress usp2
         ON usp2.module_id = m2.id
        AND usp2.step_key = ms2.step_key
        AND usp2.user_id = $1
       WHERE m2.module_order = m.module_order - 1
     ) prev ON true
     WHERE m.is_active = true
     GROUP BY m.id, prev.completed_count, prev.total_count
     ORDER BY m.module_order`,
    [userId],
  );

  return rows.map(toModule);
}

async function getModuleRowForUser(userId, moduleId) {
  const { rows } = await query(
    `SELECT
       m.*,
       COUNT(ms.id)::int AS lessons,
       COALESCE(COUNT(usp.id), 0)::int AS completed_lessons,
       false AS is_locked,
       CASE WHEN COUNT(ms.id) = 0 THEN 0
            ELSE ROUND((COALESCE(COUNT(usp.id), 0)::numeric / COUNT(ms.id)::numeric) * 100)::int
       END AS progress,
       CONCAT(CEIL(m.duration_minutes::numeric / 60), 'h') AS duration
     FROM modules m
     LEFT JOIN module_steps ms ON ms.module_id = m.id
     LEFT JOIN user_step_progress usp
       ON usp.module_id = m.id
      AND usp.step_key = ms.step_key
      AND usp.user_id = $1
     WHERE m.id = $2 AND m.is_active = true
     GROUP BY m.id`,
    [userId, moduleId],
  );
  return rows[0];
}

app.get('/api/health', asyncHandler(async (_req, res) => {
  await query('SELECT 1');
  res.json({ status: 'ok', database: 'connected' });
}));

app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');
  const name = String(req.body.name || email.split('@')[0] || 'Usuário').trim();

  if (!email || !password) {
    return res.status(422).json({ message: 'E-mail e senha são obrigatórios.' });
  }
  if (password.length < 6) {
    return res.status(422).json({ message: 'A senha precisa ter pelo menos 6 caracteres.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await transaction(async (client) => {
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows[0]) {
      const error = new Error('E-mail já cadastrado.');
      error.statusCode = 409;
      throw error;
    }

    const { rows } = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, passwordHash],
    );

    await client.query('INSERT INTO notification_settings (user_id) VALUES ($1)', [rows[0].id]);
    await client.query('INSERT INTO preference_settings (user_id) VALUES ($1)', [rows[0].id]);

    return toUser(rows[0]);
  });

  res.status(201).json({ message: 'Cadastro criado com sucesso.', user, token: signToken(user.id) });
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  const userRow = rows[0];

  if (!userRow || !(await bcrypt.compare(password, userRow.password_hash))) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
  }

  await ensureUserSettings(userRow.id);
  const user = toUser(userRow);
  res.json({ message: 'Login realizado com sucesso.', user, token: signToken(user.id) });
}));

app.post('/api/auth/logout', requireAuth, (_req, res) => {
  res.json({ message: 'Logout realizado com sucesso.' });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

async function getDashboardData(userId) {
  const modules = await getModulesForUser(userId);
  const completedLessons = modules.reduce((sum, item) => sum + item.completedLessons, 0);
  const totalLessons = modules.reduce((sum, item) => sum + item.lessons, 0);
  const completedModules = modules.filter((item) => item.progress >= 100).length;
  const totalProgress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const { rows: upcomingRows } = await query(
    `SELECT COUNT(*)::int AS count FROM mentoring_sessions
     WHERE user_id = $1 AND status = 'scheduled' AND session_date >= CURRENT_DATE`,
    [userId],
  );

  const nextSteps = modules
    .filter((item) => item.progress < 100)
    .slice(0, 3)
    .map((item) => ({
      title: item.title,
      module: `Módulo ${item.id}`,
      progress: item.progress,
      duration: item.duration,
    }));

  const { rows: activityRows } = await query(
    `SELECT title, created_at, type
     FROM user_activities
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 6`,
    [userId],
  );

  const activities = activityRows.length
    ? activityRows.map((row) => ({
        title: row.title,
        time: row.created_at > new Date(Date.now() - 24 * 60 * 60 * 1000) ? 'hoje' : 'recente',
        type: row.type,
      }))
    : [
        { title: 'Conta criada na plataforma', time: 'hoje', type: 'new' },
        { title: 'Jornada empreendedora liberada', time: 'hoje', type: 'info' },
      ];

  return {
    stats: [
      { key: 'journey_progress', label: 'Progresso da jornada', value: `${totalProgress}%`, total: '100%', trend: '+12%' },
      { key: 'completed_modules', label: 'Módulos concluídos', value: String(completedModules), total: String(modules.length), trend: '+1' },
      { key: 'study_hours', label: 'Horas estimadas', value: String(Math.round(completedLessons * 0.5)), total: String(Math.round(totalLessons * 0.5)), trend: '+2h' },
      { key: 'mentoring_sessions', label: 'Mentorias agendadas', value: String(upcomingRows[0]?.count ?? 0), total: '4', trend: 'ativo' },
    ],
    nextSteps,
    activities,
  };
}

app.get('/api/dashboard', requireAuth, asyncHandler(async (req, res) => {
  res.json(await getDashboardData(req.user.id));
}));

app.get('/api/dashboard/stats', requireAuth, asyncHandler(async (req, res) => {
  const data = await getDashboardData(req.user.id);
  res.json({ stats: data.stats });
}));

app.get('/api/dashboard/activities', requireAuth, asyncHandler(async (req, res) => {
  const data = await getDashboardData(req.user.id);
  res.json({ activities: data.activities });
}));

app.get('/api/dashboard/next-steps', requireAuth, asyncHandler(async (req, res) => {
  const data = await getDashboardData(req.user.id);
  res.json({ nextSteps: data.nextSteps });
}));

app.get('/api/jornada', requireAuth, asyncHandler(async (req, res) => {
  const modules = await getModulesForUser(req.user.id);
  const completedLessons = modules.reduce((sum, item) => sum + item.completedLessons, 0);
  const totalLessons = modules.reduce((sum, item) => sum + item.lessons, 0);
  const completedModules = modules.filter((item) => item.progress >= 100).length;

  res.json({
    progress: {
      totalProgress: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0,
      completedModules,
      totalModules: modules.length,
      totalHours: Math.round(totalLessons * 0.5),
      completedLessons,
      totalLessons,
    },
    modules,
  });
}));

app.get('/api/jornada/modules', requireAuth, asyncHandler(async (req, res) => {
  res.json({ modules: await getModulesForUser(req.user.id) });
}));

app.get('/api/jornada/modules/:id', requireAuth, asyncHandler(async (req, res) => {
  const row = await getModuleRowForUser(req.user.id, Number(req.params.id));
  if (!row) return res.status(404).json({ message: 'Módulo não encontrado.' });
  res.json({ module: toModule(row) });
}));

app.get('/api/jornada/modules/:id/content', requireAuth, asyncHandler(async (req, res) => {
  const moduleId = Number(req.params.id);
  const row = await getModuleRowForUser(req.user.id, moduleId);
  if (!row) return res.status(404).json({ message: 'Módulo não encontrado.' });

  const { rows: stepRows } = await query(
    `SELECT step_key AS key, label, description, content_type AS "contentType", position
     FROM module_steps
     WHERE module_id = $1
     ORDER BY position`,
    [moduleId],
  );

  const { rows: activityRows } = await query(
    `SELECT step_key, form_values, checks, submitted, updated_at
     FROM module_activity_responses
     WHERE user_id = $1 AND module_id = $2
     ORDER BY updated_at DESC
     LIMIT 1`,
    [req.user.id, moduleId],
  );

  const activity = activityRows[0]
    ? {
        stepKey: activityRows[0].step_key,
        formValues: activityRows[0].form_values ?? {},
        checks: activityRows[0].checks ?? {},
        submitted: activityRows[0].submitted,
        updatedAt: activityRows[0].updated_at,
      }
    : null;

  res.json({ module: toModuleContent(row, stepRows, activity) });
}));

app.post('/api/jornada/modules/:id/complete', requireAuth, asyncHandler(async (req, res) => {
  const stepKey = req.body.step_key || req.body.lesson_id || 'video';
  await query(
    `INSERT INTO user_step_progress (user_id, module_id, step_key)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, module_id, step_key) DO NOTHING`,
    [req.user.id, Number(req.params.id), String(stepKey)],
  );
  await query(
    `INSERT INTO user_activities (user_id, title, type)
     VALUES ($1, $2, 'success')`,
    [req.user.id, `Etapa concluída no módulo ${req.params.id}`],
  );
  res.status(204).send();
}));

app.post('/api/jornada/modules/:id/complete-step', requireAuth, asyncHandler(async (req, res) => {
  const stepKey = String(req.body.stepKey || req.body.step_key || 'video');
  await query(
    `INSERT INTO user_step_progress (user_id, module_id, step_key)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, module_id, step_key) DO NOTHING`,
    [req.user.id, Number(req.params.id), stepKey],
  );
  res.json({ message: 'Etapa concluída.' });
}));

app.get('/api/jornada/modules/:id/activity', requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT step_key, form_values, checks, submitted, updated_at
     FROM module_activity_responses
     WHERE user_id = $1 AND module_id = $2
     ORDER BY updated_at DESC
     LIMIT 1`,
    [req.user.id, Number(req.params.id)],
  );
  res.json({ activity: rows[0] ?? null });
}));

app.put('/api/jornada/modules/:id/activity', requireAuth, asyncHandler(async (req, res) => {
  const moduleId = Number(req.params.id);
  const stepKey = String(req.body.stepKey || req.body.step_key || 'avaliacao1');
  const formValues = req.body.formValues || req.body.form_values || {};
  const checks = req.body.checks || {};
  const submitted = Boolean(req.body.submitted ?? false);

  const { rows } = await query(
    `INSERT INTO module_activity_responses (user_id, module_id, step_key, form_values, checks, submitted)
     VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6)
     ON CONFLICT (user_id, module_id, step_key)
     DO UPDATE SET form_values = EXCLUDED.form_values,
                   checks = EXCLUDED.checks,
                   submitted = EXCLUDED.submitted,
                   updated_at = now()
     RETURNING step_key, form_values, checks, submitted, updated_at`,
    [req.user.id, moduleId, stepKey, JSON.stringify(formValues), JSON.stringify(checks), submitted],
  );

  await query(
    `INSERT INTO user_activities (user_id, title, type)
     VALUES ($1, $2, 'success')`,
    [req.user.id, `Rascunho salvo no módulo ${moduleId}`],
  );

  res.json({
    activity: {
      stepKey: rows[0].step_key,
      formValues: rows[0].form_values,
      checks: rows[0].checks,
      submitted: rows[0].submitted,
      updatedAt: rows[0].updated_at,
    },
  });
}));

app.get('/api/mentoria', requireAuth, asyncHandler(async (req, res) => {
  const { rows: mentorRows } = await query('SELECT * FROM mentors ORDER BY id LIMIT 1');
  const mentor = toMentor(mentorRows[0]);

  const { rows: sessionRows } = await query(
    `SELECT * FROM mentoring_sessions WHERE user_id = $1 ORDER BY session_date, session_time`,
    [req.user.id],
  );

  res.json({
    mentor,
    upcomingSessions: sessionRows.filter((row) => row.status === 'scheduled').map(toSession),
    pastSessions: sessionRows.filter((row) => row.status !== 'scheduled').map(toSession),
  });
}));

app.get('/api/mentoria/mentor', requireAuth, asyncHandler(async (_req, res) => {
  const { rows } = await query('SELECT * FROM mentors ORDER BY id LIMIT 1');
  res.json({ mentor: toMentor(rows[0]) });
}));

app.get('/api/mentoria/sessions/upcoming', requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT * FROM mentoring_sessions WHERE user_id = $1 AND status = 'scheduled' ORDER BY session_date, session_time`,
    [req.user.id],
  );
  res.json({ sessions: rows.map(toSession) });
}));

app.get('/api/mentoria/sessions/past', requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT * FROM mentoring_sessions WHERE user_id = $1 AND status <> 'scheduled' ORDER BY session_date DESC, session_time DESC`,
    [req.user.id],
  );
  res.json({ sessions: rows.map(toSession) });
}));

app.post('/api/mentoria/sessions', requireAuth, asyncHandler(async (req, res) => {
  const { rows: mentorRows } = await query('SELECT id FROM mentors ORDER BY id LIMIT 1');
  const { date, time, topic, duration = 45, type = 'video' } = req.body;
  const { rows } = await query(
    `INSERT INTO mentoring_sessions (user_id, mentor_id, session_date, session_time, duration_minutes, topic, type, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'scheduled') RETURNING *`,
    [req.user.id, mentorRows[0].id, date, time, Number(duration), topic, type],
  );
  res.status(201).json({ session: toSession(rows[0]) });
}));

app.put('/api/mentoria/sessions/:id/reschedule', requireAuth, asyncHandler(async (req, res) => {
  await query(
    `UPDATE mentoring_sessions SET session_date = $1, session_time = $2, updated_at = now()
     WHERE id = $3 AND user_id = $4`,
    [req.body.date, req.body.time, Number(req.params.id), req.user.id],
  );
  res.status(204).send();
}));

app.post('/api/mentoria/sessions/:id/rate', requireAuth, asyncHandler(async (req, res) => {
  await query(
    `UPDATE mentoring_sessions SET rating = $1, notes = $2, status = 'completed', updated_at = now()
     WHERE id = $3 AND user_id = $4`,
    [Number(req.body.rating), req.body.notes ?? null, Number(req.params.id), req.user.id],
  );
  res.status(204).send();
}));

app.get('/api/comunidade', requireAuth, asyncHandler(async (req, res) => {
  const discussions = await listDiscussions(req.user.id);
  const { rows: statsRows } = await query(
    `SELECT
       (SELECT COUNT(*)::int FROM users) AS active_members,
       (SELECT COUNT(*)::int FROM discussions) AS active_discussions,
       (SELECT COUNT(*)::int FROM discussion_replies WHERE created_at >= now() - interval '7 days') AS weekly_replies`,
  );
  const { rows: topicRows } = await query(
    `SELECT category AS name, COUNT(*)::int AS count
     FROM discussions
     GROUP BY category
     ORDER BY count DESC
     LIMIT 5`,
  );

  res.json({
    discussions,
    trendingTopics: topicRows,
    stats: {
      activeMembers: statsRows[0].active_members,
      activeDiscussions: statsRows[0].active_discussions,
      weeklyReplies: statsRows[0].weekly_replies,
    },
  });
}));

async function listDiscussions(_userId, category = null) {
  const params = [];
  const filter = category ? 'WHERE d.category = $1' : '';
  if (category) params.push(category);

  const { rows } = await query(
    `SELECT
       d.id,
       u.name AS author,
       u.avatar,
       d.title,
       d.category,
       COALESCE(r.reply_count, 0)::int AS replies,
       COALESCE(l.like_count, 0)::int AS likes,
       CASE
         WHEN d.created_at > now() - interval '1 hour' THEN 'agora'
         WHEN d.created_at > now() - interval '1 day' THEN 'hoje'
         ELSE to_char(d.created_at, 'DD/MM/YYYY')
       END AS time_label,
       LEFT(d.content, 160) AS excerpt
     FROM discussions d
     JOIN users u ON u.id = d.user_id
     LEFT JOIN (SELECT discussion_id, COUNT(*) AS reply_count FROM discussion_replies GROUP BY discussion_id) r ON r.discussion_id = d.id
     LEFT JOIN (SELECT discussion_id, COUNT(*) AS like_count FROM discussion_likes GROUP BY discussion_id) l ON l.discussion_id = d.id
     ${filter}
     ORDER BY d.created_at DESC
     LIMIT 30`,
    params,
  );
  return rows.map(toDiscussion);
}

app.get('/api/comunidade/discussions', requireAuth, asyncHandler(async (req, res) => {
  res.json({ discussions: await listDiscussions(req.user.id, req.query.category ?? null) });
}));

app.post('/api/comunidade/discussions', requireAuth, asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  const { rows } = await query(
    `INSERT INTO discussions (user_id, title, content, category)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [req.user.id, title, content, category || 'Geral'],
  );
  const discussion = (await listDiscussions(req.user.id)).find((item) => item.id === rows[0].id);
  res.status(201).json({ discussion });
}));

app.post('/api/comunidade/discussions/:id/like', requireAuth, asyncHandler(async (req, res) => {
  await query(
    `INSERT INTO discussion_likes (discussion_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (discussion_id, user_id) DO NOTHING`,
    [Number(req.params.id), req.user.id],
  );
  res.status(204).send();
}));

app.get('/api/comunidade/topics/trending', requireAuth, asyncHandler(async (_req, res) => {
  const { rows } = await query(
    `SELECT category AS name, COUNT(*)::int AS count FROM discussions GROUP BY category ORDER BY count DESC LIMIT 8`,
  );
  res.json({ topics: rows });
}));

app.get('/api/comunidade/stats', requireAuth, asyncHandler(async (_req, res) => {
  const { rows } = await query(
    `SELECT
       (SELECT COUNT(*)::int FROM users) AS active_members,
       (SELECT COUNT(*)::int FROM discussions) AS active_discussions,
       (SELECT COUNT(*)::int FROM discussion_replies WHERE created_at >= now() - interval '7 days') AS weekly_replies`,
  );
  res.json({
    stats: {
      activeMembers: rows[0].active_members,
      activeDiscussions: rows[0].active_discussions,
      weeklyReplies: rows[0].weekly_replies,
    },
  });
}));

app.get('/api/certificados', requireAuth, asyncHandler(async (req, res) => {
  const modules = await getModulesForUser(req.user.id);
  const certificates = modules.map((module) => ({
    id: module.id,
    title: `Certificado - ${module.title}`,
    module: module.title,
    issueDate: module.progress >= 100 ? new Date().toISOString().slice(0, 10) : null,
    hours: Math.max(1, Number.parseInt(module.duration, 10) || 1),
    status: module.progress >= 100 ? 'completed' : 'in-progress',
    progress: module.progress,
  }));

  const achievements = [
    { icon: '🚀', title: 'Primeiro acesso', description: 'Entrou na plataforma', earned: true, date: new Date().toISOString().slice(0, 10) },
    { icon: '📚', title: 'Primeiro módulo', description: 'Conclua um módulo completo', earned: certificates.some((item) => item.status === 'completed'), progress: Math.max(...certificates.map((item) => item.progress), 0) },
    { icon: '💬', title: 'Participação', description: 'Crie uma discussão na comunidade', earned: false, progress: 0 },
  ];

  res.json({
    certificates,
    achievements,
    stats: {
      certificatesEarned: certificates.filter((item) => item.status === 'completed').length,
      achievementsUnlocked: achievements.filter((item) => item.earned).length,
      totalStudyHours: certificates.reduce((sum, item) => sum + (item.progress >= 100 ? item.hours : 0), 0),
    },
  });
}));

app.get('/api/certificados/list', requireAuth, asyncHandler(async (req, res) => {
  const modules = await getModulesForUser(req.user.id);
  res.json({
    certificates: modules.map((module) => ({
      id: module.id,
      title: `Certificado - ${module.title}`,
      module: module.title,
      issueDate: module.progress >= 100 ? new Date().toISOString().slice(0, 10) : null,
      hours: Math.max(1, Number.parseInt(module.duration, 10) || 1),
      status: module.progress >= 100 ? 'completed' : 'in-progress',
      progress: module.progress,
    })),
  });
}));

app.get('/api/certificados/:id/download', requireAuth, asyncHandler(async (req, res) => {
  res.json({ download_url: `${req.protocol}://${req.get('host')}/api/certificados/${req.params.id}/download/mock.pdf` });
}));

app.get('/api/certificados/achievements', requireAuth, (_req, res) => {
  res.json({ achievements: [] });
});

app.get('/api/certificados/stats', requireAuth, (_req, res) => {
  res.json({ stats: { certificatesEarned: 0, achievementsUnlocked: 0, totalStudyHours: 0 } });
});

app.get('/api/configuracoes', requireAuth, asyncHandler(async (req, res) => {
  const { rows: notificationRows } = await query('SELECT * FROM notification_settings WHERE user_id = $1', [req.user.id]);
  const { rows: preferenceRows } = await query('SELECT * FROM preference_settings WHERE user_id = $1', [req.user.id]);

  res.json({
    profile: {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone ?? '',
      bio: req.user.bio ?? '',
      business: req.user.business ?? '',
      city: req.user.city ?? '',
      state: req.user.state ?? '',
      avatar: req.user.avatar ?? null,
    },
    notifications: {
      emailSessions: notificationRows[0]?.email_sessions ?? true,
      emailModules: notificationRows[0]?.email_modules ?? true,
      emailCommunity: notificationRows[0]?.email_community ?? true,
      pushEnabled: notificationRows[0]?.push_enabled ?? false,
    },
    preferences: {
      theme: preferenceRows[0]?.theme ?? 'system',
      language: preferenceRows[0]?.language ?? 'pt_BR',
    },
  });
}));

app.put('/api/configuracoes/profile', requireAuth, asyncHandler(async (req, res) => {
  const { name, phone, bio, business, city, state, avatar } = req.body;
  const { rows } = await query(
    `UPDATE users SET
       name = COALESCE($1, name),
       phone = COALESCE($2, phone),
       bio = COALESCE($3, bio),
       business = COALESCE($4, business),
       city = COALESCE($5, city),
       state = COALESCE($6, state),
       avatar = COALESCE($7, avatar),
       updated_at = now()
     WHERE id = $8
     RETURNING *`,
    [name, phone, bio, business, city, state, avatar, req.user.id],
  );
  const user = toUser(rows[0]);
  res.json({ profile: { ...user, phone: user.phone ?? '', bio: user.bio ?? '', business: user.business ?? '', city: user.city ?? '', state: user.state ?? '' } });
}));

app.put('/api/configuracoes/notifications', requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `INSERT INTO notification_settings (user_id, email_sessions, email_modules, email_community, push_enabled)
     VALUES ($1, COALESCE($2, true), COALESCE($3, true), COALESCE($4, true), COALESCE($5, false))
     ON CONFLICT (user_id)
     DO UPDATE SET email_sessions = COALESCE($2, notification_settings.email_sessions),
                   email_modules = COALESCE($3, notification_settings.email_modules),
                   email_community = COALESCE($4, notification_settings.email_community),
                   push_enabled = COALESCE($5, notification_settings.push_enabled),
                   updated_at = now()
     RETURNING *`,
    [req.user.id, req.body.emailSessions, req.body.emailModules, req.body.emailCommunity, req.body.pushEnabled],
  );
  res.json({
    notifications: {
      emailSessions: rows[0].email_sessions,
      emailModules: rows[0].email_modules,
      emailCommunity: rows[0].email_community,
      pushEnabled: rows[0].push_enabled,
    },
  });
}));

app.put('/api/configuracoes/preferences', requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `INSERT INTO preference_settings (user_id, theme, language)
     VALUES ($1, COALESCE($2, 'system'), COALESCE($3, 'pt_BR'))
     ON CONFLICT (user_id)
     DO UPDATE SET theme = COALESCE($2, preference_settings.theme),
                   language = COALESCE($3, preference_settings.language),
                   updated_at = now()
     RETURNING *`,
    [req.user.id, req.body.theme, req.body.language],
  );
  res.json({ preferences: { theme: rows[0].theme, language: rows[0].language } });
}));

app.put('/api/configuracoes/security', requireAuth, asyncHandler(async (req, res) => {
  const { current_password, password, password_confirmation } = req.body;
  if (!password || password !== password_confirmation) {
    return res.status(422).json({ message: 'A confirmação da senha não confere.' });
  }

  const { rows } = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
  if (!(await bcrypt.compare(String(current_password || ''), rows[0].password_hash))) {
    return res.status(401).json({ message: 'Senha atual inválida.' });
  }

  const hash = await bcrypt.hash(password, 10);
  await query('UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2', [hash, req.user.id]);
  res.status(204).send();
}));

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : 'Erro interno no servidor.',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Empreende+ API rodando em http://0.0.0.0:${PORT}/api`);
});
