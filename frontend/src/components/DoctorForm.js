import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function DoctorForm({ onAdded }) {
  const [form, setForm]     = useState({ name: "", specialization: "", phone: "", email: "" });
  const [showForm, setShow] = useState(false);
  const [saved, setSaved]   = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post(`${API}/doctors`, form);
    setForm({ name: "", specialization: "", phone: "", email: "" });
    setSaved(true);
    setShow(false);
    setTimeout(() => setSaved(false), 3000);
    if (onAdded) onAdded();
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Doctors</h2>
          <p className="page-subtitle">Manage hospital doctors and specialists</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShow(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Add Doctor"}
        </button>
      </div>

      {saved && (
        <div style={{ background: "#dcfce7", color: "#14532d", border: "1px solid #86efac", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontWeight: 600, fontSize: 14 }}>
          ✅ Doctor added successfully!
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><span className="card-title">New Doctor</span></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ marginBottom: 18 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input name="name" className="form-control" placeholder="Dr. John Smith" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input name="specialization" className="form-control" placeholder="e.g. Cardiologist" value={form.specialization} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input name="phone" className="form-control" placeholder="+91 99999 99999" value={form.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input name="email" type="email" className="form-control" placeholder="doctor@hospital.com" value={form.email} onChange={handleChange} />
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