const express = require("express");
const router = express.Router();

const {
 addPrescription,
 getPrescriptions
} = require("../controllers/prescriptionController");

router.post("/",addPrescription);
router.get("/",getPrescriptions);

module.exports = router;