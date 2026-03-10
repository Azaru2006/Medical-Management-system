const Prescription = require("../models/Prescription");

exports.addPrescription = async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    const saved = await prescription.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("doctor")
      .populate("patient")
      .populate("medicines.medicine")
      .populate("labtests");

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePrescription = async (req, res) => {
  res.json(
    await Prescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
  );
};

exports.deletePrescription = async (req, res) => {
  await Prescription.findByIdAndDelete(req.params.id);
  res.json({ message: "Prescription deleted" });
};