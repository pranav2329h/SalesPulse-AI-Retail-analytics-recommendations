// src/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

function sign(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const inserted = await prisma.users.create({
      data: { name, email, password_hash },
      select: { id: true, name: true, email: true, created_at: true },
    });

    const token = sign(inserted);
    return res.json({ token, user: inserted });
  } catch (e) {
    console.error('register error', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const found = await prisma.users.findUnique({ where: { email } });
    if (!found) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, found.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const user = { id: found.id, name: found.name, email: found.email, created_at: found.created_at };
    const token = sign(user);
    return res.json({ token, user });
  } catch (e) {
    console.error('login error', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /auth/me
import { requireAuth } from '../middleware/requireAuth.js';
router.get('/me', requireAuth, async (req, res) => {
  const me = await prisma.users.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, created_at: true },
  });
  if (!me) return res.status(404).json({ error: 'User not found' });
  return res.json({ user: me });
});

export default router;
