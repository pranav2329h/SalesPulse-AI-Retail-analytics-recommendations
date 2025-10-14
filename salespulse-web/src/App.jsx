import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Splash({ show }) {
  if (!show) return null
  return (
    <div className="center" style={{
      position:'fixed', inset:0, zIndex:50,
      background:'radial-gradient(1000px 600px at 20% 10%, rgba(99,102,241,.15), transparent 60%), radial-gradient(1000px 600px at 100% 0%, rgba(167,139,250,.12), transparent 60%), linear-gradient(180deg,#0b1020,#111827)'
    }}>
      <div className="center" style={{gap:16}}>
        <div style={{
          width:64,height:64,borderRadius:16,
          background:'conic-gradient(from 180deg at 50% 50%, #60a5fa, #a78bfa, #60a5fa)',
          boxShadow:'0 0 24px rgba(99,102,241,.45)', display:'grid', placeItems:'center'
        }}>
          <div style={{width:38,height:38,borderRadius:12,background:'rgba(0,0,0,.35)',backdropFilter:'blur(6px)'}} />
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontWeight:700}}>SalesPulse AI</div>
          <div className="muted" style={{marginTop:4}}>Loading dashboard…</div>
        </div>
        <div className="spinner" />
      </div>
    </div>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const t = setTimeout(()=>setShowSplash(false), 700)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{minHeight:'100%'}}>
      <Splash show={showSplash} />

      <header className="header">
        <div className="container header-bar">
          <div className="brand">SalesPulse AI</div>
          <nav className="nav">
            <NavLink to="/" end className={({isActive}) => isActive ? 'active' : undefined}>Dashboard</NavLink>
            <NavLink to="/products" className={({isActive}) => isActive ? 'active' : undefined}>Products</NavLink>
            <NavLink to="/login" className={({isActive}) => isActive ? 'active hidden-sm' : 'hidden-sm'}>Login</NavLink>
            <NavLink to="/register" className={({isActive}) => isActive ? 'active' : undefined}>Get Started</NavLink>
          </nav>
        </div>
      </header>

      <main className="container" style={{paddingTop:24, paddingBottom:24}}>
        {/* simple fade on route change */}
        <div key={location.pathname} className="fade-enter-active">
          <Outlet />
        </div>
      </main>

      <footer className="footer container">
        © {new Date().getFullYear()} SalesPulse AI
      </footer>
    </div>
  )
}
