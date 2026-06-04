import 'dotenv/config';
import fs from 'node:fs/promises';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, query } from '../src/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function run() {
  const dir = path.join(root, 'seeds');
  const files = (await fs.readdir(dir)).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    console.log(`Aplicando seed: ${file}`);
    const sql = await fs.readFile(path.join(dir, file), 'utf8');
    await query(sql);
  }


  const passwordHash = await bcrypt.hash('123456', 10);
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, business, city, state)
     VALUES ('Usuário Demo', 'demo@empreende.com', $1, 'Empório Demo', 'Belo Horizonte', 'MG')
     ON CONFLICT (email)
     DO UPDATE SET password_hash = EXCLUDED.password_hash,
                   business = COALESCE(users.business, EXCLUDED.business),
                   city = COALESCE(users.city, EXCLUDED.city),
                   state = COALESCE(users.state, EXCLUDED.state)
     RETURNING id`,
    [passwordHash],
  );
  const demoUserId = rows[0].id;

  await query('INSERT INTO notification_settings (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING', [demoUserId]);
  await query('INSERT INTO preference_settings (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING', [demoUserId]);

  await query(
    `INSERT INTO discussions (user_id, title, content, category)
     SELECT $1, $2, $3, $4
     WHERE NOT EXISTS (SELECT 1 FROM discussions WHERE title = $2)`,
    [
      demoUserId,
      'Como adaptar missão e valores para um pequeno negócio?',
      'Estou montando minha primeira versão de missão, visão e valores e queria exemplos aplicados a empresas de alimentos.',
      'Planejamento',
    ],
  );
  await query(
    `INSERT INTO discussions (user_id, title, content, category)
     SELECT $1, $2, $3, $4
     WHERE NOT EXISTS (SELECT 1 FROM discussions WHERE title = $2)`,
    [
      demoUserId,
      'Dúvidas sobre análise de concorrência local',
      'Quais critérios vocês usam para comparar concorrentes em bairros diferentes?',
      'Mercado',
    ],
  );
  await query(`SELECT setval('users_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM users), 1), 1), true)`);

  console.log('Seeds concluídos. Usuário demo: demo@empreende.com / 123456');
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
