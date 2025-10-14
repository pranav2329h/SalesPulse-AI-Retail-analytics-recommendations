import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  NavLink,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Protected from "./components/Protected"; // ✅ Protected route
import { applyChartTheme } from "./chartTheme.js";
import "./index.css";

// ✅ Apply chart theme safely
applyChartTheme();

// --- Demo pages ---
function Dashboard() {
  return (
    <div className="grid">
      <div className="card pad">
        <h2 className="h2">Dashboard</h2>
        <p className="muted">
          ✅ React app is rendering correctly. Charts and data will appear here.
        </p>
      </div>
    </div>
  );
}

function Products() {
  return (
    <div className="card pad">
      <h3 style={{ margin: 0 }}>Products</h3>
      <p className="muted">Product analytics and inventory data will go here.</p>
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

// --- Layout Shell ---
function App() {
  return (
    <div style={{ minHeight: "100%" }}>
      {/* Header */}
      <header className="header">
        <div className="container header-bar">
          <div className="brand">SalesPulse AI</div>
          <nav className="nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Products
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Get Started
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer container">
        © {new Date().getFullYear()} SalesPulse AI
      </footer>
    </div>
  );
}

// --- React Query setup ---
const qc = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, staleTime: 60000, retry: 1 },
  },
});

// --- Router setup ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
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
    ],
  },
]);

// --- Render App ---
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
