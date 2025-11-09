const express = require("express");
const router = express.Router();
const trialBalanceController = require("../controllers/trialBalanceController");

// ✅ Get Trial Balance
router.get("/", trialBalanceController.getTrialBalance);

module.exports = router;
