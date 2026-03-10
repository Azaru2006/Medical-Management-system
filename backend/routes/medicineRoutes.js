const express = require("express");
const router = express.Router();

const {
  addMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine
} = require("../controllers/medicineController");

router.post("/", addMedicine);
router.get("/", getMedicines);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

module.exports = router;