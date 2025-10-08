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

    const qtyToAdd = Number(quantity) || 0;

    const purchase = new PurchaseInvoice({
      purchaseOrderNumber,
      supplierName,
      product: productName,
      variantId: variantId || null, // ✅ store variantId for tracking
      quantity: qtyToAdd,
      unitPrice: Number(unitPrice) || 0,
      tax,
      totalAmount: Number(totalAmount) || 0,
      paidAmount: Number(paidAmount) || 0,
      purchaseDate,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });

    await purchase.save();

    // 🔹 If purchase is for a variant
    if (variantId) {
      const variant = await ProductVariant.findById(variantId);
      // console.log("variant", variant);
      if (!variant) return res.status(404).json({ error: "Variant not found" });

      console.log("Old Variant Qty:", variant.quantity, "Adding:", qtyToAdd, "variant", variant);

      variant.quantity = (variant.quantity || 0) + qtyToAdd;
      console.log("Total variant quantity", variant.quantity);
      
      variant.purchasePrice = Number(unitPrice) || variant.purchasePrice;
      variant.expiryDate = expiryDate ? new Date(expiryDate) : variant.expiryDate;
      await variant.save();

      await Product.findByIdAndUpdate(variant.product, {
        purchasePrice: Number(unitPrice) || 0,
      });
    } else {
      // 🔹 Simple product
      const product = await Product.findOne({ name: productName.trim() });
      if (!product) return res.status(404).json({ error: "Product not found" });

      console.log("Old Product Qty:", product.quantity, "Adding:", qtyToAdd);

      product.quantity = (product.quantity || 0) + qtyToAdd;
      product.purchasePrice = Number(unitPrice) || product.purchasePrice;
      product.expiryDate = expiryDate ? new Date(expiryDate) : product.expiryDate;
      await product.save();
    }

    res.status(201).json({ message: "✅ Purchase added & stock updated", purchase });
  } catch (err) {
    console.error("❌ Error adding purchase:", err);
    res.status(400).json({ error: err.message });
  }
};


// exports.addPurchase = async (req, res) => {
//   try {
//     const {
//       purchaseOrderNumber,
//       supplierName,
//       product: productName,
//       variantId,
//       quantity,
//       unitPrice,
//       tax,
//       totalAmount,
//       paidAmount = 0,
//       purchaseDate,
//       expiryDate,
//     } = req.body;

//     console.log(req.body);
    
//     const qtyToAdd = Number(quantity) || 0;

//     // 🔹 Check if purchaseOrderNumber already exists to avoid duplicates
//     const existingPurchase = await PurchaseInvoice.findOne({ purchaseOrderNumber });
//     if (existingPurchase) {
//       return res.status(400).json({ error: "Purchase order number already exists" });
//     }

//     // 🔹 Create purchase invoice
//     const purchase = new PurchaseInvoice({
//       purchaseOrderNumber,
//       supplierName,
//       product: productName,
//       variantId: variantId || null,
//       quantity: qtyToAdd,
//       unitPrice: Number(unitPrice) || 0,
//       tax,
//       totalAmount: Number(totalAmount) || 0,
//       paidAmount: Number(paidAmount) || 0,
//       purchaseDate,
//       expiryDate: expiryDate ? new Date(expiryDate) : null,
//     });

//     await purchase.save();
//     // console.log(variantId);
//     if (variantId) {
//       // 🔹 Update variant stock
//       const variant = await ProductVariant.findById(variantId);
      
      
//       if (!variant) return res.status(404).json({ error: "Variant not found" });

//       // console.log("Before update - Variant:", JSON.stringify(variant, null, 2));

//       variant.quantity = (variant.quantity || 0) + qtyToAdd;
//       variant.purchasePrice = Number(unitPrice) || variant.purchasePrice;
//       variant.expiryDate = expiryDate ? new Date(expiryDate) : variant.expiryDate;

//       await variant.save();

//       console.log("After update - Variant Quantity:", variant.quantity);
//       console.log("After update - Variant:", JSON.stringify(variant, null, 2));

//       // Update parent product purchase price
//       await Product.findByIdAndUpdate(variant.product, {
//         purchasePrice: Number(unitPrice) || 0,
//       });
//     } else {
//       // 🔹 Update simple product stock
//       const product = await Product.findOne({ name: productName.trim() });
//       if (!product) return res.status(404).json({ error: "Product not found" });

//       // console.log("Before update - Product:", JSON.stringify(product, null, 2));

//       product.quantity = (product.quantity || 0) + qtyToAdd;
//       product.purchasePrice = Number(unitPrice) || product.purchasePrice;
//       product.expiryDate = expiryDate ? new Date(expiryDate) : product.expiryDate;

//       await product.save();

//       // console.log("After update - Product Quantity:", product.quantity);
//       // console.log("After update - Product:", JSON.stringify(product, null, 2));
//     }

//     res.status(201).json({ message: "✅ Purchase added & stock updated", purchase });
//   } catch (err) {
//     console.error("❌ Error adding purchase:", err);
//     res.status(400).json({ error: err.message });
//   }
// };

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
      expiryDate,
    } = req.body;

    const existingPurchase = await PurchaseInvoice.findById(req.params.id);
    if (!existingPurchase)
      return res.status(404).json({ message: "Purchase not found" });

    const newQty = Number(quantity) || 0;
    const qtyDiff = newQty - Number(existingPurchase.quantity);

    // Update purchase doc
    existingPurchase.purchaseOrderNumber = purchaseOrderNumber;
    existingPurchase.supplierName = supplierName;
    existingPurchase.product = productName;
    existingPurchase.variantId = variantId || null;
    existingPurchase.size = size;
    existingPurchase.quantity = newQty;
    existingPurchase.unitPrice = Number(unitPrice) || 0;
    existingPurchase.tax = tax;
    existingPurchase.totalAmount = Number(totalAmount) || 0;
    existingPurchase.purchaseDate = purchaseDate;
    existingPurchase.paidAmount = Number(paidAmount) || 0;
    existingPurchase.expiryDate = expiryDate ? new Date(expiryDate) : null;
    await existingPurchase.save();

    // 🔹 Stock update
    if (variantId) {
      const updatedVariant = await ProductVariant.findOne({ variantId: variantId.trim() });
      if (!updatedVariant)
        return res.status(404).json({ message: "Variant not found" });

      console.log("Old Variant Qty:", updatedVariant.quantity, "Adjusting:", qtyDiff);

      updatedVariant.quantity = (updatedVariant.quantity || 0) + qtyDiff;
      updatedVariant.purchasePrice = Number(unitPrice) || updatedVariant.purchasePrice;
      updatedVariant.expiryDate = expiryDate ? new Date(expiryDate) : updatedVariant.expiryDate;
      await updatedVariant.save();

      await Product.findByIdAndUpdate(updatedVariant.product, {
        purchasePrice: Number(unitPrice) || 0,
      });
    } else {
      const product = await Product.findOne({ name: productName.trim() });
      if (product) {
        console.log("Old Product Qty:", product.quantity, "Adjusting:", qtyDiff);

        product.quantity = (product.quantity || 0) + qtyDiff;
        product.purchasePrice = Number(unitPrice) || product.purchasePrice;
        product.expiryDate = expiryDate ? new Date(expiryDate) : product.expiryDate;
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

    const qtyToRemove = Number(purchase.quantity) || 0;

    // Adjust stock
    if (purchase.variantId) {
      const variant = await ProductVariant.findById(variantId);
      if (variant) {
        console.log("Old Variant Qty:", variant.quantity, "Removing:", qtyToRemove);

        variant.quantity = Math.max(0, (variant.quantity || 0) - qtyToRemove);
        await variant.save();
      }
    } else {
      const product = await Product.findOne({ name: purchase.product.trim() });
      if (product) {
        console.log("Old Product Qty:", product.quantity, "Removing:", qtyToRemove);

        product.quantity = Math.max(0, (product.quantity || 0) - qtyToRemove);
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


