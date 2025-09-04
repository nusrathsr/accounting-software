const PurchaseInvoice = require("../models/PurchaseInvoice");

exports.getTransactions = async (req, res) => {
  try {
    // Fetch all purchases
    const purchases = await PurchaseInvoice.find().populate("vendor");

    // Map purchases into a transaction format
    const purchaseTransactions = purchases.map(p => ({
      type: "Purchase",
      transactionId: p._id,
      orderNumber: p.purchaseOrderNumber,
      supplierName: p.supplierName,
      date: p.purchaseDate,
      totalAmount: p.totalAmount,
      paidAmount: p.paidAmount,
      balanceDue: p.totalAmount - p.paidAmount,
      status: p.paidAmount === 0 ? "Pending" : (p.paidAmount < p.totalAmount ? "Partial" : "Paid")
    }));

    // In future, add Sales, Payments, Receipts here
    const allTransactions = [...purchaseTransactions];

    res.json(allTransactions);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
