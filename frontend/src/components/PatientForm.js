import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const DIAGNOSIS_OPTIONS = [
  "General Check-up", "Fever / Viral Infection", "Hypertension",
  "Diabetes Mellitus", "Respiratory Infection", "Chest Pain / Cardiac",
  "Abdominal Pain", "Fracture / Orthopedic", "Skin Condition",
  "Neurological Symptoms", "Eye Complaint", "ENT Complaint",
  "Urinary Complaint", "Gynecological Complaint", "Psychiatric Evaluation",
  "Post-Surgery Follow-up", "Vaccination", "Other"
];

const WARDS = ["General Ward", "ICU", "NICU", "Maternity Ward", "Surgical Ward", "Orthopedic Ward", "Pediatric Ward", "Private Room"];

export default function PatientForm() {
  const emptyForm = {
    name: "", age: "", gender: "", phone: "", address: "",
    type: "Outpatient", diagnosis: "", bedNumber: "", admitDate: "", ward: ""
  };

  const [form, setForm]       = useState(emptyForm);
  const [patients, setPatients] = useState([]);
  const [showForm, setShow]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await axios.get(`${API}/patients`);
      setPatients(data);
    } catch (err) { console.error(err); }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API}/patients`, form);
      setForm(emptyForm);
      setSaved(true);
      setShow(false);
      setTimeout(() => setSaved(false), 3000);
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register patient");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    await axios.delete(`${API}/patients/${id}`);
    fetchPatients();
  };

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.phone.includes(search);
    const matchType   = filterType === "All" || p.type === filterType;
    return matchSearch && matchType;
  });

  const typeBadge = (type) => ({
    display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
    background: type === "Inpatient" ? "#dbeafe" : "#dcfce7",
    color:      type === "Inpatient" ? "#1d4ed8" : "#15803d"
  });

  return (
    <div>
      {/* ── HEADER ── */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Patients</h2>
          <p className="page-subtitle">Register and manage inpatients & outpatients</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShow(!showForm); setError(""); }}>
          {showForm ? "✕ Cancel" : "+ Register Patient"}
        </button>
      </div>

      {/* ── TOAST ── */}
      {saved && (
        <div style={{ background:"#dcfce7", color:"#14532d", border:"1px solid #86efac", borderRadius:8, padding:"10px 16px", marginBottom:16, fontWeight:600, fontSize:14 }}>
          ✅ Patient registered successfully!
        </div>
      )}
      {error && (
        <div style={{ background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5", borderRadius:8, padding:"10px 16px", marginBottom:16, fontWeight:600, fontSize:14 }}>
          ❌ {error}
        </div>
      )}

      {/* ── FORM ── */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><span className="card-title">Register New Patient</span></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>

              {/* Patient Type Toggle */}
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Patient Type *</label>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  {["Outpatient", "Inpatient"].map(t => (
                    <label key={t} style={{
                      display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                      padding: "8px 18px", borderRadius: 8, fontWeight: 600, fontSize: 14,
                      border: `2px solid ${form.type === t ? "#1d6fa4" : "#d1d5db"}`,
                      background: form.type === t ? "#eff6ff" : "#fff",
                      color: form.type === t ? "#1d6fa4" : "#6b7280"
                    }}>
                      <input
                        type="radio" name="type" value={t}
                        checked={form.type === t} onChange={handleChange}
                        style={{ accentColor: "#1d6fa4" }}
                      />
                      {t === "Outpatient" ? "🚶 Outpatient" : "🛏️ Inpatient"}
                    </label>
                  ))}
                </div>
              </div>

              {/* Basic Info */}
              <div className="form-grid" style={{ marginBottom: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input name="name" className="form-control" placeholder="Patient full name"
                    value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Age *</label>
                  <input name="age" type="number" className="form-control" placeholder="Age in years"
                    value={form.age} onChange={handleChange} required min={0} max={150} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select name="gender" className="form-control" value={form.gender} onChange={handleChange} required>
                    <option value="">— Select —</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input name="phone" className="form-control" placeholder="+91 99999 99999"
                    value={form.phone} onChange={handleChange} required />
                </div>
              </div>

              {/* Address */}
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Address *</label>
                <input name="address" className="form-control" placeholder="Full address"
                  value={form.address} onChange={handleChange} required />
              </div>

              {/* Diagnosis */}
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Diagnosis / Reason for Visit</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <select name="diagnosis" className="form-control" value={form.diagnosis} onChange={handleChange}
                    style={{ flex: 1 }}>
                    <option value="">— Select or type below —</option>
                    {DIAGNOSIS_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <input name="diagnosis" className="form-control" placeholder="Or type custom diagnosis..."
                  value={form.diagnosis} onChange={handleChange}
                  style={{ marginTop: 6 }} />
              </div>

              {/* Inpatient-only fields */}
              {form.type === "Inpatient" && (
                <div className="form-grid" style={{ marginBottom: 16, padding: "16px", background: "#eff6ff", borderRadius: 8, border: "1px solid #bfdbfe" }}>
                  <div style={{ gridColumn: "1/-1", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8" }}>🛏️ Inpatient Details</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bed Number</label>
                    <input name="bedNumber" className="form-control" placeholder="e.g. B-101"
                      value={form.bedNumber} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ward</label>
                    <select name="ward" className="form-control" value={form.ward} onChange={handleChange}>
                      <option value="">— Select Ward —</option>
                      {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Admit Date</label>
                    <input name="admitDate" type="date" className="form-control"
                      value={form.admitDate} onChange={handleChange} />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary">Register Patient</button>
            </form>
          </div>
        </div>
      )}

      {/* ── FILTERS ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          className="form-control"
          placeholder="🔍 Search by name or phone..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        {["All", "Outpatient", "Inpatient"].map(t => (
          <button key={t}
            onClick={() => setFilterType(t)}
            style={{
              padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: `1.5px solid ${filterType === t ? "#1d6fa4" : "#d1d5db"}`,
              background: filterType === t ? "#1d6fa4" : "#fff",
              color: filterType === t ? "#fff" : "#374151",
              cursor: "pointer"
            }}>
            {t} {t !== "All" && `(${patients.filter(p => p.type === t).length})`}
          </button>
        ))}
      </div>

      {/* ── STATS PILLS ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Patients", val: patients.length, color: "#0f2744", bg: "#e8edf5" },
          { label: "Outpatients",    val: patients.filter(p => p.type !== "Inpatient").length, color: "#15803d", bg: "#dcfce7" },
          { label: "Inpatients",     val: patients.filter(p => p.type === "Inpatient").length, color: "#1d4ed8", bg: "#dbeafe" },
        ].map(s => (
          <div key={s.label} style={{ padding: "8px 20px", borderRadius: 20, background: s.bg, color: s.color, fontWeight: 700, fontSize: 13 }}>
            {s.val} {s.label}
          </div>
        ))}
      </div>

      {/* ── TABLE ── */}
      <div className="card">
        <div className="card-header"><span className="card-title">Patient List ({filtered.length})</span></div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Age</th><th>Gender</th>
                <th>Phone</th><th>Type</th><th>Diagnosis</th>
                <th>Bed / Ward</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", color: "#9ca3af", padding: 32 }}>No patients found</td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p._id}>
                  <td style={{ color: "#6b7280", fontSize: 12 }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.age} yrs</td>
                  <td>{p.gender}</td>
                  <td>{p.phone}</td>
                  <td><span style={typeBadge(p.type)}>{p.type || "Outpatient"}</span></td>
                  <td style={{ maxWidth: 160, fontSize: 12, color: "#4b5563" }}>
                    {p.diagnosis || <span style={{ color: "#d1d5db" }}>—</span>}
                  </td>
                  <td style={{ fontSize: 12, color: "#4b5563" }}>
                    {p.type === "Inpatient"
                      ? `${p.bedNumber || "—"} · ${p.ward || "—"}`
                      : <span style={{ color: "#d1d5db" }}>—</span>}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(p._id)}
                      style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}