const mongoose =require("mongoose")

const JournalVoucher =new mongoose.Schema(
  {
    voucherNo:{
      type:String,
      unique:true,
      required:true
    },
    date:{
      type:Date,
      required:true
    },
    voucherType:{
      type:String,
      required:true
    },
    debitAccount:{
      type:String,
      required:true
    },
    debitAmount:{
      type: Number,
      default: 0,
    },
    creditAccount:{
      type:String,
      required:true
    },
    creditAmount:{
       type: Number,
      default: 0
    },
     description:{
      type:String,
     }

  },
  {timestamps:true}
)
module.exports =mongoose.model("JournalVoucher",JournalVoucher)