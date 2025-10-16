import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await register(name, email, password);
      navigate("/", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.error || "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card pad" style={{ maxWidth: 720, margin: "24px auto" }}>
      <h3 className="h2" style={{ marginBottom: 8 }}>Create account</h3>
      <p className="muted">Start tracking sales with AI.</p>

      {err && <div className="card pad" style={{ background:"#fef2f2", borderColor:"#fecaca", margin:"12px 0" }}>{err}</div>}

      <form onSubmit={onSubmit} style={{ display:"grid", gap:12, marginTop: 12 }}>
        <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
      </form>

      <p className="muted" style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
