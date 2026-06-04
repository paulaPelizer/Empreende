import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, query } from '../src/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function run() {
  const reset = process.argv.includes('--reset');

  if (reset) {
    console.log('Resetando schema público...');
    await query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  }

  const dir = path.join(root, 'migrations');
  const files = (await fs.readdir(dir)).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    console.log(`Aplicando migration: ${file}`);
    const sql = await fs.readFile(path.join(dir, file), 'utf8');
    await query(sql);
  }

  console.log('Migrations concluídas.');
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
