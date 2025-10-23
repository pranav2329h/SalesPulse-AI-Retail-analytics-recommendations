import React, { useEffect, useState } from 'react'
import './style.css'

export default function Login({ onLogin }) {
  const [hasPassword, setHasPassword] = useState(false)
  const [mode, setMode] = useState('init')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [hintOpen, setHintOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sp_admin_password')
    if (saved) {
      setHasPassword(true)
      setMode('login')
    }
  }, [])

  const encode = (str) => btoa(unescape(encodeURIComponent(str)))
  const decode = (str) => decodeURIComponent(escape(atob(str)))

  const handleSetPassword = (e) => {
    e.preventDefault()
    if (!password || password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== password2) return setError('Passwords do not match.')
    localStorage.setItem('sp_admin_password', encode(password))
    localStorage.setItem('sp_admin_email', email || 'admin@salespulse.com')
    localStorage.setItem('sp_session', 'true')
    onLogin({ email: email || 'admin@salespulse.com' })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const saved = localStorage.getItem('sp_admin_password')
    const savedEmail = localStorage.getItem('sp_admin_email') || 'admin@salespulse.com'
    if (!saved) return setMode('init')
    try {
      const ok = decode(saved)
      if (password === ok) {
        localStorage.setItem('sp_session', 'true')
        if (email) localStorage.setItem('sp_admin_email', email)
        onLogin({ email: email || savedEmail })
      } else setError('Invalid password.')
    } catch {
      setError('Corrupted saved password. Reset below.')
    }
  }

  const resetAll = () => {
    if (!confirm('Reset local credentials?')) return
    localStorage.removeItem('sp_admin_password')
    localStorage.removeItem('sp_admin_email')
    localStorage.removeItem('sp_session')
    setEmail(''); setPassword(''); setPassword2(''); setHasPassword(false); setMode('init'); setError('')
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={mode === 'init' ? handleSetPassword : handleLogin}>
        <h2>SalesPulse Admin</h2>
        {mode === 'init' ? (
          <>
            <p className="hint">First-time setup: create admin credentials.</p>
            <input type="email" placeholder="Admin Email (optional)" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" placeholder="Set Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" value={password2} onChange={(e)=>setPassword2(e.target.value)} required />
            <button type="submit">Save & Enter</button>
            <small className="hint">Already have one? <a href="#" onClick={(e)=>{e.preventDefault();setMode('login')}}>Switch to Login</a></small>
          </>
        ) : (
          <>
            <input type="email" placeholder="Email (optional)" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" placeholder="Enter Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            <button type="submit">Login</button>
            <small className="hint">Need to reset? <a href="#" onClick={(e)=>{e.preventDefault();setHintOpen(v=>!v)}}>Show Reset</a></small>
            {hintOpen && (
              <div className="alert glass" style={{marginTop:'.6rem'}}>
                <button onClick={resetAll} style={{
                  background:'linear-gradient(135deg,#ef4444,#f59e0b)',
                  color:'#fff',border:'none',padding:'.6rem .9rem',
                  borderRadius:'10px',cursor:'pointer'
                }}>Reset Local Credentials</button>
              </div>
            )}
          </>
        )}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
