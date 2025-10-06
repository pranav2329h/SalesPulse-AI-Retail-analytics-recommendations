import { NavLink, Outlet, Link } from 'react-router-dom'
import Logo from './components/Logo'
import Button from './components/Button'
import { LineChart } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="container flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex gap-6 text-sm">
            <NavLink to="/" end className={({isActive}) => isActive ? 'text-white' : 'text-slate-300 hover:text-white'}>Dashboard</NavLink>
            <NavLink to="/products" className={({isActive}) => isActive ? 'text-white' : 'text-slate-300 hover:text-white'}>Products</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Button as={Link} to="/login" className="hidden sm:inline-flex">
              <LineChart size={16} className="mr-2"/> Login
            </Button>
            <Button as={Link} to="/register" className="bg-gradient-to-br from-emerald-500 to-teal-500">Get Started</Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Outlet />
      </main>

      <footer className="container py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SalesPulse AI
      </footer>
    </div>
  )
}
