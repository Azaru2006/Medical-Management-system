import React, { useEffect, useState } from "react";
import axios from "axios";
import TestReportPrint from "./TestReportPrint";

const API = "http://localhost:5000/api";

export default function TestReportList() {
  const [reports, setReports]   = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    const r = await axios.get(`${API}/testreports`);
    setReports(r.data);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this report?")) return;
    await axios.delete(`${API}/testreports/${id}`);
    if (selected?._id === id) setSelected(null);
    fetchReports();
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.2fr" : "1fr", gap: 24 }}>
      {/* LIST */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Test Reports</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{reports.length} reports</span>
        </div>
        <div className="table-wrap">
          {reports.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🧪</div><p>No test reports yet</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Patient</th><th>Test</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r._id} style={selected?._id === r._id ? { background: "#eff6ff" } : {}}>
                    <td><strong>{r.patient?.name || "—"}</strong></td>
                    <td>{r.labtest?.testName || "—"}</td>
                    <td>{new Date(r.date).toLocaleDateString("en-IN")}</td>
                    <td style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => setSelected(r)}>🖨️ Print</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* PRINT PREVIEW */}
      {selected && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Print Preview</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕ Close</button>
          </div>
          <div className="card-body">
            <TestReportPrint report={selected} />
          </div>
        </div>
      )}
    </div>
  );
}