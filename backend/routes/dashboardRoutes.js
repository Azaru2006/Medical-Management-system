const express = require("express");
const router = express.Router();

const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");

router.get("/", async (req, res) => {

  try {

    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalPrescriptions = await Prescription.countDocuments();

    // NEW: pending appointments
    const pendingAppointments = await Appointment.countDocuments({
      status: "Pending"
    });

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalPrescriptions,
      pendingAppointments
    });

  } catch (error) {

    res.status(500).json(error);

  }

});

module.exports = router;