import { useState } from 'react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Register with', { name, email, password })
  }

  return (
    <div className="center" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="card pad" style={{ width: '100%', maxWidth: 420 }}>
        <h2 className="h2">Create Your Account</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          Start tracking your sales with AI
        </p>

        <form onSubmit={handleSubmit} className="grid" style={{ gap: 12 }}>
          <div>
            <label className="muted">Full Name</label>
            <input
              type="text"
              className="input"
              placeholder="Jane Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

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

          <button type="submit" className="btn success" style={{ marginTop: 10 }}>
            Create Account
          </button>
        </form>

        <p className="muted" style={{ marginTop: 20, textAlign: 'center' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: 'var(--accent1)', textDecoration: 'none' }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
