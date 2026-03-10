import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const specializations = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "ENT Specialist",
  "Gastroenterologist",
  "Gynecologist",
  "Neurologist",
  "Oncologist",
  "Ophthalmologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "Psychiatrist",
  "Pulmonologist",
  "Radiologist",
  "Urologist",
  "Other"
];

export default function Register() {
  const { login }             = useAuth();
  const navigate              = useNavigate();
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirmPassword: "", specialization: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShow]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!form.specialization) {
      setError("Please select your specialization.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name:           form.name,
        email:          form.email,
        password:       form.password,
        role:           "doctor",
        specialization: form.specialization
      });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.6px",
    color: "#3d5a80", marginBottom: 6
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2744 0%, #1a3a5c 50%, #1d6fa4 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: 460 }}>

        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🏥</div>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700, color: "#fff", margin: 0 }}>
            City Hospital
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 6 }}>
            Doctor Registration
          </p>
        </div>

        {/* CARD */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 36, boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>

          {/* DOCTOR BADGE */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            background: "#f0fdf4", border: "1.5px solid #bbf7d0",
            borderRadius: 12, padding: "14px 18px", marginBottom: 24
          }}>
            <div style={{ fontSize: 36 }}>👨‍⚕️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#14532d" }}>Doctor Account</div>
              <div style={{ fontSize: 12, color: "#16a34a", marginTop: 2 }}>
                Access prescriptions, test reports & patient history
              </div>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 700, color: "#0f2744", marginBottom: 20 }}>
            Create your account
          </h2>

          {/* ERROR */}
          {error && (
            <div style={{
              background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5",
              borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 20, fontWeight: 500
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Full Name</label>
              <input
                className="form-control"
                placeholder="Dr. John Smith"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                style={{ width: "100%" }}
              />
            </div>

            {/* SPECIALIZATION */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Specialization</label>
              <select
                className="form-control"
                value={form.specialization}
                onChange={e => setForm({ ...form, specialization: e.target.value })}
                required
                style={{ width: "100%" }}
              >
                <option value="">— Select Specialization —</option>
                {specializations.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* EMAIL */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email" className="form-control"
                placeholder="doctor@cityhospital.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{ width: "100%" }}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ width: "100%", paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShow(!showPass)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#7a92ab"
                }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type={showPass ? "text" : "password"}
                className="form-control"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                required
                style={{ width: "100%" }}
              />
              {form.confirmPassword && (
                <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: form.password === form.confirmPassword ? "#15803d" : "#dc2626" }}>
                  {form.password === form.confirmPassword ? "✅ Passwords match" : "❌ Passwords do not match"}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: 12,
              background: loading ? "#93c5fd" : "#1d6fa4",
              color: "#fff", border: "none", borderRadius: 8,
              fontSize: 15, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif"
            }}>
              {loading ? "Creating account..." : "Register as Doctor →"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <div style={{
            marginTop: 24, paddingTop: 20,
            borderTop: "1px solid #f0f4f8",
            textAlign: "center", fontSize: 14, color: "#7a92ab"
          }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1d6fa4", fontWeight: 700, textDecoration: "none" }}>
              Sign in →
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