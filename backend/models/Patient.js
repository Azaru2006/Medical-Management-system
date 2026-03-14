const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  age:       { type: Number, required: true },
  gender:    { type: String, required: true },
  phone:     { type: String, required: true },
  address:   { type: String, required: true },
  type:      { type: String, enum: ["Outpatient", "Inpatient"], default: "Outpatient" },
  diagnosis: { type: String, default: "" },   // reason for visit / diagnosis
  bedNumber: { type: String, default: "" },   // only for Inpatient
  admitDate: { type: Date, default: null },   // only for Inpatient
  ward:      { type: String, default: "" }    // only for Inpatient
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);