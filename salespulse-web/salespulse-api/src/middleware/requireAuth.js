import jwt from 'jsonwebtoken'

const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'token'
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

export function requireAuth(req, res, next) {
  try {
    const bearer = req.headers.authorization
    const headerToken = bearer?.startsWith('Bearer ') ? bearer.slice(7) : null
    const cookieToken = req.cookies?.[JWT_COOKIE_NAME]
    const token = headerToken || cookieToken
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
}
