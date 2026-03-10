const express = require("express");
const router = express.Router();

const {
  addDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor
} = require("../controllers/doctorController");

router.post("/", addDoctor);
router.get("/", getDoctors);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

module.exports = router;