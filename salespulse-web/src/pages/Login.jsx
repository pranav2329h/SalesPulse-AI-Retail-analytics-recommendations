import { useState } from 'react'
import { login, me, logout } from '../lib/api'

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [user, setUser] = useState(null)
  const [msg, setMsg] = useState(null)

  async function onLogin(e) {
    e.preventDefault()
    try {
      await login(form)
      const { data } = await me()
      setUser(data.user)
      setMsg(null)
    } catch (e) {
      setMsg(e.response?.data?.error || 'Login failed')
    }
  }

  async function onLogout() {
    await logout()
    setUser(null)
  }

  return (
    <div style={{maxWidth:360}}>
      <h2>Login</h2>
      {!user ? (
        <form onSubmit={onLogin} style={{display:'grid', gap:8}}>
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
          <button>Login</button>
          {msg && <p>{msg}</p>}
        </form>
      ) : (
        <div>
          <p>Welcome, {user.name || user.email}</p>
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  )
}
