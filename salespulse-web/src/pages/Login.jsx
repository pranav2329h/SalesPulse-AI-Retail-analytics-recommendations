import { useState } from 'react'
import { login, me, logout } from '../lib/api'

export default function LoginPage() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [user, setUser] = useState(null)
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  async function onLogin(e) {
    e.preventDefault()
    setMsg(null); setLoading(true)
    try {
      await login(form)
      const { data } = await me()
      setUser(data.user)
    } catch (e) {
      setMsg(e.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function onLogout() {
    await logout()
    setUser(null)
  }

  return (
    <div className="container">
      <div className="h1 mb-2">Welcome back</div>

      {!user ? (
        <div className="card" style={{maxWidth:520}}>
          <form className="grid" onSubmit={onLogin}>
            <div>
              <div className="label">Email</div>
              <input className="input" placeholder="you@example.com" value={form.email}
                onChange={e=>setForm({...form, email:e.target.value})}/>
            </div>
            <div>
              <div className="label">Password</div>
              <input className="input" type="password" placeholder="••••••••" value={form.password}
                onChange={e=>setForm({...form, password:e.target.value})}/>
            </div>

            <div className="row mt-2">
              <button className="btn btn-primary glow" disabled={loading}>
                {loading ? 'Signing in…' : 'Login'}
              </button>
              {msg && <span className="error">{msg}</span>}
            </div>
          </form>
        </div>
      ) : (
        <div className="card" style={{maxWidth:520}}>
          <div className="row">
            <div>
              <div className="h2">{user.name || user.email}</div>
              <div className="help">Signed in</div>
            </div>
            <div className="right">
              <button className="btn btn-outline" onClick={onLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
