// src/routes/authRoutes.js
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret'

// One hardcoded user
const ADMIN_EMAIL = 'admin@salespulse.com'
const ADMIN_PASS = 'admin123'

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ user: { email }, token })
})

export default router
