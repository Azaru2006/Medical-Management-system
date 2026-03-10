const mongoose = require("mongoose");

module.exports = mongoose.model("Appointment", new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  date: String,
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"],
    default: "Pending"
  }
}));