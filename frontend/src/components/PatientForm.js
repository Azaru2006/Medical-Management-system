import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function PatientForm() {
  const [patients, setPatients] = useState([]);
  const [showForm, setShow]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [form, setForm]         = useState({ name: "", age: "", gender: "", phone: "", address: "" });

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    const r = await axios.get(`${API}/patients`);
    setPatients(r.data);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post(`${API}/patients`, form);
    setForm({ name: "", age: "", gender: "", phone: "", address: "" });
    setSaved(true);
    setShow(false);
    fetchPatients();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this patient?")) return;
    await axios.delete(`${API}/patients/${id}`);
    fetchPatients();
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Patients</h2>
          <p className="page-subtitle">Manage patient registrations</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShow(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Register Patient"}
        </button>
      </div>

      {saved && (
        <div style={{ background: "#dcfce7", color: "#14532d", border: "1px solid #86efac", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontWeight: 600, fontSize: 14 }}>
          ✅ Patient registered successfully!
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><span className="card-title">Register New Patient</span></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ marginBottom: 18 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input name="name" className="form-control" placeholder="Patient full name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input name="age" type="number" className="form-control" placeholder="Age" value={form.age} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select name="gender" className="form-control" value={form.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input name="phone" className="form-control" placeholder="+91 99999 99999" value={form.phone} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">Address</label>
                <input name="address" className="form-control" placeholder="Address" value={form.address} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary">Register Patient</button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Patients</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{patients.length} registered</span>
        </div>
        <div className="table-wrap">
          {patients.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🧑‍🤝‍🧑</div><p>No patients registered yet</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Actions</th></tr></thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p._id}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.age || "—"}</td>
                    <td>{p.gender || "—"}</td>
                    <td>{p.phone || "—"}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}