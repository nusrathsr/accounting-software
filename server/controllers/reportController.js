const PurchaseInvoice = require('../models/PurchaseInvoice')
const SalesInvoice = require('../models/SalesInvoice')
const Expense = require('../models/Expense')
const Product = require("../models/Product")
const ProductVariant = require("../models/ProductVariant")


//sales report

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {}
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }
    const sales = await SalesInvoice.find(filter)
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0)
    const totalTax = sales.reduce((sum, s) => sum + (s.tax || 0), 0);
    res.json({ sales, totalRevenue, totalTax })
  } catch (error) {
    res.status(500).json({ message: error.message })
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








exports.getStockReport = async (req, res) => {
  try {
    const variants = await ProductVariant.find().populate("product");
    const purchases = await PurchaseInvoice.find();
    const sales = await SalesInvoice.find();

    const report = variants.map((variant) => {
      const product = variant.product;

      if (!product) return null;
      // Purchases for this variant (matching product + maybe variant name if you store it)
      const purchaseQty = purchases
        .filter((p) => p.product === product.name) // adjust if you store ObjectId instead of name
        .reduce((sum, p) => sum + (p.quantity || 0), 0);

      // Sales for this variant
      const salesQty = sales
        .flatMap((s) => s.products)
  .filter((sp) => sp.variantId && sp.variantId.toString() === variant._id.toString())
        .reduce((sum, sp) => sum + (sp.quantity || 0), 0);

      const opening = 0; // set if you track separately
      const closing = opening + purchaseQty - salesQty;

      const costPerUnit = variant.purchasePrice || product.purchasePrice || 0;
      const sellingPrice = variant.sellingPrice || product.sellingPrice || 0;
      const stockValue = closing * costPerUnit;

      // 🔔 Low stock alert (hardcoded reorder level = 10)
      const lowStockAlert = closing < 10 ? "Low Stock - Reorder" : "OK";

      return {
        sku: variant.variantId,
        variantName: variant.variantName,
        category: product.category,
        brand: product.brand,
        sizeOrWeight: variant.sizeOrWeight,
        opening,
        purchases: purchaseQty,
        sales: salesQty,
        closing,
        costPerUnit,
        sellingPrice,
        stockValue,
        status: lowStockAlert
      };
    }).filter(r => r !== null);

    res.json({
      totalVariants: report.length,
      totalClosingStock: report.reduce((sum, r) => sum + r.closing, 0),
      totalStockValue: report.reduce((sum, r) => sum + r.stockValue, 0),
      report,
    });
  } catch (error) {
    console.error("Error generating stock report:", error);
    res.status(500).json({ message: "Server error", error });
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