const PurchaseInvoice =require('../models/PurchaseInvoice')
const SalesInvoice =require('../models/SalesInvoice')
const Expense =require('../models/Expense')
const Product =require("../models/Product")
const ProductVariant =require("../models/ProductVariant")


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

exports.getPurchaseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.purchaseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const purchases = await PurchaseInvoice.find(filter);

    let totalPurchase = 0;
    let totalTax = 0;

    const report = purchases.map((purchase) => {
      const qty = purchase.quantity || 0;
      const unitPrice = purchase.unitPrice || 0;
      const tax = purchase.tax || 0;

      const purchaseTotal = unitPrice * qty;
      const purchaseTax = (unitPrice * tax / 100) * qty;

      totalPurchase += purchaseTotal;
      totalTax += purchaseTax;

      return {
        _id: purchase._id,
        purchaseOrderNumber: purchase.purchaseOrderNumber,
        purchaseDate: purchase.purchaseDate,
        sellerName: purchase.sellerName,
        product: purchase.product,
        quantity: qty,
        unitPrice,
        tax,
        totalAmount: purchase.totalAmount,
      };
    });

    res.json({
      purchases: report,             // 👈 rename for frontend
      totalPurchase,
      totalTax,
      grandTotal: totalPurchase + totalTax,
      totalOrders: report.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};





      
    
//get stock report

exports.getStockReport = async (req, res) => {
  try {
    // 1️⃣ Fetch all product variants
    const variants = await ProductVariant.find().populate("product");

    // 2️⃣ Build report for each variant
    const report = await Promise.all(
      variants.map(async (v) => {
        // ---- Purchases from PurchaseInvoice ----
        const purchases = await PurchaseInvoice.aggregate([
          { $match: { product: v.variantName } },  // match by product name
          { $group: { _id: null, total: { $sum: "$quantity" } } },
        ]);

        // ---- Sales from SalesInvoice (has array of products) ----
        const sales = await SalesInvoice.aggregate([
          { $unwind: "$products" },
          { $match: { "products.variantId": v._id } },
          { $group: { _id: null, total: { $sum: "$products.quantity" } } },
        ]);

        // Extract totals
        const totalPurchases = purchases[0]?.total || 0;
        const totalSales = sales[0]?.total || 0;
        const closingStock = totalPurchases - totalSales;

        // 3️⃣ Return one row for this variant
        return {
          variantId: v._id,
          variantName: v.variantName,
          sku: v.sku,
          product: {
            productId: v.product?._id,
            brand: v.product?.brand || "-",
            category: v.product?.category || "-",
            subcategory: v.product?.subcategory || "-",
          },
          openingStock: 0, // extend later if you want
          purchases: totalPurchases,
          sales: totalSales,
          closing: closingStock,
          purchasePrice: v.purchasePrice,
          sellingPrice: v.sellingPrice,
          stockValue: closingStock * (v.purchasePrice || 0),
        };
      })
    );

    // 4️⃣ Send response
    res.json({ success: true, report });
  } catch (err) {
    console.error("Stock Report Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getExpenseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter if provided
    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Fetch expenses
    const expenses = await Expense.find(filter).sort({ date: -1 });

    // Calculate total amount
    const totalAmount = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    // Calculate category-wise totals
    const categoryTotals = {};
    expenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    res.status(200).json({
      totalAmount,
      totalItems: expenses.length,
      categoryTotals,
      expenses,
    });
  } catch (error) {
    console.error("Expense report error:", error);
    res.status(500).json({ message: "Failed to generate expense report" });
  }
};