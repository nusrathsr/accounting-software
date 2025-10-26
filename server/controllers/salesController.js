const SalesInvoice = require("../models/SalesInvoice");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");


exports.addSale = async (req, res) => {
  const session = await Product.startSession();
  session.startTransaction();

  try {
    console.log("➡️ Incoming request body:", req.body);
    const { products, splitPayments = [] } = req.body;

    if (!products || products.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "At least one product is required" });
    }

    // ✅ Reduce stock for each product variant
    for (const item of products) {
      const variant = await ProductVariant.findById(item.variantId).session(session);
      if (!variant) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Variant not found: ${item.variantId}` });
      }

      if (variant.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Insufficient stock for ${variant.variantName}` });
      }

      variant.quantity -= item.quantity;
      await variant.save({ session });

      await Product.findByIdAndUpdate(
        variant.productId,
        { $inc: { quantity: -item.quantity } },
        { session }
      );
    }

    // ✅ Extract other fields
    const {
      invoiceNumber,
      customerName,
      number,
      saleDate,
      subtotal,
      tax,
      totalAmount,
    } = req.body;

    // ✅ Convert splitPayments -> payments format
    const payments = splitPayments.map(p => ({
      mode: p.method,
      amount: Number(p.amount),
    }));

    // ✅ Create sale (pre("save") will auto-set status, balance, etc.)
    const sale = new SalesInvoice({
      invoiceNumber,
      customerName,
      number,
      saleDate,
      products,
      subtotal,
      tax,
      totalAmount,
      payments, // 👈 Correct format
    });

    console.log("💾 Saving sale:", sale);
    await sale.save({ session });

    await session.commitTransaction();
    session.endSession();
    console.log("✅ Sale saved successfully!");

    res.status(201).json(sale);
  } catch (err) {
    console.error("❌ Error in addSale:", err.message);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await SalesInvoice.find()
      .populate({
        path: "products.variantId",
        select: "variantName productId",
      })
      .populate({
        path: "products.productId",
        select: "name",
      })
      .lean();  // 👈 ensures payments array is returned as plain object

    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get latest sale
exports.getLatestSale = async (req, res) => {
  try {
    const latestSale = await SalesInvoice.findOne().sort({ createdAt: -1 })
      .populate({
        path: "products.variantId",
        select: "variantName productId",
      })
      .populate({
        path: "products.productId",
        select: "name",
      })
      .lean();  // 👈 return plain object with payments

    if (!latestSale) {
      return res.status(404).json({ message: "No sales found" });
    }

    res.json(latestSale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a sale (restore stock too)
exports.deleteSale = async (req, res) => {
  try {
    const sale = await SalesInvoice.findByIdAndDelete(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // Restore stock
    for (const item of sale.products) {
      if (item.variantId) {
        await ProductVariant.findByIdAndUpdate(
          item.variantId,
          { $inc: { quantity: item.quantity } }
        );
      }
      if (item.productId) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: item.quantity } }
        );
      }
    }

    res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Update a sale & adjust stock if needed
exports.updateSale = async (req, res) => {
  const session = await Product.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const newData = req.body;

    // Get the existing sale
    const existingSale = await SalesInvoice.findById(id).session(session);
    if (!existingSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // Step 1: Restore stock from old sale
    for (let item of existingSale.products) {
      if (item.variantId) {
        await ProductVariant.findByIdAndUpdate(
          item.variantId,
          { $inc: { stock: item.quantity } },
          { session }
        );
      } else {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: item.quantity } },
          { session }
        );
      }
    }

    // Step 2: Apply new data
    const updatedSale = await SalesInvoice.findByIdAndUpdate(id, newData, {
      new: true,
      session,
    })
      .populate({
        path: "products.variantId",
        select: "variantName productId",
      })
      .populate({
        path: "products.productId",
        select: "name",
      });

    // Step 3: Deduct stock for new sale
    for (let item of updatedSale.products) {
      if (item.variantId) {
        await ProductVariant.findByIdAndUpdate(
          item.variantId,
          { $inc: { stock: -item.quantity } },
          { session }
        );
      } else {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: -item.quantity } },
          { session }
        );
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(updatedSale);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Error in updateSale:", err.message);
    res.status(500).json({ error: err.message });
  }
};