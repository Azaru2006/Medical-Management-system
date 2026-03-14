const express = require("express");
const router  = express.Router();
const {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
  getBillsByPatient
} = require("../controllers/billingController");

router.get("/",                       getBills);
router.post("/",                      createBill);
router.get("/:id",                    getBillById);
router.put("/:id",                    updateBill);
router.delete("/:id",                 deleteBill);
router.get("/patient/:patientId",     getBillsByPatient);

module.exports = router;