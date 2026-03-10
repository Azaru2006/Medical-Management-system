const Doctor = require("../models/Doctor");

// ADD DOCTOR
const addDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
  console.log(error);   // VERY IMPORTANT
  res.status(500).json({ message: error.message });
}
  }
;

// GET ALL DOCTORS
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE DOCTOR
const updateDoctor = async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE DOCTOR
const deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted" });
  } 
 catch (error) {
  console.log("ERROR:", error);
  res.status(500).json({ message: error.message });
}
};

module.exports = {
  addDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor
};