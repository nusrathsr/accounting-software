const mongoose = require('mongoose');
const Payment = require("../models/Payment");
const Customer = require("../models/Customer");
const PurchaseInvoice = require("../models/PurchaseInvoice");
const SalesInvoice = require("../models/SalesInvoice");

// Utility: Recalculate balance for a customer/vendor
async function recalcBalance(custId) {
  const cust = await Customer.findById(custId);
  if (!cust) return 0;

  let balance = 0;

  if (["retail customer", "wholesale customer"].includes(cust.type.toLowerCase())) {
    // Customer: total sales - total receipts
    const sales = await SalesInvoice.find({ customer: custId });
    const receipts = await Payment.find({ customer: custId, type: "receipt" });

    balance = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0)
            - receipts.reduce((sum, r) => sum + (r.amount || 0), 0);
  } else {
    // Vendor: total purchases - total payments
    const purchases = await PurchaseInvoice.find({ vendor: custId });
    const payments = await Payment.find({ customer: custId, type: "payment" });

    balance = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0)
            - payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  }

  cust.balance = balance;
  await cust.save();
  return balance;
}

// ➕ Add Payment/Receipt
exports.addPayment = async (req, res) => {
  try {
    const { type, customer, purchaseId, salesId, amount, mode, date, notes, reference, status } = req.body;

    const cust = await Customer.findById(customer);
    if (!cust) return res.status(404).json({ error: "Customer/Vendor not found" });

    const payment = new Payment({ type, customer, purchaseId, salesId, amount, mode, date, notes, reference, status });
    await payment.save();

    // Update invoice paidAmount
    if (type === "payment" && purchaseId) {
      const purchase = await PurchaseInvoice.findById(purchaseId);
      if (purchase) {
        const relatedPayments = await Payment.find({ purchaseId });
        purchase.paidAmount = relatedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        await purchase.save();
      }
    }

    if (type === "receipt" && salesId) {
      const sale = await SalesInvoice.findById(salesId);
      if (sale) {
        const relatedReceipts = await Payment.find({ salesId });
        sale.paidAmount = relatedReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);
        await sale.save();
      }
    }

    const balance = await recalcBalance(customer);

    res.status(201).json({ payment, balance });
  } catch (err) {
    console.error("Error in addPayment:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📄 Get all Payments/Receipts
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
       .populate("customer", "name")
  .populate("purchaseId", "totalAmount paidAmount")
  .populate("salesId", "totalAmount paidAmount");

    res.json(payments);
  } catch (err) {
    console.error("Error in getAllPayments:", err);
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete Payment/Receipt
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    // Update related invoice
    if (payment.type === "payment" && payment.purchaseId) {
      const purchase = await PurchaseInvoice.findById(payment.purchaseId);
      if (purchase) {
        const relatedPayments = await Payment.find({ purchaseId: payment.purchaseId });
        purchase.paidAmount = relatedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        await purchase.save();
      }
    }

    if (payment.type === "receipt" && payment.salesId) {
      const sale = await SalesInvoice.findById(payment.salesId);
      if (sale) {
        const relatedReceipts = await Payment.find({ salesId: payment.salesId });
        sale.paidAmount = relatedReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);
        await sale.save();
      }
    }

    const balance = await recalcBalance(payment.customer);

    res.json({ message: "Payment/Receipt deleted and balances updated", balance });
  } catch (err) {
    console.error("Error in deletePayment:", err);
    res.status(500).json({ error: err.message });
  }
};
