import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login          from "./components/Login";
import Register       from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard      from "./components/Dashboard";
import DoctorForm     from "./components/DoctorForm";
import DoctorList     from "./components/DoctorList";
import PatientForm    from "./components/PatientForm";
import PatientHistory from "./components/PatientHistory";
import AppointmentForm from "./components/AppointmentForm";
import PrescriptionForm from "./components/PrescriptionForm";
import PrescriptionList from "./components/PrescriptionList";
import TestReportForm  from "./components/TestReportForm";
import TestReportList  from "./components/TestReportList";
import MedicineForm    from "./components/MedicineForm";
import LabTestForm     from "./components/LabTestForm";
import Billing         from "./components/Billing";

const NAV = [
  { to: "/",             label: "📊 Dashboard",       roles: ["admin","doctor","receptionist"] },
  { to: "/doctors",      label: "👨‍⚕️ Doctors",         roles: ["admin"] },
  { to: "/patients",     label: "🧑‍🤝‍🧑 Patients",        roles: ["admin","doctor","receptionist"] },
  { to: "/appointments", label: "📅 Appointments",    roles: ["admin","doctor","receptionist"] },
  { to: "/prescriptions",label: "💊 Prescriptions",   roles: ["admin","doctor"] },
  { to: "/reports",      label: "🧪 Test Reports",    roles: ["admin","doctor"] },
  { to: "/billing",      label: "🧾 Billing",          roles: ["admin","receptionist"] },
  { to: "/medicines",    label: "💉 Medicines",        roles: ["admin","receptionist"] },
  { to: "/labtests",     label: "🔬 Lab Tests",        roles: ["admin","receptionist"] },
  { to: "/history",      label: "📋 Patient History",  roles: ["admin","doctor"] },
];

function AppLayout() {
  const { user, logout } = useAuth();

  const roleColor = { admin: "#f59e0b", doctor: "#22c55e", receptionist: "#60a5fa" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 240, background: "#0f2744", display: "flex",
        flexDirection: "column", position: "fixed", top: 0, left: 0,
        height: "100vh", zIndex: 100, overflowY: "auto"
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>🏥 City Hospital</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Medical Management System</div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "12px 0" }}>
          {NAV.filter(n => user && n.roles.includes(user.role)).map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"}
              style={({ isActive }) => ({
                display: "block", padding: "10px 20px", textDecoration: "none",
                fontSize: 13, fontWeight: 600, borderRadius: "0 8px 8px 0", margin: "2px 10px 2px 0",
                color:      isActive ? "#fff" : "rgba(255,255,255,0.6)",
                background: isActive ? "rgba(29,111,164,0.9)" : "transparent",
                borderLeft: isActive ? "3px solid #00b4d8" : "3px solid transparent",
                transition: "all 0.15s"
              })}>
              {n.label}
            </NavLink>
          ))}
        </div>

        {/* User + Logout */}
        {user && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{user.name}</div>
            <div style={{
              display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
              marginBottom: 12,
              background: (roleColor[user.role] || "#60a5fa") + "30",
              color: roleColor[user.role] || "#60a5fa"
            }}>{user.role}</div>
            <button onClick={logout} style={{
              width: "100%", padding: "8px", background: "rgba(239,68,68,0.15)",
              color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600
            }}>🚪 Sign Out</button>
          </div>
        )}
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          }/>
          <Route path="/doctors" element={
            <ProtectedRoute roles={["admin"]}>
              <DoctorForm /><DoctorList />
            </ProtectedRoute>
          }/>
          <Route path="/patients" element={
            <ProtectedRoute roles={["admin","doctor","receptionist"]}>
              <PatientForm />
            </ProtectedRoute>
          }/>
          <Route path="/appointments" element={
            <ProtectedRoute roles={["admin","doctor","receptionist"]}>
              <AppointmentForm />
            </ProtectedRoute>
          }/>
          <Route path="/prescriptions" element={
            <ProtectedRoute roles={["admin","doctor"]}>
              <PrescriptionForm /><PrescriptionList />
            </ProtectedRoute>
          }/>
          <Route path="/reports" element={
            <ProtectedRoute roles={["admin","doctor"]}>
              <TestReportForm /><TestReportList />
            </ProtectedRoute>
          }/>
          <Route path="/billing" element={
            <ProtectedRoute roles={["admin","receptionist"]}>
              <Billing />
            </ProtectedRoute>
          }/>
          <Route path="/medicines" element={
            <ProtectedRoute roles={["admin","receptionist"]}>
              <MedicineForm />
            </ProtectedRoute>
          }/>
          <Route path="/labtests" element={
            <ProtectedRoute roles={["admin","receptionist"]}>
              <LabTestForm />
            </ProtectedRoute>
          }/>
          <Route path="/history" element={
            <ProtectedRoute roles={["admin","doctor"]}>
              <PatientHistory />
            </ProtectedRoute>
          }/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*"        element={<AppLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}