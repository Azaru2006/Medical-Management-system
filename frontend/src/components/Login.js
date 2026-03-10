import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const roleColors = {
  admin:        { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  doctor:       { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  receptionist: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
};

const roleIcons = { admin: "🛡️", doctor: "👨‍⚕️", receptionist: "🗂️" };

export default function Login() {
  const { login }             = useAuth();
  const navigate              = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShow]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2744 0%, #1a3a5c 50%, #1d6fa4 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🏥</div>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>
            City Hospital
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 6 }}>
            Management System — Secure Login
          </p>
        </div>

        {/* CARD */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 36, boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>

          <h2 style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 700, color: "#0f2744", marginBottom: 24 }}>
            Sign in to your account
          </h2>

          {/* ROLE BADGES */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {Object.entries(roleIcons).map(([role, icon]) => (
              <div key={role} style={{
                flex: 1, textAlign: "center", padding: "8px 4px",
                borderRadius: 8, border: `1px solid ${roleColors[role].border}`,
                background: roleColors[role].bg, color: roleColors[role].color,
                fontSize: 12, fontWeight: 600
              }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>{icon}</div>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </div>
            ))}
          </div>

          {/* ERROR */}
          {error && (
            <div style={{
              background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5",
              borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 20, fontWeight: 500
            }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "#3d5a80", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email" className="form-control"
                placeholder="you@cityhospital.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "#3d5a80", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required style={{ width: "100%", paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShow(!showPass)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#7a92ab"
                }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: 12,
              background: loading ? "#93c5fd" : "#1d6fa4",
              color: "#fff", border: "none", borderRadius: 8,
              fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s"
            }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <div style={{
            marginTop: 24, paddingTop: 20,
            borderTop: "1px solid #f0f4f8",
            textAlign: "center", fontSize: 14, color: "#7a92ab"
          }}>
            New doctor or staff?{" "}
            <Link to="/register" style={{ color: "#1d6fa4", fontWeight: 700, textDecoration: "none" }}>
              Create an account →
            </Link>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 20 }}>
          © {new Date().getFullYear()} City Hospital Management System
        </p>
      </div>
    </div>
  );
}