const Billing = require("../models/Billing");

// CREATE BILL
exports.createBill = async (req, res) => {
  try {
    const bill = await new Billing(req.body).save();
    const populated = await Billing.findById(bill._id)
      .populate("patient", "name phone type")
      .populate("doctor",  "name specialization");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Billing error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET ALL BILLS
exports.getBills = async (req, res) => {
  try {
    const bills = await Billing.find()
      .populate("patient", "name phone type")
      .populate("doctor",  "name specialization")
      .sort({ billDate: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BILL BY ID
exports.getBillById = async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id)
      .populate("patient", "name age gender phone address type diagnosis")
      .populate("doctor",  "name specialization");
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PAYMENT STATUS
exports.updateBill = async (req, res) => {
  try {
    const bill = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("patient", "name phone type")
      .populate("doctor",  "name specialization");
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE BILL
exports.deleteBill = async (req, res) => {
  try {
    await Billing.findByIdAndDelete(req.params.id);
    res.json({ message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BILLS BY PATIENT
exports.getBillsByPatient = async (req, res) => {
  try {
    const bills = await Billing.find({ patient: req.params.patientId })
      .populate("doctor", "name specialization")
      .sort({ billDate: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};