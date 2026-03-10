const Appointment = require("../models/Appointment");

// ADD APPOINTMENT
const addAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL APPOINTMENTS (with doctor & patient populated)
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name specialization")
      .populate("patient", "name age");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE APPOINTMENT
const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK APPOINTMENT AS COMPLETED
const completeAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      { new: true }
    ).populate("doctor", "name").populate("patient", "name");
    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE APPOINTMENT
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addAppointment,
  getAppointments,
  updateAppointment,
  completeAppointment,
  deleteAppointment
};