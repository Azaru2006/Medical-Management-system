const mongoose = require("mongoose");

module.exports = mongoose.model("Medicine", new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number
}));