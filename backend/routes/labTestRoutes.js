const express = require("express");
const router = express.Router();

const {
  addLabTest,
  getLabTests,
  updateLabTest,
  deleteLabTest
} = require("../controllers/labTestController");

router.post("/", addLabTest);
router.get("/", getLabTests);
router.put("/:id", updateLabTest);
router.delete("/:id", deleteLabTest);

module.exports = router;