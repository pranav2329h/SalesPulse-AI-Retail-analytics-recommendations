import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Login with', { email, password })
  }

  return (
    <div className="center" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="card pad" style={{ width: '100%', maxWidth: 420 }}>
        <h2 className="h2">Sign In</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          Access your SalesPulse AI account
        </p>

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
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn" style={{ marginTop: 10 }}>
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
