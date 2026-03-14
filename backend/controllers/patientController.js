const Patient      = require("../models/Patient");
const Prescription = require("../models/Prescription");
const Appointment  = require("../models/Appointment");
const Billing      = require("../models/Billing");

exports.addPatient = async (req, res) => {
  try {
    const patient = await new Patient(req.body).save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    res.json(await Patient.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPatientHistory = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.id })
      .populate("doctor")
      .populate("medicines")
      .populate("labtests")
      .sort({ createdAt: -1 });

    const appointments = await Appointment.find({ patient: req.params.id })
      .populate("doctor")
      .sort({ date: -1 });

    const bills = await Billing.find({ patient: req.params.id })
      .populate("doctor", "name specialization")
      .sort({ billDate: -1 });

    const patient = await Patient.findById(req.params.id);

    res.json({ patient, prescriptions, appointments, bills });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    res.json(await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};