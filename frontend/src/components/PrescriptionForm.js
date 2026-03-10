import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function PrescriptionForm({ onAdded }) {

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [labtests, setLabtests] = useState([]);

  const [showForm, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    medicines: [],
    labtests: [],
    notes: ""
  });

  useEffect(() => {
    axios.get(`${API}/patients`).then(r => setPatients(r.data));
    axios.get(`${API}/doctors`).then(r => setDoctors(r.data));
    axios.get(`${API}/medicines`).then(r => setMedicines(r.data));
    axios.get(`${API}/labtests`).then(r => setLabtests(r.data));
  }, []);

  // toggle medicine selection
  const toggleMedicine = (id) => {

    const existing = form.medicines.find(m => m.medicine === id);

    if (existing) {
      setForm({
        ...form,
        medicines: form.medicines.filter(m => m.medicine !== id)
      });
    } else {
      setForm({
        ...form,
        medicines: [
          ...form.medicines,
          { medicine: id, dosage: "", instruction: "" }
        ]
      });
    }
  };

  // update dosage or instruction
  const updateMedicineField = (id, field, value) => {

    const updated = form.medicines.map(m =>
      m.medicine === id ? { ...m, [field]: value } : m
    );

    setForm({ ...form, medicines: updated });
  };

  // toggle labtests
  const toggleLabtest = (id) => {

    const arr = form.labtests;

    setForm({
      ...form,
      labtests: arr.includes(id)
        ? arr.filter(x => x !== id)
        : [...arr, id]
    });
  };

  // submit form
  const handleSubmit = async (e) => {

    e.preventDefault();

    await axios.post(`${API}/prescriptions`, form);

    setForm({
      patient: "",
      doctor: "",
      medicines: [],
      labtests: [],
      notes: ""
    });

    setSaved(true);
    setShow(false);

    setTimeout(() => setSaved(false), 3000);

    if (onAdded) onAdded();
  };

  return (

    <div style={{ marginBottom: 24 }}>

      <div className="page-header">

        <div>
          <h2 className="page-title">Prescriptions</h2>
          <p className="page-subtitle">
            Create and manage patient prescriptions
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShow(!showForm)}
        >
          {showForm ? "Cancel" : "+ New Prescription"}
        </button>

      </div>

      {saved && (
        <div
          style={{
            background: "#dcfce7",
            color: "#14532d",
            border: "1px solid #86efac",
            borderRadius: 8,
            padding: "10px 16px",
            marginBottom: 16,
            fontWeight: 600
          }}
        >
          ✅ Prescription created!
        </div>
      )}

      {showForm && (

        <div className="card" style={{ marginBottom: 24 }}>

          <div className="card-header">
            <span className="card-title">New Prescription</span>
          </div>

          <div className="card-body">

            <form onSubmit={handleSubmit}>

              {/* Patient + Doctor */}

              <div className="form-grid" style={{ marginBottom: 18 }}>

                <div className="form-group">
                  <label className="form-label">Patient</label>

                  <select
                    className="form-control"
                    value={form.patient}
                    onChange={(e) =>
                      setForm({ ...form, patient: e.target.value })
                    }
                    required
                  >

                    <option value="">Select Patient</option>

                    {patients.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}

                  </select>
                </div>

                <div className="form-group">

                  <label className="form-label">Doctor</label>

                  <select
                    className="form-control"
                    value={form.doctor}
                    onChange={(e) =>
                      setForm({ ...form, doctor: e.target.value })
                    }
                    required
                  >

                    <option value="">Select Doctor</option>

                    {doctors.map(d => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}

                  </select>

                </div>

              </div>

              {/* Medicines */}

              <div className="form-group" style={{ marginBottom: 18 }}>

                <label className="form-label">
                  Medicines
                </label>

                {medicines.map(m => {

                  const selected = form.medicines.find(
                    x => x.medicine === m._id
                  );

                  return (

                    <div key={m._id} style={{ marginBottom: 12 }}>

                      <div
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px 12px",
                          borderRadius: 6,
                          cursor: "pointer",
                          background: selected ? "#eff6ff" : "#fff"
                        }}

                        onClick={() => toggleMedicine(m._id)}
                      >

                        {selected ? "☑" : "☐"} {m.name}

                      </div>

                      {selected && (

                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            marginTop: 6
                          }}
                        >

                          <input
                            className="form-control"
                            placeholder="Dosage"
                            value={selected.dosage}
                            onChange={(e) =>
                              updateMedicineField(
                                m._id,
                                "dosage",
                                e.target.value
                              )
                            }
                          />

                          <input
                            className="form-control"
                            placeholder="Instruction"
                            value={selected.instruction}
                            onChange={(e) =>
                              updateMedicineField(
                                m._id,
                                "instruction",
                                e.target.value
                              )
                            }
                          />

                        </div>

                      )}

                    </div>

                  );

                })}

              </div>

              {/* Lab Tests */}

              <div className="form-group" style={{ marginBottom: 18 }}>

                <label className="form-label">
                  Lab Tests
                </label>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>

                  {labtests.map(t => (

                    <div
                      key={t._id}

                      onClick={() => toggleLabtest(t._id)}

                      style={{
                        padding: "6px 10px",
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        cursor: "pointer",
                        background: form.labtests.includes(t._id)
                          ? "#eff6ff"
                          : "#fff"
                      }}
                    >

                      {form.labtests.includes(t._id) ? "☑" : "☐"} {t.testName}

                    </div>

                  ))}

                </div>

              </div>

              {/* Notes */}

              <div className="form-group" style={{ marginBottom: 20 }}>

                <label className="form-label">Notes</label>

                <textarea
                  className="form-control"
                  rows={3}
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                />

              </div>

              <button type="submit" className="btn btn-primary">
                Create Prescription
              </button>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}