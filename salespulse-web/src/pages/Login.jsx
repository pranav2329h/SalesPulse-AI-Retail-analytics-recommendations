import { useState } from 'react'

const Eye = ({ off=false }) => (
  off ? (
    // eye-off
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58a3 3 0 104.24 4.24" />
      <path d="M9.88 5.09A10.94 10.94 0 0121 12c-.86 1.19-1.93 2.22-3.13 3.05" />
      <path d="M6.13 6.13A10.94 10.94 0 003 12a10.94 10.94 0 007.09 6.91" />
    </svg>
  ) : (
    // eye
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Login with', { email, password })
  }

  return (
    <div className="center" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="card pad" style={{ width: '100%', maxWidth: 420 }}>
        <h2 className="h2">Sign In</h2>
        <p className="muted" style={{ marginBottom: 20 }}>Access your SalesPulse AI account</p>

        <form onSubmit={handleSubmit} className="grid" style={{ gap: 12 }}>
          <div>
            <label className="muted">Email</label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="muted">Password</label>
            <div className="input-wrap">
              <input
                type={show ? 'text' : 'password'}
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-pass"
                aria-label={show ? 'Hide password' : 'Show password'}
                onClick={() => setShow(s => !s)}
                title={show ? 'Hide password' : 'Show password'}
              >
                <Eye off={show} />
              </button>
            </div>
          </div>

          <button type="submit" className="btn glow pulse" style={{ marginTop: 10 }}>
            Login
          </button>
        </form>

        <p className="muted" style={{ marginTop: 20, textAlign: 'center' }}>
          Don’t have an account?{' '}
          <a href="/register" style={{ color: 'var(--accent1)', textDecoration: 'none' }}>
            Register here
          </a>
        </p>
      </div>
    </div>
  )
}
