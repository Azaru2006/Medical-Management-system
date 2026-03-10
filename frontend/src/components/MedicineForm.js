import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function MedicineForm() {
  const [medicines, setMedicines] = useState([]);
  const [showForm, setShow]       = useState(false);
  const [form, setForm]           = useState({ name: "", type: "", company: "", price: "" });
  const [saved, setSaved]         = useState(false);

  useEffect(() => { fetchMedicines(); }, []);

  const fetchMedicines = async () => {
    const r = await axios.get(`${API}/medicines`);
    setMedicines(r.data);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post(`${API}/medicines`, form);
    setForm({ name: "", type: "", company: "", price: "" });
    setSaved(true); setShow(false);
    fetchMedicines();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this medicine?")) return;
    await axios.delete(`${API}/medicines/${id}`);
    fetchMedicines();
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Medicines</h2>
          <p className="page-subtitle">Manage medicine inventory</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShow(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Add Medicine"}
        </button>
      </div>

      {saved && <div style={{ background: "#dcfce7", color: "#14532d", border: "1px solid #86efac", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontWeight: 600, fontSize: 14 }}>✅ Medicine added!</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><span className="card-title">Add Medicine</span></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ marginBottom: 18 }}>
                <div className="form-group">
                  <label className="form-label">Medicine Name</label>
                  <input name="name" className="form-control" placeholder="e.g. Paracetamol" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <input name="type" className="form-control" placeholder="e.g. Tablet, Syrup" value={form.type} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input name="company" className="form-control" placeholder="Manufacturer" value={form.company} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input name="price" type="number" className="form-control" placeholder="0.00" value={form.price} onChange={handleChange} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Add Medicine</button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <span className="card-title">Medicine Inventory</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{medicines.length} items</span>
        </div>
        <div className="table-wrap">
          {medicines.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">💊</div><p>No medicines added yet</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Name</th><th>Type</th><th>Company</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>
                {medicines.map(m => (
                  <tr key={m._id}>
                    <td><strong>{m.name}</strong></td>
                    <td>{m.type || "—"}</td>
                    <td>{m.company || "—"}</td>
                    <td>{m.price ? `₹${m.price}` : "—"}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id)}>Delete</button></td>
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