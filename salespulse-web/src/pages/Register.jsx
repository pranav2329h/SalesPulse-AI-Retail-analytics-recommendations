import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../components/Logo'
import Button from '../components/Button'
import TextInput from '../components/TextInput'

export default function Register() {
  const onSubmit = (e) => {
    e.preventDefault()
    // TODO: call /auth/register when backend auth is ready
    alert('Registration submit (wire to API in Auth module)')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid place-items-center">
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center">
          <Logo size={34} />
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur">
          <h2 className="mb-1 text-xl font-semibold text-white text-center">Create your account</h2>
          <p className="mb-6 text-center text-slate-400 text-sm">Start tracking sales with AI</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <TextInput label="Full name" placeholder="Jane Doe" required />
            <TextInput label="Email" type="email" placeholder="you@example.com" required />
            <TextInput label="Password" type="password" placeholder="••••••••" required />
            <Button type="submit" className="w-full">Create account</Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
