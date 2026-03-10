import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import "./index.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute   from "./components/ProtectedRoute";
import Login            from "./components/Login";
import Register         from "./components/Register";
import Dashboard        from "./components/Dashboard";
import DoctorForm       from "./components/DoctorForm";
import DoctorList       from "./components/DoctorList";
import PatientForm      from "./components/PatientForm";
import AppointmentForm  from "./components/AppointmentForm";
import MedicineForm     from "./components/MedicineForm";
import LabTestForm      from "./components/LabTestForm";
import TestReportForm   from "./components/TestReportForm";
import TestReportList   from "./components/TestReportList";
import PrescriptionForm from "./components/PrescriptionForm";
import PrescriptionList from "./components/PrescriptionList";
import PatientHistory   from "./components/PatientHistory";
import PatientEMR       from "./components/PatientEMR";

const navItems = [
  { to: "/",              icon: "🏠", label: "Dashboard",       roles: ["admin","doctor","receptionist"] },
  { to: "/doctors",       icon: "👨‍⚕️", label: "Doctors",         roles: ["admin"] },
  { to: "/patients",      icon: "🧑‍🤝‍🧑", label: "Patients",        roles: ["admin","doctor","receptionist"] },
  { to: "/appointments",  icon: "🗓",  label: "Appointments",    roles: ["admin","doctor","receptionist"] },
  { to: "/medicines",     icon: "💊",  label: "Medicines",       roles: ["admin","receptionist"] },
  { to: "/labtests",      icon: "🔬",  label: "Lab Tests",       roles: ["admin","receptionist"] },
  { to: "/reports",       icon: "🧪",  label: "Test Reports",    roles: ["admin","doctor"] },
  { to: "/prescriptions", icon: "📋",  label: "Prescriptions",   roles: ["admin","doctor"] },
  { to: "/history",       icon: "📁",  label: "Patient History", roles: ["admin","doctor"] },
];

const roleBadge = {
  admin:        { background: "#1d6fa4", color: "#fff" },
  doctor:       { background: "#0d9373", color: "#fff" },
  receptionist: { background: "#d97706", color: "#fff" },
};

function Sidebar() {
  const location         = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside style={{
      width: "240px",
      height: "100vh",
      background: "#0f2744",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 100,
      boxShadow: "4px 0 24px rgba(15,39,68,0.18)",
      overflowY: "auto"
    }}>

      {/* TOP: LOGO + NAV */}
      <div style={{ flex: 1 }}>

        {/* LOGO */}
        <div style={{
          padding: "28px 24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🏥</div>
          <h1 style={{
            fontFamily: "'Lora', serif",
            fontSize: 19, color: "#fff",
            margin: 0, fontWeight: 700
          }}>City Hospital</h1>
          <span style={{
            fontSize: 11, color: "#00b4d8",
            fontWeight: 500, letterSpacing: "1.5px",
            textTransform: "uppercase"
          }}>Management System</span>
        </div>

        {/* NAV LINKS */}
        <nav style={{ padding: "16px 12px" }}>
          <div style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: "1.8px", textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            padding: "14px 12px 6px"
          }}>
            Main Menu
          </div>

          {navItems
            .filter(item => item.roles.includes(user?.role))
            .map(item => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "11px 14px",
                  borderRadius: 8,
                  color: location.pathname === item.to ? "#fff" : "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  marginBottom: 2,
                  background: location.pathname === item.to ? "#1d6fa4" : "transparent",
                  boxShadow: location.pathname === item.to ? "0 2px 8px rgba(29,111,164,0.35)" : "none",
                  transition: "all 0.18s"
                }}
              >
                <span style={{ fontSize: 17, width: 22, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </Link>
            ))
          }
        </nav>
      </div>

      {/* BOTTOM: USER PROFILE + LOGOUT */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid rgba(255,255,255,0.08)"
      }}>
        {/* User info */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12
        }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0
          }}>
            {user?.role === "admin" ? "🛡️" : user?.role === "doctor" ? "👨‍⚕️" : "🗂️"}
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {user?.name}
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 999,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              ...roleBadge[user?.role]
            }}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "9px",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.8)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }}
          onMouseOver={e => e.currentTarget.style.background = "rgba(220,38,38,0.35)"}
          onMouseOut={e  => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
        >
          🚪 Sign Out
        </button>
      </div>

    </aside>
  );
}

function AppLayout() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*"         element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute roles={["admin"]}>
              <DoctorForm />
              <DoctorList />
            </ProtectedRoute>
          } />
          <Route path="/patients" element={
            <ProtectedRoute roles={["admin","doctor","receptionist"]}>
              <PatientForm />
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute roles={["admin","doctor","receptionist"]}>
              <AppointmentForm />
            </ProtectedRoute>
          } />
          <Route path="/medicines" element={
            <ProtectedRoute roles={["admin","receptionist"]}>
              <MedicineForm />
            </ProtectedRoute>
          } />
          <Route path="/labtests" element={
            <ProtectedRoute roles={["admin","receptionist"]}>
              <LabTestForm />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute roles={["admin","doctor"]}>
              <TestReportForm />
              <TestReportList />
            </ProtectedRoute>
          } />
          <Route path="/prescriptions" element={
            <ProtectedRoute roles={["admin","doctor"]}>
              <PrescriptionForm />
              <PrescriptionList />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute roles={["admin","doctor"]}>
              <PatientHistory />
            </ProtectedRoute>
          } />
          <Route path="/emr/:id" element={
            <ProtectedRoute roles={["admin","doctor"]}>
              <PatientEMR />
            </ProtectedRoute>
          } />
          <Route path="/login"    element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}