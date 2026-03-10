const TestReport = require("../models/TestReport");

// ADD REPORT
exports.addReport = async (req, res) => {
  try {
    const report = new TestReport(req.body);
    const saved = await report.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL REPORTS
exports.getReports = async (req, res) => {
  try {
    const reports = await TestReport.find()
      .populate("patient", "name age")
      .populate("labtest", "testName");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE REPORT BY ID
exports.getReportById = async (req, res) => {
  try {
    const report = await TestReport.findById(req.params.id)
      .populate("patient", "name age gender")
      .populate("labtest", "testName");
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE REPORT
exports.deleteReport = async (req, res) => {
  try {
    await TestReport.findByIdAndDelete(req.params.id);
    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};