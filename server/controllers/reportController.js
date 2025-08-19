const Purchase =require("../models/PurchaseInvoice")
const SalesInvoice =require('../models/SalesInvoice')
const Expense =require('../models/Expense')
const Product =require("../models/Product")


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

    const purchases = await Purchase.find(filter);

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


//stock report

// exports.getStockReport = async (req, res) => {
//   try {
//     const products = await Product.find();

//     let totalQuantity = 0;
//     let totalStockValue = 0;

//     const productDetails = products.map((p) => {
//       let productQuantity = 0;
//       let productValue = 0;

//       if (p.sizes && p.sizes.length > 0) {
//         p.sizes.forEach((s) => {
//           const qty = s.quantity || 0;
//           productQuantity += qty;
//           productValue += qty * (p.purchasePrice || 0);
//         });
//       } else {
//         const qty = p.quantity || 0;
//         productQuantity += qty;
//         productValue += qty * (p.purchasePrice || 0);
//       }

//       totalQuantity += productQuantity;
//       totalStockValue += productValue;

//       return {
//         id: p._id,
//         name: p.name,
//         brand: p.brand,
//         purchasePrice: p.purchasePrice || 0,
//         quantity: productQuantity,
//         stockValue: productValue,
//       };
//     });

//     res.json({
//       totalProducts: products.length,
//       totalQuantity,
//       totalStockValue,
//       productDetails,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



      
    




exports.getStockReport = async (req, res) => {
  try {
    const products = await Product.find();

    // Aggregate total purchases per product name (normalized)
    const purchaseAgg = await Purchase.aggregate([
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$product" } } },
          totalQuantity: { $sum: "$quantity" }
        }
      }
    ]);

    // Aggregate total sales per product name (normalized)
    const salesAgg = await SalesInvoice.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$products.name" } } },
          totalQuantity: { $sum: "$products.quantity" }
        }
      }
    ]);

    // Convert aggregates to lookup objects
    const purchaseMap = {};
    purchaseAgg.forEach(p => { purchaseMap[p._id] = p.totalQuantity; });

    const salesMap = {};
    salesAgg.forEach(s => { salesMap[s._id] = s.totalQuantity; });

    // Build final report
    const report = products.map(product => {
      const productKey = product.name.toLowerCase().trim();
      const totalPurchases = purchaseMap[productKey] || 0;
      const totalSales = salesMap[productKey] || 0;
      const openingStock = product.openingStock || 0;

      // Prevent negative closing stock
      let closingStock = openingStock + totalPurchases - totalSales;
      if (closingStock < 0) closingStock = 0;

      const stockValue = closingStock * (product.purchasePrice || 0);

      return {
        productId: product.productId,
        sku: product.sku,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand,
        openingStock,
        purchases: totalPurchases,
        sales: totalSales,
        closingStock,
        costPerUnit: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        stockValue,
      };
    });

    res.status(200).json({ report });
  } catch (error) {
    console.error("Stock report error:", error);
    res.status(500).json({ message: "Failed to generate stock report", error: error.message });
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