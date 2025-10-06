import { NavLink, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="container flex items-center justify-between py-3">
          <h1 className="text-xl font-semibold">SalesPulse AI</h1>
          <nav className="flex gap-4">
            <NavLink to="/" end className={({isActive}) => isActive ? 'text-white' : 'text-slate-400 hover:text-white'}>Dashboard</NavLink>
            <NavLink to="/products" className={({isActive}) => isActive ? 'text-white' : 'text-slate-400 hover:text-white'}>Products</NavLink>
          </nav>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  )
}
