import React, { useEffect, useState } from "react";
import axios from "axios";
import PrescriptionPrint from "./PrescriptionPrint";

const API = "http://localhost:5000/api";

export default function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selected, setSelected]           = useState(null);

  useEffect(() => { fetchPrescriptions(); }, []);

  const fetchPrescriptions = async () => {
    const r = await axios.get(`${API}/prescriptions`);
    setPrescriptions(r.data);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this prescription?")) return;
    await axios.delete(`${API}/prescriptions/${id}`);
    if (selected?._id === id) setSelected(null);
    fetchPrescriptions();
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.2fr" : "1fr", gap: 24 }}>
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Prescriptions</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{prescriptions.length} total</span>
        </div>
        <div className="table-wrap">
          {prescriptions.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📋</div><p>No prescriptions yet</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Patient</th><th>Doctor</th><th>Medicines</th><th>Lab Tests</th><th>Actions</th></tr></thead>
              <tbody>
                {prescriptions.map(p => (
                  <tr key={p._id} style={selected?._id === p._id ? { background: "#eff6ff" } : {}}>
                    <td><strong>{p.patient?.name || "—"}</strong></td>
                    <td>{p.doctor?.name || "—"}</td>
                    <td>{p.medicines?.length || 0} item(s)</td>
                    <td>{p.labtests?.length || 0} test(s)</td>
                    <td style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => setSelected(p)}>🖨️ Print</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Print Preview</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕ Close</button>
          </div>
          <div className="card-body">
            <PrescriptionPrint prescription={selected} />
          </div>
        </div>
      )}
    </div>
  );
}