import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function AppointmentForm() {
  const [patients, setPatients]         = useState([]);
  const [doctors, setDoctors]           = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState({ patient: "", doctor: "", date: "", status: "Pending" });

  useEffect(() => {
    axios.get(`${API}/patients`).then(r => setPatients(r.data));
    axios.get(`${API}/doctors`).then(r => setDoctors(r.data));
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const r = await axios.get(`${API}/appointments`);
    setAppointments(r.data);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post(`${API}/appointments`, form);
    setForm({ patient: "", doctor: "", date: "", status: "Pending" });
    setShowForm(false);
    fetchAppointments();
  };

  const handleComplete = async id => {
    await axios.patch(`${API}/appointments/${id}/complete`);
    fetchAppointments();
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this appointment?")) return;
    await axios.delete(`${API}/appointments/${id}`);
    fetchAppointments();
  };

  const badgeClass = s => s === "Completed" ? "badge-complete" : s === "Cancelled" ? "badge-cancel" : "badge-pending";

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Appointments</h2>
          <p className="page-subtitle">Schedule and manage patient appointments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ New Appointment"}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><span className="card-title">Create Appointment</span></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ marginBottom: 18 }}>
                <div className="form-group">
                  <label className="form-label">Patient</label>
                  <select name="patient" className="form-control" onChange={handleChange} required value={form.patient}>
                    <option value="">Select Patient</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Doctor</label>
                  <select name="doctor" className="form-control" onChange={handleChange} required value={form.doctor}>
                    <option value="">Select Doctor</option>
                    {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" name="date" className="form-control" onChange={handleChange} required value={form.date} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select name="status" className="form-control" onChange={handleChange} value={form.status}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Create Appointment</button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Appointments</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{appointments.length} total</span>
        </div>
        <div className="table-wrap">
          {appointments.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🗓</div><p>No appointments yet</p></div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a._id}>
                    <td><strong>{a.patient?.name || "—"}</strong></td>
                    <td>{a.doctor?.name || "—"}</td>
                    <td>{a.date}</td>
                    <td><span className={`badge ${badgeClass(a.status)}`}>{a.status}</span></td>
                    <td style={{ display: "flex", gap: 8 }}>
                      {a.status === "Pending" && (
                        <button className="btn btn-success btn-sm" onClick={() => handleComplete(a._id)}>✓ Complete</button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a._id)}>Delete</button>
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