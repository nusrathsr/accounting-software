// const JournalVoucher=require("../models/JournalVoucher")


// // Add new JournalVoucher

// exports.addJournalVoucher =async (req,res)=>{
//   try {
//     const newJournalVoucher = new JournalVoucher({
//     voucherNo:req.body.voucherNo ,
//     date:req.body.date ,
//     voucherType:req.body.voucherType ,
//     debitAccount:req.body.debitAccount ,
//     debitAmount:req.body.debitAmount || 0 ,
//     creditAccount:req.body.creditAccount ,
//     creditAmount:req.body.creditAmount || 0 ,
//     description:req.body.description ,
//     })
//     await newJournalVoucher.save()
//     res.status(201).json({ success: true, message: "journal Voucher added successfully", data: newJournalVoucher });

//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error adding Journal Voucher", error: error.message });

//   }
// } 

// //GET All journal Voucher

// exports.getJournalVouchers =async(req,res)=>{
//   try {
//     const journalVoucher =await JournalVoucher.find().sort({createdAt:-1});
//        res.status(200).json({ success: true, data: journalVoucher });
 
//   } catch (error) {
//        res.status(500).json({ success: false, message: "Failed to fetch journal voucher", error: error.message });
 
//   }
// }

// //get one Journal Voucher
// exports.getJournalVoucherById=async (req,res)=>{
//   try {
//     const journalVoucher =await JournalVoucher.findById(req.params.id)
//     if(!journalVoucher)return res.status(400).json({success:false,message:"journal  Voucher not found"})
//       res.status(200).json({success:true,data:journalVoucher})
//   } catch (error) {
//       res.status(500).json({ success: false, message: "Failed to fetch journal voucher", error: error.message });

//   }
// }
//  //update journal voucher
//  exports.updateJournalVoucher = async (req,res)=>{
//   try {
//     const updateJournalVoucher =await JournalVoucher.findByIdAndUpdate(req.params.id,req.body,{new:true})
//         if (!updatedLedger) return res.status(404).json({ success: false, message: "journal voucher not found" });
//     res.status(200).json({ success: true, message: "Journal Voucher updated successfully", data: updateJournalVoucher });
//   } catch (error) {
//         res.status(500).json({ success: false, message: "Failed to update journal voucher", error: error.message });

//   }
//  }





// //Delete journal voucher

// exports.deleteJournalVoucher =async (req,res)=>{
//   try {
//     const deleted =await JournalVoucher.findByIdAndDelete(req.params.id)
//         if (!deleted) return res.status(404).json({ success: false, message: "journal voucher not found" });
//     res.status(200).json({ success: true, message: "Journal Voucher deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to delete journal voucher", error: error.message });

//   }
// }



const JournalVoucher = require("../models/JournalVoucher");
const Ledger = require("../models/Ledger");

// ➕ ADD NEW JOURNAL VOUCHER (with double ledger entries)
exports.addJournalVoucher = async (req, res) => {
  try {
    const {
      voucherNo,
      date,
      voucherType,
      debitAccount,
      debitAmount,
      creditAccount,
      creditAmount,
      description,
    } = req.body;

    // 1️⃣ Save Journal Voucher
    const newJournalVoucher = new JournalVoucher({
      voucherNo,
      date,
      voucherType,
      debitAccount,
      debitAmount: debitAmount || 0,
      creditAccount,
      creditAmount: creditAmount || 0,
      description,
    });

    const savedVoucher = await newJournalVoucher.save();

    // 2️⃣ Create corresponding Ledger entries (double entry)
    const debitEntry = new Ledger({
      voucher_no: voucherNo,
      date,
      account_name: debitAccount,
      debit: debitAmount || 0,
      credit: 0,
      reference_type: "JournalVoucher",
      reference_id: savedVoucher._id,
      narration: description,
    });

    const creditEntry = new Ledger({
      voucher_no: voucherNo,
      date,
      account_name: creditAccount,
      debit: 0,
      credit: creditAmount || 0,
      reference_type: "JournalVoucher",
      reference_id: savedVoucher._id,
      narration: description,
    });

    await Ledger.insertMany([debitEntry, creditEntry]);

    res.status(201).json({
      success: true,
      message: "Journal Voucher added successfully with ledger entries",
      data: savedVoucher,
    });
  } catch (error) {
    console.error("Error adding Journal Voucher:", error);
    res.status(500).json({
      success: false,
      message: "Error adding Journal Voucher",
      error: error.message,
    });
  }
};

// 📜 GET ALL JOURNAL VOUCHERS
exports.getJournalVouchers = async (req, res) => {
  try {
    const journalVouchers = await JournalVoucher.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: journalVouchers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch journal vouchers",
      error: error.message,
    });
  }
};

// 🔍 GET SINGLE JOURNAL VOUCHER BY ID
exports.getJournalVoucherById = async (req, res) => {
  try {
    const journalVoucher = await JournalVoucher.findById(req.params.id);
    if (!journalVoucher)
      return res
        .status(404)
        .json({ success: false, message: "Journal Voucher not found" });

    res.status(200).json({ success: true, data: journalVoucher });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch journal voucher",
      error: error.message,
    });
  }
};

// ✏️ UPDATE JOURNAL VOUCHER
exports.updateJournalVoucher = async (req, res) => {
  try {
    const updatedVoucher = await JournalVoucher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedVoucher)
      return res
        .status(404)
        .json({ success: false, message: "Journal Voucher not found" });

    // Update ledger entries as well
    await Ledger.deleteMany({
      voucher_no: updatedVoucher.voucherNo,
      reference_type: "JournalVoucher",
    });

    const debitEntry = new Ledger({
      voucher_no: updatedVoucher.voucherNo,
      date: updatedVoucher.date,
      account_name: updatedVoucher.debitAccount,
      debit: updatedVoucher.debitAmount || 0,
      credit: 0,
      reference_type: "JournalVoucher",
      reference_id: updatedVoucher._id,
      narration: updatedVoucher.description,
    });

    const creditEntry = new Ledger({
      voucher_no: updatedVoucher.voucherNo,
      date: updatedVoucher.date,
      account_name: updatedVoucher.creditAccount,
      debit: 0,
      credit: updatedVoucher.creditAmount || 0,
      reference_type: "JournalVoucher",
      reference_id: updatedVoucher._id,
      narration: updatedVoucher.description,
    });

    await Ledger.insertMany([debitEntry, creditEntry]);

    res.status(200).json({
      success: true,
      message: "Journal Voucher and ledger updated successfully",
      data: updatedVoucher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update journal voucher",
      error: error.message,
    });
  }
};

// 🗑️ DELETE JOURNAL VOUCHER
exports.deleteJournalVoucher = async (req, res) => {
  try {
    const deletedVoucher = await JournalVoucher.findByIdAndDelete(req.params.id);

    if (!deletedVoucher)
      return res
        .status(404)
        .json({ success: false, message: "Journal Voucher not found" });

    // Remove related ledger entries
    await Ledger.deleteMany({
      voucher_no: deletedVoucher.voucherNo,
      reference_type: "JournalVoucher",
    });

    res.status(200).json({
      success: true,
      message: "Journal Voucher and related ledger entries deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete journal voucher",
      error: error.message,
    });
  }
};
