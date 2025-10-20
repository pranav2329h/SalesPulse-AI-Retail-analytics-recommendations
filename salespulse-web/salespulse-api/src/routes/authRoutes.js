import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { requireAuth } from '../middleware/requireAuth.js'

const prisma = new PrismaClient()
const router = Router()

const COOKIE = process.env.JWT_COOKIE_NAME || 'token'
const SECRET = process.env.JWT_SECRET || 'devsecret'
const EXPIRES = Number(process.env.JWT_EXPIRES_DAYS || 7)

function setCookie(res, payload) {
  const token = jwt.sign(payload, SECRET, { expiresIn: `${EXPIRES}d` })
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: EXPIRES * 24 * 60 * 60 * 1000
  })
  return token
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email/password required' })
    const existing = await prisma.$queryRaw`SELECT id FROM users WHERE email=${email} LIMIT 1;`
    if (existing.length) return res.status(409).json({ error: 'Email exists' })

    const hash = await bcrypt.hash(password, 10)
    await prisma.$executeRaw`
      INSERT INTO users (name,email,password_hash,created_at)
      VALUES (${name ?? null},${email},${hash},NOW());
    `
    const rows = await prisma.$queryRaw`
      SELECT id,name,email,role,created_at FROM users WHERE email=${email} LIMIT 1;
    `
    const user = rows[0]
    const token = setCookie(res, { id: user.id, email: user.email, role: user.role ?? 'user' })
    res.status(201).json({ user, token })
  } catch (e) {
    console.error('register', e)
    res.status(500).json({ error: 'Internal error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email/password required' })
    const rows = await prisma.$queryRaw`
      SELECT id,name,email,role,password_hash FROM users WHERE email=${email} LIMIT 1;
    `
    const user = rows[0]
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    const token = setCookie(res, { id: user.id, email: user.email, role: user.role ?? 'user' })
    delete user.password_hash
    res.json({ user, token })
  } catch (e) {
    console.error('login', e)
    res.status(500).json({ error: 'Internal error' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE, { httpOnly: true, sameSite: 'lax', secure: false })
  res.json({ ok: true })
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const rows = await prisma.$queryRaw`
      SELECT id,name,email,role,created_at FROM users WHERE id=${req.user.id} LIMIT 1;
    `
    res.json({ user: rows[0] })
  } catch (e) {
    res.status(500).json({ error: 'Internal error' })
  }
})

export default router
