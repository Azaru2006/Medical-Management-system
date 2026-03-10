import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    const r = await axios.get(`${API}/doctors`);
    setDoctors(r.data);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this doctor?")) return;
    await axios.delete(`${API}/doctors/${id}`);
    fetchDoctors();
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">All Doctors</span>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{doctors.length} registered</span>
      </div>
      <div className="table-wrap">
        {doctors.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">👨‍⚕️</div><p>No doctors registered yet</p></div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Name</th><th>Specialization</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>
            <tbody>
              {doctors.map(d => (
                <tr key={d._id}>
                  <td><strong>{d.name}</strong></td>
                  <td>{d.specialization || "—"}</td>
                  <td>{d.phone || "—"}</td>
                  <td>{d.email || "—"}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}