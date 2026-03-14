const mongoose = require("mongoose");

const BillingItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category:    { type: String, enum: ["Consultation", "Lab Test", "Medicine", "Room Charge", "Procedure", "Other"], default: "Other" },
  quantity:    { type: Number, default: 1 },
  unitPrice:   { type: Number, required: true },
  total:       { type: Number, required: true }
});

const BillingSchema = new mongoose.Schema({
  patient:       { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor:        { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
  appointment:   { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", default: null },
  items:         [BillingItemSchema],
  subtotal:      { type: Number, required: true },
  discount:      { type: Number, default: 0 },
  tax:           { type: Number, default: 0 },
  grandTotal:    { type: Number, required: true },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Partial"], default: "Pending" },
  paymentMethod: { type: String, enum: ["Cash", "Card", "UPI", "Insurance", ""], default: "" },
  notes:         { type: String, default: "" },
  billDate:      { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Billing", BillingSchema);