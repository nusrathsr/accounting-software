const Purchase =require("../models/PurchaseInvoice")
const SalesInvoice =require('../models/SalesInvoice')
const Expense =require('../models/Expense')


//sales report

exports.getSalesReport = async(req,res)=>{
  try {
    const {startDate,endDate}=req.query;
    const filter={}
    if(startDate && endDate){
      filter.date = {$gte:new Date(startDate), $lte :new Date(endDate)}
    }
    const sales =await SalesInvoice.find(filter)
    const totalRevenue =sales.reduce((sum,s)=>sum+s.totalAmount,0)
    const totalTax =sales.reduce((sum,s)=>sum + (s.tax || 0),0);
    res.json({sales, totalRevenue,totalTax})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

// purchase report

exports.getPurchaseReport =async (req,res)=>{
  try {
    const {startDate,endDate}=req.query
    const filter ={};

    if(startDate && endDate){
      filter.PurchaseDate ={$gte:new Date(startDate),$lte:new Date(endDate)}
     
      const purchases =await Purchase.find(filter);
      
      const totalPurchase = purchases.reduce((sum,p)=> sum + p.totalAmount,0);
      const totalTax = purchases.reduce((sum,p)=>sum + (p.tax || 0),0);

      res.json({purchases,totalPurchase,totalTax})


    }
  } catch (error) {
     res.status(500).json({ message: err.message });
  }
}



