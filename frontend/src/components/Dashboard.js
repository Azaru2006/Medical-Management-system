import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function Dashboard() {
  const [data, setData]           = useState({});
  const [pending, setPending]     = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [dash, appts] = await Promise.all([
      axios.get(`${API}/dashboard`),
      axios.get(`${API}/appointments`),
    ]);
    setData(dash.data);
    setPending(appts.data.filter(a => a.status === "Pending"));
    setLoading(false);
  };

  const handleComplete = async (id) => {
    await axios.patch(`${API}/appointments/${id}/complete`);
    fetchAll();
  };

  const stats = [
    { label: "Total Patients",      value: data.totalPatients,      icon: "🧑‍🤝‍🧑", color: "blue"  },
    { label: "Total Doctors",       value: data.totalDoctors,       icon: "👨‍⚕️", color: "green" },
    { label: "Total Appointments",  value: data.totalAppointments,  icon: "🗓",   color: "amber" },
    { label: "Prescriptions",       value: data.totalPrescriptions, icon: "📋",   color: "cyan"  },
    { label: "Pending",             value: pending.length,          icon: "⏳",   color: "red"   },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Welcome back — here's today's overview</p>
        </div>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
        </span>
      </div>

      {/* STAT CARDS */}
      <div className="stat-grid">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-value">{loading ? "—" : (s.value ?? 0)}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* PENDING APPOINTMENTS */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">⏳ Pending Appointments</span>
          <span className="badge badge-pending">{pending.length} pending</span>
        </div>
        <div className="table-wrap">
          {pending.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <p>No pending appointments</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(a => (
                  <tr key={a._id}>
                    <td><strong>{a.patient?.name || "—"}</strong></td>
                    <td>{a.doctor?.name || "—"}</td>
                    <td>{a.date}</td>
                    <td><span className="badge badge-pending">⏳ Pending</span></td>
                    <td>
                      <button className="btn btn-success btn-sm" onClick={() => handleComplete(a._id)}>
                        ✓ Mark Complete
                      </button>
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