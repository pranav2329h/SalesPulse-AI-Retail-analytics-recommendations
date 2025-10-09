import { NavLink, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PageFade from './components/PageFade'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  // Show the splash screen briefly on first load
  const [showSplash, setShowSplash] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 700) // 0.7s feels snappy
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen text-slate-100">
      {/* Splash overlay (fades out) */}
      <LoadingScreen show={showSplash} />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-slate-900/60 backdrop-blur-lg border-b border-slate-700/40 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500">
            SalesPulse AI
          </h1>

          <nav className="flex gap-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) =>
                `hidden sm:inline-block px-4 py-2 rounded-lg font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white hover:brightness-110'
                }`
              }
            >
              Get Started
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Page body with transition */}
      <main className="container mx-auto px-4 py-6">
        <PageFade>
          <Outlet />
        </PageFade>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SalesPulse AI
      </footer>
    </div>
  )
}
