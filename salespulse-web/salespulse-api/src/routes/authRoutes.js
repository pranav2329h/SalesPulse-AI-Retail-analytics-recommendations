// at top of file
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/requireAuth.js'  // already used elsewhere

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

// ... your /register and /login handlers ...

// GET /auth/me  -> return current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    // requireAuth sets req.user = { id, email }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true /* add name if your DB has it */ }
    })
    if (!user) return res.status(404).json({ error: 'not_found' })
    res.json({ user })
  } catch (e) {
    console.error('auth me error', e)
    res.status(500).json({ error: 'internal_error' })
  }
})

export default router
