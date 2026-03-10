const mongoose = require("mongoose");

module.exports = mongoose.model("LabTest", new mongoose.Schema({
  testName: String,
  cost: Number
}));