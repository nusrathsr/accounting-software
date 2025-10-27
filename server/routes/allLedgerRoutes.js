const express = require("express");
const router = express.Router();
const allLedgerController = require("../controllers/allLedgerController");

router.post("/", allLedgerController.addLedger);
router.get("/", allLedgerController.getLedgers);
router.get("/:id", allLedgerController.getLedgerById);
router.put("/:id", allLedgerController.updateLedger);
router.delete("/:id", allLedgerController.deleteLedger);

module.exports = router;
