import { NavLink } from 'react-router-dom'
import './sidebar.css'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">SalesPulse</div>
      <nav className="nav">
        <NavLink to="/" end className="nav-link">Dashboard</NavLink>
        <NavLink to="/products" className="nav-link">Products</NavLink>
      </nav>
      <div className="sidebar-foot">
        <small>© {new Date().getFullYear()} SalesPulse</small>
      </div>
    </aside>
  )
}
