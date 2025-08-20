const PurchaseInvoice = require("../models/PurchaseInvoice");
const Product = require("../models/Product");
const Payment = require("../models/Payment");

// ➕ Add a purchase
exports.addPurchase = async (req, res) => {
  try {
    const { purchaseOrderNumber, sellerName, product: productName, quantity, unitPrice, tax, totalAmount,  paidAmount = 0, purchaseDate } = req.body;

    const purchase = new PurchaseInvoice({ purchaseOrderNumber, sellerName, product: productName, quantity, unitPrice, tax, totalAmount, paidAmount, purchaseDate });
    await purchase.save();

    const product = await Product.findOne({ name: productName.trim() });
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.sizes && product.sizes.length > 0) {
      product.sizes[0].quantity = (product.sizes[0].quantity || 0) + Number(quantity);
    } else {
      product.sizes = [{ size: "Default", quantity: Number(quantity) }];
    }

    product.purchasePrice = Number(unitPrice);
    await product.save();

    res.status(201).json({ message: "✅ Purchase added & product updated", purchase, product });
  } catch (err) {
    console.error("❌ Error adding purchase:", err);
    res.status(400).json({ error: err.message });
  }
};

// 📋 Get all purchases
exports.getAllPurchases = async (req, res) => {
  try {
    // If product is stored as String, keep find()
    // If product is ObjectId ref, you can use .populate("product")
    const purchases = await PurchaseInvoice.find().sort({ createdAt: -1 });
    const purchasesWithPaid = purchases.map(p => ({
      ...p._doc,           // raw document fields
      paidAmount: p.paidAmount ?? 0
    }));

    res.json(purchasesWithPaid);
  } catch (err) {
    console.error("❌ Error fetching purchases:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    const { purchaseOrderNumber, sellerName, product: productName, size, quantity, unitPrice, tax, totalAmount, paidAmount = 0, purchaseDate } = req.body;

    // Validate required fields
    if (!purchaseOrderNumber || !sellerName || !productName || !quantity || !unitPrice || !totalAmount || !purchaseDate) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Find existing purchase
    const existingPurchase = await PurchaseInvoice.findById(req.params.id);
    if (!existingPurchase) return res.status(404).json({ message: "Purchase not found" });

    // Calculate quantity difference for stock update
    const qtyDiff = Number(quantity) - Number(existingPurchase.quantity);

    // Update purchase document
    existingPurchase.purchaseOrderNumber = purchaseOrderNumber;
    existingPurchase.sellerName = sellerName;
    existingPurchase.product = productName;
    existingPurchase.size = size;
    existingPurchase.quantity = quantity;
    existingPurchase.unitPrice = unitPrice;
    existingPurchase.tax = tax;
    existingPurchase.totalAmount = totalAmount;
    existingPurchase.purchaseDate = purchaseDate;
    existingPurchase.paidAmount = paidAmount;

    await existingPurchase.save();

    // Update Product stock
    const product = await Product.findOne({ name: productName.trim() });
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        product.sizes[0].quantity = (product.sizes[0].quantity || 0) + qtyDiff;
      } else {
        product.sizes = [{ size: size || "Default", quantity: qtyDiff }];
      }
      product.purchasePrice = Number(unitPrice);
      await product.save();
    }

    res.json({ message: "✅ Purchase updated & stock adjusted", purchase: existingPurchase, product });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🗑️ Delete a purchase (and adjust stock)
exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await PurchaseInvoice.findByIdAndDelete(req.params.id);
    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    // Decrease stock by deleted purchase quantity
    await Product.findOneAndUpdate(
      { name: purchase.product },
      { $inc: { quantity: -purchase.quantity } }
    );

    res.json({ message: "✅ Purchase deleted & stock adjusted" });
  } catch (err) {
    console.error("❌ Error deleting purchase:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all pending dues
// Get all pending purchase dues
// Get all pending purchase dues
exports.getPurchaseDues = async (req, res) => {
  try {
    // Fetch all purchases
    const purchases = await PurchaseInvoice.find().lean();

    // Calculate dues based on paidAmount
    const dues = purchases.map(p => {
      return {
        _id: p._id,
        date: p.purchaseDate,
        vendor: p.sellerName,
        invoiceNo: p.purchaseOrderNumber,
        totalAmount: p.totalAmount,
        paidAmount: p.paidAmount || 0,
        balanceDue: p.totalAmount - (p.paidAmount || 0),
      };
    });

    // Only return purchases with pending balance
    res.json(dues.filter(d => d.balanceDue > 0));
  } catch (err) {
    console.error("Error fetching purchase dues:", err);
    res.status(500).json({ error: "Server error" });
  }
};