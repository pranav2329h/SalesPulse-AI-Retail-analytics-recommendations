import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LockKeyhole, Mail } from 'lucide-react'
import Logo from '../components/Logo'
import Button from '../components/Button'
import TextInput from '../components/TextInput'

export default function Login() {
  const onSubmit = (e) => {
    e.preventDefault()
    // TODO: call /auth/login when backend auth is ready
    alert('Login submit (wire to API in Auth module)')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid place-items-center">
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center">
          <Logo size={34} />
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur">
          <h2 className="mb-1 text-xl font-semibold text-white text-center">Welcome back</h2>
          <p className="mb-6 text-center text-slate-400 text-sm">Sign in to your dashboard</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <TextInput label="Email" type="email" placeholder="you@example.com" required />
            <TextInput label="Password" type="password" placeholder="••••••••" required />
            <Button type="submit" className="w-full">Sign in</Button>
          </form>

          <div className="mt-4 flex justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1"><Mail size={14}/> support@salespulse.local</span>
            <span className="inline-flex items-center gap-1"><LockKeyhole size={14}/> Secured</span>
          </div>

          <div className="mt-6 text-center text-sm text-slate-400">
            Don’t have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300">Create one</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
