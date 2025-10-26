const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledgerController");

// ➕ Create Ledger Entry
router.post("/", ledgerController.createLedger);

// 📋 Get All Ledger Entries
router.get("/", ledgerController.getLedgers);

// 🔍 Get Single Ledger Entry by ID
router.get("/:id", ledgerController.getLedgerById);

// ✏️ Update Ledger Entry
router.put("/:id", ledgerController.updateLedger);

// 🗑️ Delete Ledger Entry
router.delete("/:id", ledgerController.deleteLedger);

module.exports = router;
