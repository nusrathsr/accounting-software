const FinancialYear = require("../models/FinancialYear");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const PurchaseInvoice = require("../models/PurchaseInvoice");
const SalesInvoice = require("../models/SalesInvoice");
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    // Current Financial Year
    const currentFY = await FinancialYear.findOne({
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ startDate: -1 });

    // Total Products
    const totalProducts = await Product.countDocuments();

    // Out of Stock Products
    const outOfStock = await Product.countDocuments({ quantity: { $lte: 0 } });

    // Customers & Suppliers
    const totalCustomers = await Customer.countDocuments({ type: { $in: ["Retail Customer","Wholesale Customer"] } });
    const totalSuppliers = await Customer.countDocuments({ type: "Supplier" });

    // Today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    // Today's Sales (from SalesInvoice)
    const todaySalesAgg = await SalesInvoice.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const todaySales = todaySalesAgg[0]?.total || 0;

    // Today's Purchases (from PurchaseInvoice)
    const todayPurchasesAgg = await PurchaseInvoice.aggregate([
      { $match: { purchaseDate: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const todayPurchases = todayPurchasesAgg[0]?.total || 0;

    res.json({
      financialYear: currentFY ? currentFY.name : "N/A",
      totalProducts,
      outOfStock,
      totalCustomers,
      totalSuppliers,
      todaySales,
      todayPurchases
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
