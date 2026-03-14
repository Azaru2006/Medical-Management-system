import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SPECIALIZATIONS from "../constants/specializations";

const API = "http://localhost:5000/api";

export default function Register() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]   = useState({
    name: "", email: "", password: "", confirmPassword: "",
    specialization: "", phone: ""
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/register`, {
        name:           form.name,
        email:          form.email,
        password:       form.password,
        role:           "doctor",
        specialization: form.specialization,
        phone:          form.phone
      });
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const pwMatch = form.confirmPassword && form.password === form.confirmPassword;

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #0f2744 0%, #1d6fa4 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 16px"
          }}>🩺</div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: 0 }}>Doctor Registration</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 6, fontSize: 14 }}>Create your doctor account</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 36, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

          {error && (
            <div style={{
              background: "#fee2e2", color: "#991b1b", borderRadius: 8,
              padding: "10px 14px", marginBottom: 20, fontSize: 14, fontWeight: 600
            }}>❌ {error}</div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Full Name *
              </label>
              <input
                name="name" className="form-control"
                placeholder="Dr. Full Name"
                value={form.name} onChange={handleChange} required
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Email Address *
              </label>
              <input
                name="email" type="email" className="form-control"
                placeholder="doctor@hospital.com"
                value={form.email} onChange={handleChange} required
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Phone Number *
              </label>
              <input
                name="phone" className="form-control"
                placeholder="+91 99999 99999"
                value={form.phone} onChange={handleChange} required
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
              />
            </div>

            {/* Specialization Dropdown */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Specialization *
              </label>
              <select
                name="specialization"
                value={form.specialization} onChange={handleChange} required
                style={{
                  width: "100%", padding: "10px 12px", border: "1.5px solid #d1d5db",
                  borderRadius: 8, fontSize: 14, boxSizing: "border-box",
                  background: "#fff", cursor: "pointer"
                }}
              >
                <option value="">— Select Specialization —</option>
                {SPECIALIZATIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Password *
              </label>
              <div style={{ position: "relative" }}>
                <input
                  name="password" type={showPw ? "text" : "password"} className="form-control"
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} required
                  style={{ width: "100%", padding: "10px 40px 10px 12px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Confirm Password *
              </label>
              <input
                name="confirmPassword" type="password" className="form-control"
                placeholder="Re-enter password"
                value={form.confirmPassword} onChange={handleChange} required
                style={{
                  width: "100%", padding: "10px 12px", boxSizing: "border-box",
                  border: `1.5px solid ${form.confirmPassword ? (pwMatch ? "#22c55e" : "#ef4444") : "#d1d5db"}`,
                  borderRadius: 8, fontSize: 14
                }}
              />
              {form.confirmPassword && (
                <p style={{ fontSize: 12, marginTop: 4, color: pwMatch ? "#16a34a" : "#dc2626" }}>
                  {pwMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "12px", background: loading ? "#9ca3af" : "#1d6fa4",
                color: "#fff", border: "none", borderRadius: 8, fontSize: 15,
                fontWeight: 700, cursor: loading ? "not-allowed" : "pointer"
              }}>
              {loading ? "Registering..." : "Register as Doctor"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#6b7280" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1d6fa4", fontWeight: 600, textDecoration: "none" }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}