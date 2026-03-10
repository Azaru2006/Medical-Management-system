import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function TestReportForm() {
  const [patients, setPatients] = useState([]);
  const [tests, setTests]       = useState([]);
  const [items, setItems]       = useState([{ parameter: "", result: "", normalRange: "" }]);
  const [form, setForm]         = useState({ patient: "", labtest: "", remarks: "" });
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    axios.get(`${API}/patients`).then(r => setPatients(r.data));
    axios.get(`${API}/labtests`).then(r => setTests(r.data));
  }, []);

  const addRow = () => setItems([...items, { parameter: "", result: "", normalRange: "" }]);
  const removeRow = i => setItems(items.filter((_, idx) => idx !== i));

  const handleRowChange = (i, field, val) => {
    const updated = [...items];
    updated[i][field] = val;
    setItems(updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post(`${API}/testreports`, { ...form, items });
    setSaved(true);
    setForm({ patient: "", labtest: "", remarks: "" });
    setItems([{ parameter: "", result: "", normalRange: "" }]);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Test Reports</h2>
          <p className="page-subtitle">Add and manage laboratory test reports</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header"><span className="card-title">Add New Test Report</span></div>
        <div className="card-body">
          {saved && (
            <div style={{ background: "#dcfce7", color: "#14532d", border: "1px solid #86efac", borderRadius: 8, padding: "10px 16px", marginBottom: 18, fontWeight: 600, fontSize: 14 }}>
              ✅ Report saved successfully!
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Patient</label>
                <select className="form-control" value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })} required>
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Lab Test</label>
                <select className="form-control" value={form.labtest} onChange={e => setForm({ ...form, labtest: e.target.value })} required>
                  <option value="">Select Test</option>
                  {tests.map(t => <option key={t._id} value={t._id}>{t.testName}</option>)}
                </select>
              </div>
            </div>

            {/* PARAMETERS TABLE */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <label className="form-label">Test Parameters</label>
                <button type="button" className="btn btn-ghost btn-sm" onClick={addRow}>+ Add Row</button>
              </div>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th>Parameter</th><th>Result</th><th>Normal Range</th><th></th></tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td><input className="form-control" placeholder="e.g. Hemoglobin" value={item.parameter} onChange={e => handleRowChange(i, "parameter", e.target.value)} /></td>
                        <td><input className="form-control" placeholder="e.g. 13.5 g/dL" value={item.result} onChange={e => handleRowChange(i, "result", e.target.value)} /></td>
                        <td><input className="form-control" placeholder="e.g. 12–17 g/dL" value={item.normalRange} onChange={e => handleRowChange(i, "normalRange", e.target.value)} /></td>
                        <td>
                          {items.length > 1 && (
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeRow(i)}>✕</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Remarks</label>
              <textarea className="form-control" rows={3} placeholder="Any additional remarks..." value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
            </div>

            <button type="submit" className="btn btn-primary">💾 Save Report</button>
          </form>
        </div>
      </div>
    </>
  );
}