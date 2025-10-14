import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'
const COOKIE_NAME = 'sp_token'
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false, // set true in production (https)
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

export function signUser(user) {
  return jwt.sign({ uid: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
}
export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTS)
}
export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { ...COOKIE_OPTS, maxAge: 0 })
}
export function verifyFromReq(req) {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}
export const cookieName = COOKIE_NAME
