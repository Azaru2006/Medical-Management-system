const express = require("express");
const router = express.Router();

const {
  addPatient,
  getPatients,
  updatePatient,
  deletePatient,
  getPatientHistory
} = require("../controllers/PatientController");

router.post("/", addPatient);
router.get("/", getPatients);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

router.get("/:id/history", getPatientHistory);

module.exports = router;