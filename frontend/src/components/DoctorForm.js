import React, { useState } from "react";
import axios from "axios";
import SPECIALIZATIONS from "../constants/specializations";

const API = "http://localhost:5000/api";

export default function DoctorForm({ onAdded }) {
  const [form, setForm]   = useState({ name: "", specialization: "", phone: "", email: "" });
  const [showForm, setShow] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API}/doctors`, form);
      setForm({ name: "", specialization: "", phone: "", email: "" });
      setSaved(true);
      setShow(false);
      setTimeout(() => setSaved(false), 3000);
      if (onAdded) onAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add doctor");
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Doctors</h2>
          <p className="page-subtitle">Manage hospital doctors and specialists</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShow(!showForm); setError(""); }}>
          {showForm ? "✕ Cancel" : "+ Add Doctor"}
        </button>
      </div>

      {saved && (
        <div style={{ background:"#dcfce7", color:"#14532d", border:"1px solid #86efac", borderRadius:8, padding:"10px 16px", marginBottom:16, fontWeight:600, fontSize:14 }}>
          ✅ Doctor added successfully!
        </div>
      )}
      {error && (
        <div style={{ background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5", borderRadius:8, padding:"10px 16px", marginBottom:16, fontWeight:600, fontSize:14 }}>
          ❌ {error}
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><span className="card-title">New Doctor</span></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ marginBottom: 18 }}>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    name="name"
                    className="form-control"
                    placeholder="Dr. John Smith"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* ── SPECIALIZATION DROPDOWN ── */}
                <div className="form-group">
                  <label className="form-label">Specialization *</label>
                  <select
                    name="specialization"
                    className="form-control"
                    value={form.specialization}
                    onChange={handleChange}
                    required
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">— Select Specialization —</option>
                    {SPECIALIZATIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input
                    name="phone"
                    className="form-control"
                    placeholder="+91 99999 99999"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="doctor@hospital.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

              </div>
              <button type="submit" className="btn btn-primary">Add Doctor</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}