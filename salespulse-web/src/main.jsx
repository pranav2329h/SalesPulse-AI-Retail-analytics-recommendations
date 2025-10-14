import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, NavLink, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { applyChartTheme } from './chartTheme.js'
import './index.css'

applyChartTheme()

// --- Minimal pages (replace with your real ones after it works) ---
function Dashboard() {
  return (
    <div className="grid">
      <div className="card pad">
        <h2 className="h2">Dashboard</h2>
        <p className="muted">If you can read this, the app is rendering ✅</p>
      </div>
    </div>
  )
}
function Products() {
  return (
    <div className="card pad">
      <h3 style={{margin:0}}>Products</h3>
      <p className="muted">Table will go here.</p>
    </div>
  )
}
function Login() { return <div className="card pad">Login page</div> }
function Register() { return <div className="card pad">Register page</div> }

// --- Minimal App shell (no external deps) ---
function App() {
  return (
    <div style={{minHeight:'100%'}}>
      <header className="header">
        <div className="container header-bar">
          <div className="brand">SalesPulse AI</div>
          <nav className="nav">
            <NavLink to="/" end className={({isActive}) => isActive ? 'active' : undefined}>Dashboard</NavLink>
            <NavLink to="/products" className={({isActive}) => isActive ? 'active' : undefined}>Products</NavLink>
            <NavLink to="/login" className={({isActive}) => isActive ? 'active' : undefined}>Login</NavLink>
            <NavLink to="/register" className={({isActive}) => isActive ? 'active' : undefined}>Get Started</NavLink>
          </nav>
        </div>
      </header>

      <main className="container" style={{paddingTop:24, paddingBottom:24}}>
        <Outlet />
      </main>

      <footer className="footer container">
        © {new Date().getFullYear()} SalesPulse AI
      </footer>
    </div>
  )
}

const qc = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus:false, staleTime:60000, retry:1 }}})
const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Dashboard /> },
    { path: 'products', element: <Products /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
  ] }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
