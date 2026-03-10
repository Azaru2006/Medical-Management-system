const express = require("express");
const router = express.Router();
const {
  addReport,
  getReports,
  getReportById,
  deleteReport
} = require("../controllers/testReportController");

router.post("/", addReport);
router.get("/", getReports);
router.get("/:id", getReportById);   // ← NEW
router.delete("/:id", deleteReport); // ← NEW

module.exports = router;