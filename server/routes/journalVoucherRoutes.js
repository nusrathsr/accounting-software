const express = require("express");
const router =express.Router();
const JournalVoucherController = require("../controllers/journalVoucherController")


router.post("/",JournalVoucherController.addJournalVoucher)
router.get("/",JournalVoucherController.getJournalVouchers)
router.get("/:id",JournalVoucherController.getJournalVoucherById)
router.put("/:id",JournalVoucherController.updateJournalVoucher)
router.delete("/id",JournalVoucherController.deleteJournalVoucher)


module.exports =router;