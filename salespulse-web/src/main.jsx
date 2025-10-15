import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  NavLink,
  Outlet,
  useRouteError,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Dashboard from "./pages/Dashboard.jsx";   // ✅ use the page component you created
import Protected from "./components/Protected";
import { applyChartTheme } from "./chartTheme.js";
import "./index.css";

// Apply Chart.js theme safely
applyChartTheme();

/* -------------------- Simple pages -------------------- */
function Products() {
  return (
    <div className="card pad">
      <h3 style={{ margin: 0 }}>Products</h3>
      <p className="muted">Product analytics, stock, and trends will appear here.</p>
    </div>
  );
}

function Login() {
  return (
    <div className="card pad">
      <h3>Login Page</h3>
      <p className="muted">Sign in with your credentials.</p>
    </div>
  );
}

function Register() {
  return (
    <div className="card pad">
      <h3>Register Page</h3>
      <p className="muted">Create your new SalesPulse AI account.</p>
    </div>
  );
}

/* -------------------- Layout Shell -------------------- */
function App() {
  return (
    <div style={{ minHeight: "100%" }}>
      <header className="header">
        <div className="container header-bar">
          <div className="brand">SalesPulse AI</div>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : undefined)}>Dashboard</NavLink>
            <NavLink to="/products" className={({ isActive }) => (isActive ? "active" : undefined)}>Products</NavLink>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : undefined)}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : undefined)}>Get Started</NavLink>
          </nav>
        </div>
      </header>

      <main className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <Outlet />
      </main>

      <footer className="footer container">© {new Date().getFullYear()} SalesPulse AI</footer>
    </div>
  );
}

/* -------------------- Error & 404 -------------------- */
function ErrorPage() {
  const error = useRouteError();
  console.error("Router error:", error);
  return (
    <div className="card pad" style={{ marginTop: 40 }}>
      <h2 className="h2">Something went wrong 😕</h2>
      <p className="muted">{error?.statusText || error?.message || "An unexpected error occurred."}</p>
      <a href="/" className="btn" style={{ marginTop: 10 }}>Go Home</a>
    </div>
  );
}

function NotFound() {
  return (
    <div className="card pad" style={{ marginTop: 40 }}>
      <h2 className="h2">404 — Page Not Found</h2>
      <p className="muted">The page you’re looking for doesn’t exist.</p>
      <a href="/" className="btn" style={{ marginTop: 10 }}>Back to Dashboard</a>
    </div>
  );
}

/* -------------------- React Query -------------------- */
const qc = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, staleTime: 60000, retry: 1 },
  },
});

/* -------------------- Router -------------------- */
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },               // ✅ use the imported page
      {
        path: "products",
        element: (
          <Protected>
            <Products />
          </Protected>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

/* -------------------- Render -------------------- */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
