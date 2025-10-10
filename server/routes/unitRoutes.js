const express = require("express");
const {
  addUnit,
  getUnits,
  disableUnit,
  deleteUnit,} = require("../controllers/unitController");

const router = express.Router();

router.post("/", addUnit);              // Create new unit
router.get("/", getUnits);              // Get all units
router.put("/:id/disable", disableUnit); // Toggle active/inactive
router.delete("/:id", deleteUnit);      // Permanently delete (optional)

module.exports = router;
