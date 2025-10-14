import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/useAuth'

export default function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="card pad">Checking session…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}
