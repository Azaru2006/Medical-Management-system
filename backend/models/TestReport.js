const mongoose = require("mongoose");

const TestItemSchema = new mongoose.Schema({
  parameter: String,
  result: String,
  normalRange: String
});

const TestReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
  },

  labtest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LabTest"
  },

  items: [TestItemSchema],

  remarks: String,

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("TestReport", TestReportSchema);