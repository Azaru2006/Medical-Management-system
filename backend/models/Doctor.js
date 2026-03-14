const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  specialization: { type: String, required: true },
  phone:          { type: String, required: true },
  email:          { type: String, default: "" },
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);