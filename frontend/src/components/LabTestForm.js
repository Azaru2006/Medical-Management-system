import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function LabTestForm() {
  const [tests, setTests]   = useState([]);
  const [showForm, setShow] = useState(false);
  const [form, setForm]     = useState({ testName: "", description: "", price: "" });
  const [saved, setSaved]   = useState(false);

  useEffect(() => { fetchTests(); }, []);

  const fetchTests = async () => {
    const r = await axios.get(`${API}/labtests`);
    setTests(r.data);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post(`${API}/labtests`, form);
    setForm({ testName: "", description: "", price: "" });
    setSaved(true); setShow(false);
    fetchTests();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this test?")) return;
    await axios.delete(`${API}/labtests/${id}`);
    fetchTests();
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Lab Tests</h2>
          <p className="page-subtitle">Manage available laboratory tests</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShow(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Add Lab Test"}
        </button>
      </div>

      {saved && <div style={{ background: "#dcfce7", color: "#14532d", border: "1px solid #86efac", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontWeight: 600, fontSize: 14 }}>✅ Lab test added!</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><span className="card-title">Add Lab Test</span></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ marginBottom: 18 }}>
                <div className="form-group">
                  <label className="form-label">Test Name</label>
                  <input name="testName" className="form-control" placeholder="e.g. Complete Blood Count" value={form.testName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input name="price" type="number" className="form-control" placeholder="0.00" value={form.price} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 18 }}>
                <label className="form-label">Description</label>
                <input name="description" className="form-control" placeholder="Brief description" value={form.description} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary">Add Lab Test</button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Lab Tests</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{tests.length} tests</span>
        </div>
        <div className="table-wrap">
          {tests.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🔬</div><p>No lab tests added yet</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Test Name</th><th>Description</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>
                {tests.map(t => (
                  <tr key={t._id}>
                    <td><strong>{t.testName}</strong></td>
                    <td>{t.description || "—"}</td>
                    <td>{t.price ? `₹${t.price}` : "—"}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}>Delete</button></td>
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