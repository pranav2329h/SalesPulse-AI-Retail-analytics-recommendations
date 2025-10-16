import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await login(email, password);
      const to = sp.get("from") || "/";
      navigate(to, { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.error || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card pad" style={{ maxWidth: 720, margin: "24px auto" }}>
      <h3 className="h2" style={{ marginBottom: 8 }}>Login</h3>
      <p className="muted">Sign in with your credentials.</p>

      {err && <div className="card pad" style={{ background:"#fef2f2", borderColor:"#fecaca", margin:"12px 0" }}>{err}</div>}

      <form onSubmit={onSubmit} style={{ display:"grid", gap:12, marginTop: 12 }}>
        <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn" disabled={busy}>{busy ? "Signing in…" : "Login"}</button>
      </form>

      <p className="muted" style={{ marginTop: 12 }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
