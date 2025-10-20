import { useState } from 'react'
import { register } from '../lib/api'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [msg, setMsg] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    try {
      await register(form)
      setMsg('Registered! You can now login.')
    } catch (e) {
      setMsg(e.response?.data?.error || 'Error')
    }
  }

  return (
    <form onSubmit={onSubmit} style={{maxWidth:360, display:'grid', gap:8}}>
      <h2>Register</h2>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
      <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
      <button>Sign up</button>
      {msg && <p>{msg}</p>}
    </form>
  )
}
