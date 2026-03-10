const mongoose = require("mongoose");

const emrSchema = new mongoose.Schema({

  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },

  diagnosis: String,

  symptoms: String,

  prescription: String,

  labTests: String,

  notes: String,

  visitDate: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("EMR", emrSchema);