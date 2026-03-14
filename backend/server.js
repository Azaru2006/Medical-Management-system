require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");

const doctorRoutes         = require("./routes/doctorRoutes");
const patientRoutes        = require("./routes/patientRoutes");
const medicineRoutes       = require("./routes/medicineRoutes");
const labTestRoutes        = require("./routes/labTestRoutes");
const appointmentRoutes    = require("./routes/appointmentRoutes");
const prescriptionRoutes   = require("./routes/prescriptionRoutes");
const testReportRoutes     = require("./routes/testReportRoutes");
const dashboardRoutes      = require("./routes/dashboardRoutes");
const emrRoutes            = require("./routes/emrRoutes");
const patientHistoryRoutes = require("./routes/patientHistoryRoutes");
const authRoutes           = require("./routes/authRoutes");
const billingRoutes        = require("./routes/billingRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/medicaldb")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/doctors",        doctorRoutes);
app.use("/api/patients",       patientRoutes);
app.use("/api/medicines",      medicineRoutes);
app.use("/api/labtests",       labTestRoutes);
app.use("/api/appointments",   appointmentRoutes);
app.use("/api/prescriptions",  prescriptionRoutes);
app.use("/api/testreports",    testReportRoutes);
app.use("/api/dashboard",      dashboardRoutes);
app.use("/api/emr",            emrRoutes);
app.use("/api/patient-history",patientHistoryRoutes);
app.use("/api/auth",           authRoutes);
app.use("/api/billing",        billingRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));