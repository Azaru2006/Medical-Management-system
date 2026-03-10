const express = require("express");
const router = express.Router();

const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");

router.get("/:patientId", async (req, res) => {

  try {

    const appointments = await Appointment
      .find({ patient: req.params.patientId })
      .populate("doctor")
      .populate("patient");

    const prescriptions = await Prescription
      .find({ patient: req.params.patientId })
      .populate("doctor")
      .populate("patient")
      .populate("medicines.medicine")
      .populate("labtests");

    res.json({
      appointments,
      prescriptions
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error loading history" });

  }

});

module.exports = router;