// src/components/Protected.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// A reusable protected route wrapper
// It checks localStorage for a token before rendering children.
const Protected = ({ children }) => {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    // Not logged in: show alert and redirect
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "2rem 3rem",
            borderRadius: "16px",
            boxShadow: "0 0 20px rgba(0,0,0,0.3)",
            backdropFilter: "blur(6px)",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>🚫 Access Denied</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            You must be logged in to view this page.
          </p>
          <a
            href="/login"
            style={{
              background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              color: "#fff",
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.target.style.background = "linear-gradient(90deg,#4f46e5,#7c3aed)")
            }
            onMouseOut={(e) =>
              (e.target.style.background = "linear-gradient(90deg,#6366f1,#8b5cf6)")
            }
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // If token exists, render the protected page
  return children;
};

export default Protected;
