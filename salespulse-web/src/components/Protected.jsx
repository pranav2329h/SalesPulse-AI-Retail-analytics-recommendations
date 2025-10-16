import { useAuth } from "../context/AuthContext";
import { Link, Navigate, useLocation } from "react-router-dom";

export default function Protected({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className="card pad" style={{ maxWidth: 640, margin: "80px auto" }}>
        <div className="muted">Checking session…</div>
      </div>
    );
  }

  if (!user) {
    // show nice card and also allow "hard" redirect if you prefer:
    // return <Navigate to="/login" state={{ from: loc }} replace />
    return (
      <div className="card pad" style={{ maxWidth: 640, margin: "80px auto", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>🚫 Access Denied</div>
        <p className="muted" style={{ marginBottom: 16 }}>
          You must be logged in to view this page.
        </p>
        <Link className="btn" to={`/login?from=${encodeURIComponent(loc.pathname)}`}>Go to Login</Link>
      </div>
    );
  }

  return children;
}
