const EMR = require("../models/EMR");

exports.addRecord = async (req, res) => {
  try {
    const record = new EMR(req.body);
    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getPatientRecords = async (req, res) => {
  try {
    const records = await EMR.find({ patientId: req.params.id })
      .populate("patientId")
      .populate("doctorId");

    res.json(records);
  } catch (err) {
    res.status(500).json(err);
  }
};  