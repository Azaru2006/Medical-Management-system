import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function PatientHistory() {
  const [patients,        setPatients]        = useState([]);
  const [history,         setHistory]         = useState(null);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loading,         setLoading]         = useState(false);
  const [activeTab,       setActiveTab]       = useState("appointments");

  useEffect(() => {
    axios.get(`${API}/patients`).then(r => setPatients(r.data)).catch(console.log);
  }, []);

  const loadHistory = async (patientId) => {
    setSelectedPatient(patientId);
    setHistory(null);
    if (!patientId) return;
    setLoading(true);
    try {
      const r = await axios.get(`${API}/patient-history/${patientId}`);
      setHistory(r.data);
      setActiveTab("appointments");
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const selectedName = patients.find(p => p._id === selectedPatient)?.name;

  const badgeClass = s =>
    s === "Completed" ? "badge-complete" : s === "Cancelled" ? "badge-cancel" : "badge-pending";

  const tabStyle = (tab) => ({
    padding: "10px 20px",
    border: "none",
    borderBottom: activeTab === tab ? "3px solid var(--blue)" : "3px solid transparent",
    background: "transparent",
    color: activeTab === tab ? "var(--blue)" : "var(--text-muted)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Patient History</h2>
          <p className="page-subtitle">View complete medical history for any patient</p>
        </div>
      </div>

      {/* PATIENT SELECTOR */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body">
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Select Patient</label>
              <select
                className="form-control"
                value={selectedPatient}
                onChange={e => loadHistory(e.target.value)}
              >
                <option value="">— Choose a patient —</option>
                {patients.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            {selectedPatient && (
              <button
                className="btn btn-ghost"
                onClick={() => { setSelectedPatient(""); setHistory(null); }}
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <p>Loading history...</p>
          </div>
        </div>
      )}

      {/* NO SELECTION */}
      {!selectedPatient && !loading && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <p>Select a patient above to view their medical history</p>
          </div>
        </div>
      )}

      {/* HISTORY */}
      {history && !loading && (
        <>
          {/* PATIENT BANNER */}
          <div style={{
            background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)",
            borderRadius: "var(--radius)",
            padding: "20px 28px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 20,
            boxShadow: "var(--shadow-lg)"
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24
            }}>🧑‍⚕️</div>
            <div>
              <div style={{ color: "#fff", fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 700 }}>
                {selectedName}
              </div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 2 }}>
                {history.appointments?.length || 0} appointments &nbsp;•&nbsp;
                {history.prescriptions?.length || 0} prescriptions
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="card">
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)", paddingLeft: 8 }}>
              <button style={tabStyle("appointments")} onClick={() => setActiveTab("appointments")}>
                🗓 Appointments ({history.appointments?.length || 0})
              </button>
              <button style={tabStyle("prescriptions")} onClick={() => setActiveTab("prescriptions")}>
                📋 Prescriptions ({history.prescriptions?.length || 0})
              </button>
            </div>

            {/* APPOINTMENTS TAB */}
            {activeTab === "appointments" && (
              <div className="table-wrap">
                {!history.appointments?.length ? (
                  <div className="empty-state">
                    <div className="empty-icon">🗓</div>
                    <p>No appointments found for this patient</p>
                  </div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Doctor</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.appointments.map(a => (
                        <tr key={a._id}>
                          <td>{a.date || "—"}</td>
                          <td><strong>{a.doctor?.name || "—"}</strong></td>
                          <td>
                            <span className={`badge ${badgeClass(a.status)}`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* PRESCRIPTIONS TAB */}
            {activeTab === "prescriptions" && (
              <div className="card-body">
                {!history.prescriptions?.length ? (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>No prescriptions found for this patient</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {history.prescriptions.map((p, i) => (
                      <div key={p._id} style={{
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden"
                      }}>
                        {/* Prescription Header */}
                        <div style={{
                          background: "#f5f8fc",
                          padding: "12px 18px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid var(--border)"
                        }}>
                          <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 14 }}>
                            Prescription #{i + 1}
                          </div>
                          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                            Dr. {p.doctor?.name || "—"}
                          </div>
                        </div>

                        <div style={{ padding: "16px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          {/* Medicines */}
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-muted)", marginBottom: 8 }}>
                              💊 Medicines
                            </div>
                            {p.medicines?.length > 0 ? (
                              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {p.medicines.map((m, idx) => (
                                  <li key={idx} style={{
                                    padding: "7px 10px",
                                    borderBottom: "1px solid #f0f4f8",
                                    fontSize: 14,
                                    color: "var(--text-mid)",
                                    display: "flex", alignItems: "center", gap: 8
                                  }}>
                                    <span style={{ color: "var(--blue)", fontWeight: 700 }}>•</span>
                                    {m.medicine?.name || m.name || m}
                                    {m.dosage && <span style={{ color: "var(--text-muted)", fontSize: 12 }}>— {m.dosage}</span>}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>None prescribed</p>
                            )}
                          </div>

                          {/* Lab Tests */}
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-muted)", marginBottom: 8 }}>
                              🔬 Lab Tests
                            </div>
                            {p.labtests?.length > 0 ? (
                              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {p.labtests.map((t, idx) => (
                                  <li key={idx} style={{
                                    padding: "7px 10px",
                                    borderBottom: "1px solid #f0f4f8",
                                    fontSize: 14,
                                    color: "var(--text-mid)",
                                    display: "flex", alignItems: "center", gap: 8
                                  }}>
                                    <span style={{ color: "var(--blue)", fontWeight: 700 }}>•</span>
                                    {t.testName || t}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>None ordered</p>
                            )}
                          </div>
                        </div>

                        {/* Notes */}
                        {p.notes && (
                          <div style={{
                            borderTop: "1px solid var(--border)",
                            padding: "10px 18px",
                            background: "#fafcff",
                            fontSize: 13,
                            color: "var(--text-mid)"
                          }}>
                            <span style={{ fontWeight: 700, color: "var(--text-muted)", marginRight: 8 }}>Notes:</span>
                            {p.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}