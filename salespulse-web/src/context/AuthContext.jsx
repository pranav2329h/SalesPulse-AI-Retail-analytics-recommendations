import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // On mount, if we have a token, fetch /auth/me
  useEffect(() => {
    let ignore = false;
    async function bootstrap() {
      try {
        if (token) {
          const { data } = await api.get("/auth/me");
          if (!ignore) setUser(data?.user || null);
        } else {
          if (!ignore) setUser(null);
        }
      } catch {
        localStorage.removeItem("token");
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    bootstrap();
    return () => { ignore = true; };
  }, [token]);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }
    setUser(data?.user || null);
    return data?.user;
  }

  async function register(name, email, password) {
    const { data } = await api.post("/auth/register", { name, email, password });
    // If your backend returns token here, keep these 3 lines. If not, call login() after.
    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }
    setUser(data?.user || null);
    return data?.user;
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  const value = { user, token, loading, login, register, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
