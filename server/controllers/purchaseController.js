const PurchaseInvoice = require("../models/PurchaseInvoice");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Payment = require("../models/Payment");

// ➕ Add Purchase
exports.addPurchase = async (req, res) => {
  try {
    const {
      purchaseOrderNumber,
      supplierName,
      product: productName,
      variantId,
      quantity,
      unitPrice,
      tax,
      totalAmount,
      paidAmount = 0,
      purchaseDate,
      expiryDate,
    } = req.body;

    const purchase = new PurchaseInvoice({
      purchaseOrderNumber,
      supplierName,
      product: productName,
      quantity,
      unitPrice,
      tax,
      totalAmount,
      paidAmount,
      purchaseDate,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });
    await purchase.save();

    // 🔹 If purchase is for a variant
    if (variantId) {
      const variant = await ProductVariant.findOne({ variantId });
      if (!variant) return res.status(404).json({ error: "Variant not found" });

      variant.quantity = (variant.quantity || 0) + Number(quantity);
      variant.purchasePrice = Number(unitPrice);
      variant.expiryDate = expiryDate ? new Date(expiryDate) : null;
      await variant.save();

      await Product.findByIdAndUpdate(variant.product, {
        purchasePrice: Number(unitPrice),
      });
    } else {
      // 🔹 Simple product
      const product = await Product.findOne({ name: productName.trim() });
      if (!product) return res.status(404).json({ error: "Product not found" });

      product.quantity = (product.quantity || 0) + Number(quantity);
      product.purchasePrice = Number(unitPrice);
      product.expiryDate = expiryDate ? new Date(expiryDate) : null;
      await product.save();
    }

    res
      .status(201)
      .json({ message: "✅ Purchase added & stock updated", purchase });
  } catch (err) {
    console.error("❌ Error adding purchase:", err);
    res.status(400).json({ error: err.message });
  }
};

// 📋 Get all purchases
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await PurchaseInvoice.find().sort({ createdAt: -1 });
    const purchasesWithPaid = purchases.map((p) => ({
      ...p._doc,
      paidAmount: p.paidAmount ?? 0,
    }));

    res.json(purchasesWithPaid);
  } catch (err) {
    console.error("❌ Error fetching purchases:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update Purchase
exports.updatePurchase = async (req, res) => {
  try {
    const {
      purchaseOrderNumber,
      supplierName,
      product: productName,
      variantId,
      size,
      quantity,
      unitPrice,
      tax,
      totalAmount,
      paidAmount = 0,
      purchaseDate,
      expiryDate, // ✅ FIXED (was missing earlier)
    } = req.body;

    if (
      !purchaseOrderNumber ||
      !supplierName ||
      !productName ||
      !quantity ||
      !unitPrice ||
      !totalAmount ||
      !purchaseDate
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const existingPurchase = await PurchaseInvoice.findById(req.params.id);
    if (!existingPurchase)
      return res.status(404).json({ message: "Purchase not found" });

    const qtyDiff = Number(quantity) - Number(existingPurchase.quantity);

    // Update purchase doc
    existingPurchase.purchaseOrderNumber = purchaseOrderNumber;
    existingPurchase.supplierName = supplierName;
    existingPurchase.product = productName;
    existingPurchase.size = size;
    existingPurchase.quantity = quantity;
    existingPurchase.unitPrice = unitPrice;
    existingPurchase.tax = tax;
    existingPurchase.totalAmount = totalAmount;
    existingPurchase.purchaseDate = purchaseDate;
    existingPurchase.paidAmount = paidAmount;
    existingPurchase.expiryDate = expiryDate ? new Date(expiryDate) : null;
    await existingPurchase.save();

    // 🔹 Stock update
    if (variantId) {
      const updatedVariant = await ProductVariant.findOne({ variantId });
      if (!updatedVariant)
        return res.status(404).json({ message: "Variant not found" });

      updatedVariant.quantity =
        (updatedVariant.quantity || 0) + qtyDiff;
      updatedVariant.purchasePrice = Number(unitPrice);
      updatedVariant.expiryDate = expiryDate ? new Date(expiryDate) : null;
      await updatedVariant.save();

      await Product.findByIdAndUpdate(updatedVariant.product, {
        purchasePrice: Number(unitPrice),
      });
    } else {
      const product = await Product.findOne({ name: productName.trim() });
      if (product) {
        product.quantity = (product.quantity || 0) + qtyDiff;
        product.purchasePrice = Number(unitPrice);
        product.expiryDate = expiryDate ? new Date(expiryDate) : null;
        await product.save();
      }
    }

    res.json({
      message: "✅ Purchase updated & stock adjusted",
      purchase: existingPurchase,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🗑️ Delete Purchase
exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await PurchaseInvoice.findByIdAndDelete(req.params.id);
    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    // Adjust stock
    if (purchase.variantId) {
      // If it was a variant
      const variant = await ProductVariant.findOne({ variantId: purchase.variantId });
      if (variant) {
        variant.quantity = Math.max(
          0,
          (variant.quantity || 0) - Number(purchase.quantity)
        );
        await variant.save();
      }
    } else {
      // If it was a simple product
      const product = await Product.findOne({ name: purchase.product });
      if (product) {
        product.quantity = Math.max(
          0,
          (product.quantity || 0) - Number(purchase.quantity)
        );
        await product.save();
      }
    }

    res.json({ message: "✅ Purchase deleted & stock adjusted" });
  } catch (err) {
    console.error("❌ Error deleting purchase:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📌 Get Pending Purchase Dues
exports.getPurchaseDues = async (req, res) => {
  try {
    const purchases = await PurchaseInvoice.find().lean();

    const dues = purchases.map((p) => ({
      _id: p._id,
      date: p.purchaseDate,
      vendor: p.supplierName,
      invoiceNo: p.purchaseOrderNumber,
      totalAmount: p.totalAmount,
      paidAmount: p.paidAmount || 0,
      balanceDue: p.totalAmount - (p.paidAmount || 0),
    }));

    res.json(dues.filter((d) => d.balanceDue > 0));
  } catch (err) {
    console.error("Error fetching purchase dues:", err);
    res.status(500).json({ error: "Server error" });
  }
};
