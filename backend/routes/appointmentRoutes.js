const express = require("express");
const router = express.Router();
const {
  addAppointment,
  getAppointments,
  updateAppointment,
  completeAppointment,
  deleteAppointment
} = require("../controllers/appointmentController");

router.post("/", addAppointment);
router.get("/", getAppointments);
router.put("/:id", updateAppointment);
router.patch("/:id/complete", completeAppointment);   // ← NEW
router.delete("/:id", deleteAppointment);

module.exports = router;