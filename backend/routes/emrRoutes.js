const express = require("express");
const router = express.Router();
const emrController = require("../controllers/emrController");

router.post("/", emrController.addRecord);
router.get("/patient/:id", emrController.getPatientRecords);

module.exports = router;