import { NavLink, useNavigate } from 'react-router-dom'
import './sidebar.css'

export default function Sidebar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('sp_session')
    navigate(0) // reload → back to login
  }

  return (
    <aside className="sidebar">
      <div className="brand">SalesPulse</div>
      <nav className="nav">
        <NavLink to="/" end className="nav-link">Dashboard</NavLink>
        <NavLink to="/products" className="nav-link">Products</NavLink>
      </nav>
      <div className="sidebar-foot">
        <button className="logout-btn" onClick={logout}>Logout</button>
        <small>© {new Date().getFullYear()} SalesPulse</small>
      </div>
    </aside>
  )
}
