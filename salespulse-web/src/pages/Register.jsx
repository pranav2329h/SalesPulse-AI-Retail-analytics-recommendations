import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/useAuth'

const Eye = ({ off=false }) => off ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l18 18"/><path d="M10.58 10.58a3 3 0 104.24 4.24"/><path d="M9.88 5.09A10.94 10.94 0 0121 12c-.86 1.19-1.93 2.22-3.13 3.05"/><path d="M6.13 6.13A10.94 10.94 0 003 12a10.94 10.94 0 007.09 6.91"/></svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
)

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()
  const { register } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register.mutateAsync({ name, email, password })
      nav('/')
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="center" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="card pad" style={{ width: '100%', maxWidth: 420 }}>
        <h2 className="h2">Create Your Account</h2>
        <p className="muted" style={{ marginBottom: 20 }}>Start tracking your sales with AI</p>

        <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
          <div>
            <label className="muted">Full Name</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
          </div>

          <div>
            <label className="muted">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="muted">Password</label>
            <div className="input-wrap">
              <input className="input" type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required />
              <button type="button" className="toggle-pass" onClick={()=>setShow(s=>!s)}><Eye off={show}/></button>
            </div>
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: 13 }}>{error}</div>}

          <button className="btn success glow" type="submit" disabled={register.isPending} style={{ marginTop: 10 }}>
            {register.isPending ? 'Creating…' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
