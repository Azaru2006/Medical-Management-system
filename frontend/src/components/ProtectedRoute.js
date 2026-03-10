import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Redirects to /login if not authenticated
// Optionally restricts by roles e.g. <ProtectedRoute roles={["admin"]} />
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: "60vh", gap: 12, color: "#0f2744"
      }}>
        <div style={{ fontSize: 48 }}>🚫</div>
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22 }}>Access Denied</h2>
        <p style={{ color: "#7a92ab", fontSize: 14 }}>
          Your role <strong>({user.role})</strong> does not have permission to view this page.
        </p>
      </div>
    );
  }

  return children;
}