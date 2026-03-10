const LabTest = require("../models/LabTest");

exports.addLabTest = async (req, res) => {
  try {
    console.log("Incoming data:", req.body);

    const labTest = new LabTest(req.body);
    const saved = await labTest.save();

    res.status(201).json(saved);

  } catch (error) {
    console.error("LAB TEST ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLabTests = async (req, res) => {
  try {
    const tests = await LabTest.find();
    res.json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateLabTest = async (req, res) => {
  try {
    const updated = await LabTest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLabTest = async (req, res) => {
  try {
    await LabTest.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};