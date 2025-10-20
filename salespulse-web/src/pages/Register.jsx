import { useState } from 'react'
import { register as apiRegister } from '../lib/api'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [msg, setMsg] = useState(null)
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setMsg(null); setOk(false); setLoading(true)
    try {
      await apiRegister(form)
      setOk(true)
      setMsg('Registered! You can now log in.')
      setForm({ name:'', email:'', password:'' })
    } catch (e) {
      setMsg(e.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="h1 mb-2">Create your account</div>

      <div className="card" style={{maxWidth:520}}>
        <form className="grid" onSubmit={onSubmit}>
          <div>
            <div className="label">Name</div>
            <input className="input" placeholder="Jane Doe" value={form.name}
              onChange={e=>setForm({...form, name:e.target.value})}/>
          </div>
          <div>
            <div className="label">Email</div>
            <input className="input" placeholder="jane@example.com" value={form.email}
              onChange={e=>setForm({...form, email:e.target.value})}/>
          </div>
          <div>
            <div className="label">Password</div>
            <input className="input" type="password" placeholder="••••••••" value={form.password}
              onChange={e=>setForm({...form, password:e.target.value})}/>
          </div>

          <div className="row mt-2">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating…' : 'Sign up'}
            </button>
            <span className="help">Already have an account? Use the Login page.</span>
          </div>

          {msg && <div className={`mt-1 ${ok ? 'success' : 'error'}`}>{msg}</div>}
        </form>
      </div>
    </div>
  )
}
