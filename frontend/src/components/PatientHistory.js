import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function PatientHistory() {
  const [patients,  setPatients]  = useState([]);
  const [selected,  setSelected]  = useState("");
  const [history,   setHistory]   = useState(null);
  const [tab,       setTab]       = useState("appointments");
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    axios.get(`${API}/patients`).then(r => setPatients(r.data));
  }, []);

  const loadHistory = async (id) => {
    if (!id) { setHistory(null); return; }
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/patients/${id}/history`);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = e => {
    setSelected(e.target.value);
    setTab("appointments");
    loadHistory(e.target.value);
  };

  const patient = history?.patient;

  const statusBadge = (status) => {
    const map = {
      Pending:   { bg: "#fef3c7", color: "#92400e" },
      Completed: { bg: "#dcfce7", color: "#14532d" },
      Cancelled: { bg: "#fee2e2", color: "#991b1b" }
    };
    const s = map[status] || map.Pending;
    return (
      <span style={{ ...s, display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
        {status}
      </span>
    );
  };

  const payBadge = (status) => {
    const map = {
      Paid:    { bg: "#dcfce7", color: "#14532d" },
      Pending: { bg: "#fef3c7", color: "#92400e" },
      Partial: { bg: "#dbeafe", color: "#1e40af" }
    };
    const s = map[status] || map.Pending;
    return (
      <span style={{ ...s, display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
        {status}
      </span>
    );
  };

  const typeBadge = (type) => (
    <span style={{
      display: "inline-block", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
      background: type === "Inpatient" ? "#dbeafe" : "#dcfce7",
      color:      type === "Inpatient" ? "#1d4ed8" : "#15803d"
    }}>
      {type === "Inpatient" ? "🛏️ Inpatient" : "🚶 Outpatient"}
    </span>
  );

  const TABS = [
    { id: "appointments",  label: "📅 Appointments",  count: history?.appointments?.length },
    { id: "prescriptions", label: "💊 Prescriptions", count: history?.prescriptions?.length },
    { id: "billing",       label: "🧾 Billing",        count: history?.bills?.length },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Patient History</h2>
          <p className="page-subtitle">View complete medical history for any patient</p>
        </div>
      </div>

      {/* Patient Selector */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body">
          <label className="form-label">Select Patient</label>
          <select className="form-control" value={selected} onChange={handleSelect}
            style={{ maxWidth: 400 }}>
            <option value="">— Choose a patient —</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>
                {p.name} · {p.age}y · {p.gender} · {p.type || "Outpatient"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>Loading history...</div>
      )}

      {history && patient && (
        <>
          {/* Patient Banner */}
          <div style={{
            background: "linear-gradient(135deg, #0f2744, #1d6fa4)",
            borderRadius: 12, padding: "20px 28px", marginBottom: 24,
            display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center"
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <h3 style={{ color: "#fff", margin: 0, fontSize: 22, fontWeight: 700 }}>{patient.name}</h3>
                {typeBadge(patient.type || "Outpatient")}
              </div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  ["Age",     `${patient.age} yrs`],
                  ["Gender",  patient.gender],
                  ["Phone",   patient.phone],
                  ["Address", patient.address],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600 }}>{label}</div>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{val}</div>
                  </div>
                ))}
                {patient.diagnosis && (
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600 }}>Diagnosis</div>
                    <div style={{ color: "#fcd34d", fontSize: 14, fontWeight: 600 }}>{patient.diagnosis}</div>
                  </div>
                )}
              </div>
              {patient.type === "Inpatient" && (patient.bedNumber || patient.ward) && (
                <div style={{ marginTop: 8, display: "flex", gap: 16 }}>
                  {patient.bedNumber && (
                    <div>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Bed: </span>
                      <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{patient.bedNumber}</span>
                    </div>
                  )}
                  {patient.ward && (
                    <div>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Ward: </span>
                      <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{patient.ward}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Summary counts */}
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: "Appointments",  val: history.appointments?.length  || 0 },
                { label: "Prescriptions", val: history.prescriptions?.length || 0 },
                { label: "Bills",         val: history.bills?.length         || 0 },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 20px" }}>
                  <div style={{ color: "#fff", fontSize: 26, fontWeight: 800 }}>{s.val}</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "2px solid #e5e7eb" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 600,
                  color:       tab === t.id ? "#1d6fa4" : "#6b7280",
                  borderBottom: tab === t.id ? "2px solid #1d6fa4" : "2px solid transparent",
                  marginBottom: -2
                }}>
                {t.label} {t.count !== undefined && <span style={{ marginLeft: 6, background: "#e5e7eb", borderRadius: 20, padding: "1px 8px", fontSize: 12 }}>{t.count}</span>}
              </button>
            ))}
          </div>

          {/* ── APPOINTMENTS TAB ── */}
          {tab === "appointments" && (
            <div className="card">
              <div className="card-body" style={{ padding: 0 }}>
                {history.appointments?.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No appointments found</div>
                ) : (
                  <table className="data-table" style={{ width: "100%" }}>
                    <thead>
                      <tr><th>Date</th><th>Doctor</th><th>Specialization</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {history.appointments.map(a => (
                        <tr key={a._id}>
                          <td>{a.date || "—"}</td>
                          <td style={{ fontWeight: 600 }}>{a.doctor?.name || "—"}</td>
                          <td style={{ color: "#6b7280", fontSize: 13 }}>{a.doctor?.specialization || "—"}</td>
                          <td>{statusBadge(a.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── PRESCRIPTIONS TAB ── */}
          {tab === "prescriptions" && (
            <div>
              {history.prescriptions?.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No prescriptions found</div>
              ) : history.prescriptions.map(rx => (
                <div key={rx._id} className="card" style={{ marginBottom: 16 }}>
                  <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="card-title">Dr. {rx.doctor?.name || "Unknown"}</span>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                      {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString("en-IN") : ""}
                    </span>
                  </div>
                  <div className="card-body">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Medicines</div>
                        {rx.medicines?.length ? rx.medicines.map(m => (
                          <div key={m._id} style={{ padding: "4px 0", fontSize: 13, color: "#1f2937", borderBottom: "1px solid #f3f4f6" }}>
                            💊 {m.name}
                          </div>
                        )) : <div style={{ color: "#9ca3af", fontSize: 13 }}>None prescribed</div>}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Lab Tests</div>
                        {rx.labtests?.length ? rx.labtests.map(l => (
                          <div key={l._id} style={{ padding: "4px 0", fontSize: 13, color: "#1f2937", borderBottom: "1px solid #f3f4f6" }}>
                            🧪 {l.testName}
                          </div>
                        )) : <div style={{ color: "#9ca3af", fontSize: 13 }}>None ordered</div>}
                      </div>
                    </div>
                    {rx.notes && (
                      <div style={{ marginTop: 12, padding: "8px 12px", background: "#fef9c3", borderRadius: 6, fontSize: 13, color: "#713f12" }}>
                        📝 {rx.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── BILLING TAB ── */}
          {tab === "billing" && (
            <div className="card">
              <div className="card-body" style={{ padding: 0 }}>
                {history.bills?.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No bills found</div>
                ) : (
                  <table className="data-table" style={{ width: "100%" }}>
                    <thead>
                      <tr><th>Date</th><th>Doctor</th><th>Grand Total</th><th>Payment</th><th>Method</th></tr>
                    </thead>
                    <tbody>
                      {history.bills.map(b => (
                        <tr key={b._id}>
                          <td>{b.billDate ? new Date(b.billDate).toLocaleDateString("en-IN") : "—"}</td>
                          <td>{b.doctor?.name || "—"}</td>
                          <td style={{ fontWeight: 700, color: "#0f2744" }}>₹{b.grandTotal?.toLocaleString("en-IN")}</td>
                          <td>{payBadge(b.paymentStatus)}</td>
                          <td style={{ fontSize: 13, color: "#6b7280" }}>{b.paymentMethod || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={2} style={{ textAlign: "right", fontWeight: 700, padding: "10px 12px", color: "#374151" }}>Total Billed:</td>
                        <td style={{ fontWeight: 800, color: "#0f2744", fontSize: 16 }}>
                          ₹{history.bills.reduce((s, b) => s + (b.grandTotal || 0), 0).toLocaleString("en-IN")}
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {!selected && !loading && (
        <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Select a patient to view their history</div>
        </div>
      )}
    </div>
  );
}