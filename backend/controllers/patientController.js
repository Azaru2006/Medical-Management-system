const Patient = require("../models/Patient");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");

exports.addPatient = async (req, res) => {
  res.json(await new Patient(req.body).save());
};

exports.getPatients = async (req, res) => {
  res.json(await Patient.find());
};

exports.getPatientHistory = async (req, res) => {
  try {

    const prescriptions = await Prescription.find({
      patient: req.params.id
    })
    .populate("doctor")
    .populate("medicines")
    .populate("labtests");

    const appointments = await Appointment.find({
      patient: req.params.id
    }).populate("doctor");

    res.json({
      prescriptions,
      appointments
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePatient = async (req, res) =>
  res.json(await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true }));

exports.deletePatient = async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ message: "Patient deleted" });
};