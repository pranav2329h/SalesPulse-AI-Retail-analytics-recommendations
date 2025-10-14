import { Router } from 'express'
import { prisma } from '../prisma.js'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { signUser, setAuthCookie, clearAuthCookie, verifyFromReq } from '../utils/jwt.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' })
  const { name, email, password } = parsed.data

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return res.status(409).json({ error: 'Email already in use' })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, passwordHash } })
  const token = signUser(user)
  setAuthCookie(res, token)
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' })
  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  const token = signUser(user)
  setAuthCookie(res, token)
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

router.post('/logout', (req, res) => {
  clearAuthCookie(res)
  res.json({ ok: true })
})

router.get('/me', async (req, res) => {
  const payload = verifyFromReq(req)
  if (!payload) return res.json({ user: null })
  const user = await prisma.user.findUnique({ where: { id: payload.uid }, select: { id:true, name:true, email:true, role:true }})
  res.json({ user })
})

// Example protected route
router.get('/protected/ping', requireAuth, (req, res) => {
  res.json({ ok:true, user: req.user })
})

export default router
