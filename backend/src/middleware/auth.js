import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { toUser } from '../utils/formatters.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Token não informado.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [decoded.sub]);

    if (!rows[0]) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    req.user = toUser(rows[0]);
    return next();
  } catch {
    return res.status(401).json({ message: 'Sessão expirada ou inválida.' });
  }
}
