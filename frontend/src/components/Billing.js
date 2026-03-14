import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const CATEGORIES = ["Consultation", "Lab Test", "Medicine", "Room Charge", "Procedure", "Other"];
const PAYMENT_METHODS = ["Cash", "Card", "UPI", "Insurance"];

const emptyItem = () => ({ description: "", category: "Consultation", quantity: 1, unitPrice: "", total: 0 });

export default function Billing() {
  const [patients, setPatients] = useState([]);
  const [doctors,  setDoctors]  = useState([]);
  const [bills,    setBills]    = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");
  const [preview,  setPreview]  = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const emptyForm = {
    patient: "", doctor: "", items: [emptyItem()],
    discount: 0, tax: 0, paymentStatus: "Pending",
    paymentMethod: "", notes: ""
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    axios.get(`${API}/patients`).then(r => setPatients(r.data));
    axios.get(`${API}/doctors`).then(r => setDoctors(r.data));
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const { data } = await axios.get(`${API}/billing`);
    setBills(data);
  };

  // ── ITEM HANDLERS ──────────────────────────────────────────────────────
  const updateItem = (idx, field, value) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      const q = field === "quantity" ? Number(value) : Number(items[idx].quantity);
      const p = field === "unitPrice" ? Number(value) : Number(items[idx].unitPrice);
      items[idx].total = q * p;
    }
    setForm({ ...form, items });
  };
  const addItem    = () => setForm({ ...form, items: [...form.items, emptyItem()] });
  const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });

  const subtotal   = form.items.reduce((s, i) => s + (Number(i.total) || 0), 0);
  const discount   = Number(form.discount) || 0;
  const tax        = Number(form.tax) || 0;
  const grandTotal = subtotal - discount + (subtotal * tax / 100);

  // ── SUBMIT ─────────────────────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.patient) return setError("Please select a patient");
    if (form.items.some(i => !i.description || !i.unitPrice))
      return setError("Fill in all item descriptions and prices");
    try {
      await axios.post(`${API}/billing`, {
        ...form,
        subtotal, grandTotal,
        items: form.items.map(i => ({ ...i, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice), total: Number(i.total) }))
      });
      setForm(emptyForm);
      setSaved(true);
      setShowForm(false);
      setTimeout(() => setSaved(false), 3000);
      fetchBills();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create bill");
    }
  };

  // ── PRINT BILL ─────────────────────────────────────────────────────────
  const printBill = (bill) => {
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Bill - ${bill.patient?.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #111; }
        .header { text-align: center; border-bottom: 3px solid #0f2744; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { color: #0f2744; margin: 0; font-size: 26px; }
        .header p  { color: #555; margin: 4px 0; font-size: 13px; }
        .badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; background: #f8fafc; padding: 16px; border-radius: 8px; }
        .info-label { font-size: 11px; color: #888; font-weight: 700; text-transform: uppercase; }
        .info-value { font-size: 14px; font-weight: 600; color: #111; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #0f2744; color: #fff; padding: 10px 12px; text-align: left; font-size: 13px; }
        td { padding: 9px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
        tr:nth-child(even) td { background: #f8fafc; }
        .totals { max-width: 300px; margin-left: auto; }
        .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; border-bottom: 1px solid #eee; }
        .grand-total { font-size: 18px; font-weight: 800; color: #0f2744; border-top: 2px solid #0f2744; padding-top: 8px; margin-top: 4px; }
        .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 12px; }
        @media print { body { padding: 0; } }
      </style></head><body>
      <div class="header">
        <h1>🏥 City Hospital</h1>
        <p>Tax Invoice / Bill of Services</p>
        <p>Bill Date: ${new Date(bill.billDate).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" })}</p>
      </div>
      <div class="info-grid">
        <div><div class="info-label">Patient</div><div class="info-value">${bill.patient?.name || "—"}</div></div>
        <div><div class="info-label">Doctor</div><div class="info-value">${bill.doctor?.name || "—"}</div></div>
        <div><div class="info-label">Patient Type</div><div class="info-value">${bill.patient?.type || "Outpatient"}</div></div>
        <div><div class="info-label">Payment Status</div><div class="info-value">${bill.paymentStatus}</div></div>
        <div><div class="info-label">Payment Method</div><div class="info-value">${bill.paymentMethod || "—"}</div></div>
        <div><div class="info-label">Phone</div><div class="info-value">${bill.patient?.phone || "—"}</div></div>
      </div>
      <table>
        <thead><tr><th>#</th><th>Description</th><th>Category</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
        <tbody>
          ${bill.items.map((item, i) => `
            <tr>
              <td>${i+1}</td>
              <td>${item.description}</td>
              <td>${item.category}</td>
              <td>${item.quantity}</td>
              <td>₹${Number(item.unitPrice).toLocaleString("en-IN")}</td>
              <td>₹${Number(item.total).toLocaleString("en-IN")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="totals">
        <div class="total-row"><span>Subtotal</span><span>₹${Number(bill.subtotal).toLocaleString("en-IN")}</span></div>
        ${bill.discount ? `<div class="total-row"><span>Discount</span><span>- ₹${Number(bill.discount).toLocaleString("en-IN")}</span></div>` : ""}
        ${bill.tax ? `<div class="total-row"><span>Tax (${bill.tax}%)</span><span>+ ₹${(bill.subtotal*bill.tax/100).toLocaleString("en-IN")}</span></div>` : ""}
        <div class="total-row grand-total"><span>Grand Total</span><span>₹${Number(bill.grandTotal).toLocaleString("en-IN")}</span></div>
      </div>
      ${bill.notes ? `<div style="margin-top:16px;padding:10px 14px;background:#fef9c3;border-radius:6px;font-size:13px;color:#713f12;">📝 Notes: ${bill.notes}</div>` : ""}
      <div class="footer">City Hospital — Thank you for choosing us for your healthcare needs</div>
      <script>window.onload=()=>{window.print();}</script>
      </body></html>
    `);
    w.document.close();
  };

  const updatePaymentStatus = async (id, paymentStatus) => {
    await axios.put(`${API}/billing/${id}`, { paymentStatus });
    fetchBills();
  };

  const deleteBill = async (id) => {
    if (!window.confirm("Delete this bill?")) return;
    await axios.delete(`${API}/billing/${id}`);
    fetchBills();
  };

  const payBadge = (status) => {
    const map = { Paid:"#22c55e", Pending:"#f59e0b", Partial:"#3b82f6" };
    return (
      <span style={{
        background: map[status] + "20", color: map[status], border: `1px solid ${map[status]}40`,
        padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700
      }}>{status}</span>
    );
  };

  const filteredBills = filterStatus === "All" ? bills : bills.filter(b => b.paymentStatus === filterStatus);

  // ── SUMMARY STATS ──────────────────────────────────────────────────────
  const totalRevenue = bills.filter(b => b.paymentStatus === "Paid").reduce((s, b) => s + b.grandTotal, 0);
  const pending      = bills.filter(b => b.paymentStatus === "Pending").reduce((s, b) => s + b.grandTotal, 0);

  return (
    <div>
      {/* ── HEADER ── */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Billing</h2>
          <p className="page-subtitle">Manage patient invoices and payments</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setError(""); }}>
          {showForm ? "✕ Cancel" : "+ New Bill"}
        </button>
      </div>

      {/* ── STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Bills",   val: bills.length,                              color: "#0f2744", bg: "#e8edf5", icon: "🧾" },
          { label: "Revenue (Paid)",val: `₹${totalRevenue.toLocaleString("en-IN")}`, color: "#15803d", bg: "#dcfce7", icon: "💰" },
          { label: "Pending",       val: `₹${pending.toLocaleString("en-IN")}`,      color: "#92400e", bg: "#fef3c7", icon: "⏳" },
          { label: "Paid Bills",    val: bills.filter(b=>b.paymentStatus==="Paid").length, color: "#1d4ed8", bg: "#dbeafe", icon: "✅" },
        ].map(s => (
          <div key={s.label} className="card" style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="card-body" style={{ padding: "16px 20px" }}>
              <div style={{ fontSize: 24 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: "4px 0" }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TOASTS ── */}
      {saved  && <div style={{ background:"#dcfce7",color:"#14532d",border:"1px solid #86efac",borderRadius:8,padding:"10px 16px",marginBottom:16,fontWeight:600,fontSize:14 }}>✅ Bill created successfully!</div>}
      {error  && <div style={{ background:"#fee2e2",color:"#991b1b",border:"1px solid #fca5a5",borderRadius:8,padding:"10px 16px",marginBottom:16,fontWeight:600,fontSize:14 }}>❌ {error}</div>}

      {/* ── NEW BILL FORM ── */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><span className="card-title">Create New Bill</span></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Patient & Doctor */}
              <div className="form-grid" style={{ marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label">Patient *</label>
                  <select className="form-control" value={form.patient}
                    onChange={e => setForm({ ...form, patient: e.target.value })} required>
                    <option value="">— Select Patient —</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.name} · {p.type || "Outpatient"}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Doctor</label>
                  <select className="form-control" value={form.doctor}
                    onChange={e => setForm({ ...form, doctor: e.target.value })}>
                    <option value="">— Select Doctor (optional) —</option>
                    {doctors.map(d => <option key={d._id} value={d._id}>{d.name} · {d.specialization}</option>)}
                  </select>
                </div>
              </div>

              {/* Bill Items */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <label className="form-label" style={{ margin: 0 }}>Bill Items *</label>
                  <button type="button" onClick={addItem}
                    style={{ background: "#eff6ff", color: "#1d6fa4", border: "1px solid #bfdbfe", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                    + Add Item
                  </button>
                </div>

                {/* Header */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 60px 100px 100px 36px", gap: 8, padding: "6px 8px", background: "#f1f5f9", borderRadius: 6, fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                  <div>Description</div><div>Category</div><div>Qty</div><div>Unit Price</div><div>Total</div><div></div>
                </div>

                {form.items.map((item, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 60px 100px 100px 36px", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <input className="form-control" placeholder="Service / item description"
                      value={item.description} onChange={e => updateItem(idx, "description", e.target.value)} required />
                    <select className="form-control" value={item.category} onChange={e => updateItem(idx, "category", e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <input className="form-control" type="number" min={1} value={item.quantity}
                      onChange={e => updateItem(idx, "quantity", e.target.value)} />
                    <input className="form-control" type="number" min={0} placeholder="₹0"
                      value={item.unitPrice} onChange={e => updateItem(idx, "unitPrice", e.target.value)} required />
                    <div style={{ padding: "8px 12px", background: "#f8fafc", borderRadius: 6, fontSize: 14, fontWeight: 700, color: "#0f2744", textAlign: "right" }}>
                      ₹{Number(item.total).toLocaleString("en-IN") || 0}
                    </div>
                    {form.items.length > 1 && (
                      <button type="button" onClick={() => removeItem(idx)}
                        style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, width: 30, height: 30, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    )}
                  </div>
                ))}
              </div>

              {/* Totals Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20, padding: 16, background: "#f8fafc", borderRadius: 8 }}>
                <div className="form-group">
                  <label className="form-label">Subtotal</label>
                  <div style={{ padding: "8px 12px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, fontWeight: 700 }}>₹{subtotal.toLocaleString("en-IN")}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Discount (₹)</label>
                  <input className="form-control" type="number" min={0} value={form.discount}
                    onChange={e => setForm({ ...form, discount: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tax (%)</label>
                  <input className="form-control" type="number" min={0} max={100} value={form.tax}
                    onChange={e => setForm({ ...form, tax: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Grand Total</label>
                  <div style={{ padding: "8px 12px", background: "#0f2744", borderRadius: 6, fontWeight: 800, color: "#fff", fontSize: 16 }}>₹{grandTotal.toLocaleString("en-IN")}</div>
                </div>
              </div>

              {/* Payment */}
              <div className="form-grid" style={{ marginBottom: 16 }}>
                <div className="form-group">
                  <label className="form-label">Payment Status</label>
                  <select className="form-control" value={form.paymentStatus}
                    onChange={e => setForm({ ...form, paymentStatus: e.target.value })}>
                    <option>Pending</option><option>Paid</option><option>Partial</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="form-control" value={form.paymentMethod}
                    onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                    <option value="">— Select (optional) —</option>
                    {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">Notes</label>
                <input className="form-control" placeholder="Additional notes..."
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              <button type="submit" className="btn btn-primary">💾 Save Bill</button>
            </form>
          </div>
        </div>
      )}

      {/* ── FILTER ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["All", "Pending", "Paid", "Partial"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{
              padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              border: `1.5px solid ${filterStatus === s ? "#1d6fa4" : "#d1d5db"}`,
              background: filterStatus === s ? "#1d6fa4" : "#fff",
              color: filterStatus === s ? "#fff" : "#374151"
            }}>{s}</button>
        ))}
      </div>

      {/* ── BILLS TABLE ── */}
      <div className="card">
        <div className="card-header"><span className="card-title">All Bills ({filteredBills.length})</span></div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr><th>Date</th><th>Patient</th><th>Type</th><th>Doctor</th><th>Items</th><th>Grand Total</th><th>Payment</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "#9ca3af", padding: 32 }}>No bills found</td></tr>
              ) : filteredBills.map(b => (
                <tr key={b._id}>
                  <td style={{ fontSize: 12, color: "#6b7280" }}>{new Date(b.billDate).toLocaleDateString("en-IN")}</td>
                  <td style={{ fontWeight: 600 }}>{b.patient?.name || "—"}</td>
                  <td>
                    <span style={{
                      display:"inline-block", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:700,
                      background: b.patient?.type === "Inpatient" ? "#dbeafe" : "#dcfce7",
                      color:      b.patient?.type === "Inpatient" ? "#1d4ed8" : "#15803d"
                    }}>{b.patient?.type || "Outpatient"}</span>
                  </td>
                  <td style={{ fontSize: 13 }}>{b.doctor?.name || "—"}</td>
                  <td style={{ fontSize: 12, color: "#6b7280" }}>{b.items?.length} item(s)</td>
                  <td style={{ fontWeight: 800, color: "#0f2744", fontSize: 15 }}>₹{b.grandTotal?.toLocaleString("en-IN")}</td>
                  <td>{payBadge(b.paymentStatus)}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => printBill(b)}
                      style={{ background:"#eff6ff",color:"#1d6fa4",border:"1px solid #bfdbfe",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12,fontWeight:600 }}>
                      🖨️
                    </button>
                    {b.paymentStatus !== "Paid" && (
                      <button onClick={() => updatePaymentStatus(b._id, "Paid")}
                        style={{ background:"#dcfce7",color:"#15803d",border:"1px solid #86efac",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12,fontWeight:600 }}>
                        ✓ Mark Paid
                      </button>
                    )}
                    <button onClick={() => deleteBill(b._id)}
                      style={{ background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12,fontWeight:600 }}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}