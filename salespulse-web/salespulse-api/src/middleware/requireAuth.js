// src/middleware/requireAuth.js
import { verifyFromReq } from '../utils/jwt.js'
import { prisma } from '../prisma.js'

// ✅ Named export (and default for flexibility)
export async function requireAuth(req, res, next) {
  try {
    const payload = verifyFromReq(req)
    if (!payload) return res.status(401).json({ error: 'Unauthorized' })

    const user = await prisma.user.findUnique({
      where: { id: payload.uid },
      select: { id: true, name: true, email: true, role: true },
    })
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    req.user = user
    next()
  } catch (err) {
    console.error('requireAuth error:', err)
    res.status(401).json({ error: 'Unauthorized' })
  }
}

export default requireAuth
