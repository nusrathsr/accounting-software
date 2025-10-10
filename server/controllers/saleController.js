const Sale = require("../models/Sale");
const ProductVariant = require("../models/ProductVariant");

// ✅ Create Sale & update stock
exports.createSale = async (req, res) => {
  try {
    const { customerName, items, totalAmount, paymentMethod } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one product is required" });
    }

    // Validate each item
    for (const item of items) {
      if (!item.variantId || !item.quantity || !item.unitPrice || !item.lineTotal) {
        return res.status(400).json({ message: "Each item must have variantId, quantity, unitPrice, and lineTotal" });
      }

      // Check stock
      const variant = await ProductVariant.findOne({ variantId: item.variantId });
      if (!variant) {
        return res.status(404).json({ message: `Variant ${item.variantId} not found` });
      }
      if (variant.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${variant.variantName || item.variantId}, available: ${variant.quantity}`
        });
      }

      // Reduce stock
      variant.quantity -= item.quantity;
      await variant.save();
    }

    // Validate payment method
    if (!paymentMethod || !paymentMethod.paymentMode) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    if (paymentMethod.paymentMode === "single") {
      if (!paymentMethod.singlePaymentMethod) {
        return res.status(400).json({ message: "Single payment method is required" });
      }
      // Ensure splitPayments is empty if single
      paymentMethod.splitPayments = [];
    } else if (paymentMethod.paymentMode === "split") {
      if (!Array.isArray(paymentMethod.splitPayments) || paymentMethod.splitPayments.length === 0) {
        return res.status(400).json({ message: "Split payments are required for split mode" });
      }
      // Validate each split payment
      for (const sp of paymentMethod.splitPayments) {
        if (!sp.method || typeof sp.amount !== "number") {
          return res.status(400).json({ message: "Each split payment must have method and amount" });
        }
      }
      // Optional: calculate total of split payments
      const splitTotal = paymentMethod.splitPayments.reduce((sum, sp) => sum + sp.amount, 0);
      if (splitTotal !== totalAmount) {
        return res.status(400).json({ message: "Split payment amounts do not add up to totalAmount" });
      }
    }

    // ✅ Save sale record
    const sale = new Sale({
      customerName,
      items, // frontend already sends variantName
      totalAmount,
      paymentMethod,
    });

    await sale.save();

    res.status(201).json({ message: "Sale recorded successfully", sale });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all sales
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error: error.message });
  }
};

// ✅ Get single sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sale", error: error.message });
  }
};
