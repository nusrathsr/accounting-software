const JournalVoucher=require("../models/JournalVoucher")


// Add new JournalVoucher

exports.addJournalVoucher =async (req,res)=>{
  try {
    const newJournalVoucher = new JournalVoucher({
    voucherNo:req.body.voucherNo ,
    date:req.body.date ,
    voucherType:req.body.voucherType ,
    debitAccount:req.body.debitAccount ,
    debitAmount:req.body.debitAmount || 0 ,
    creditAccount:req.body.creditAccount ,
    creditAmount:req.body.creditAmount || 0 ,
    description:req.body.description ,
    })
    await newJournalVoucher.save()
    res.status(201).json({ success: true, message: "journal Voucher added successfully", data: newJournalVoucher });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding Journal Voucher", error: error.message });

  }
} 

//GET All journal Voucher

exports.getJournalVouchers =async(req,res)=>{
  try {
    const journalVoucher =await JournalVoucher.find().sort({createdAt:-1});
       res.status(200).json({ success: true, data: journalVoucher });
 
  } catch (error) {
       res.status(500).json({ success: false, message: "Failed to fetch journal voucher", error: error.message });
 
  }
}

//get one Journal Voucher
exports.getJournalVoucherById=async (req,res)=>{
  try {
    const journalVoucher =await JournalVoucher.findById(req.params.id)
    if(!journalVoucher)return res.status(400).json({success:false,message:"journal  Voucher not found"})
      res.status(200).json({success:true,data:journalVoucher})
  } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch journal voucher", error: error.message });

  }
}
 //update journal voucher
 exports.updateJournalVoucher = async (req,res)=>{
  try {
    const updateJournalVoucher =await JournalVoucher.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if (!updatedLedger) return res.status(404).json({ success: false, message: "journal voucher not found" });
    res.status(200).json({ success: true, message: "Journal Voucher updated successfully", data: updateJournalVoucher });
  } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update journal voucher", error: error.message });

  }
 }





//Delete journal voucher

exports.deleteJournalVoucher =async (req,res)=>{
  try {
    const deleted =await JournalVoucher.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ success: false, message: "journal voucher not found" });
    res.status(200).json({ success: true, message: "Journal Voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete journal voucher", error: error.message });

  }
}