// src/routes/authRoutes.js
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const TOKEN_TTL = '7d'

const signToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_TTL })

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'email already registered' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true },
    })

    const token = signToken(user)
    res.status(201).json({ user, token })
  } catch (err) {
    console.error('register error', err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true },
    })
    if (!user) return res.status(401).json({ error: 'invalid_credentials' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' })

    const { passwordHash, ...safe } = user
    const token = signToken(user)
    res.json({ user: safe, token })
  } catch (err) {
    console.error('login error', err)
    res.status(500).json({ error: 'internal_error' })
  }
})

// GET /auth/me (protected)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true },
    })
    if (!user) return res.status(404).json({ error: 'not_found' })
    res.json({ user })
  } catch (err) {
    console.error('auth me error', err)
    res.status(500).json({ error: 'internal_error' })
  }
})

export default router
