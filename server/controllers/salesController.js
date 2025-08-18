const SalesInvoice = require("../models/SalesInvoice");
const Product = require("../models/Product");

// Add a sale
// Add a sale
exports.addSale = async (req, res) => {
  const session = await Product.startSession();
  session.startTransaction();

  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "At least one product is required" });
    }

    // Reduce stock for each product
    for (const item of products) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }

      // Find matching size
      const sizeIndex = product.sizes.findIndex(s => s.size.trim() === item.size.trim());
      if (sizeIndex === -1) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Size ${item.size} not found for ${product.name}` });
      }

      // Check stock availability
      if (product.sizes[sizeIndex].quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Insufficient stock for ${product.name} (${item.size})` });
      }

      // Deduct stock
      product.sizes[sizeIndex].quantity -= item.quantity;

      await product.save({ session });
    }

    // Save the sale
    const sale = new SalesInvoice(req.body);
    await sale.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(sale);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await SalesInvoice.find();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a sale
exports.deleteSale = async (req, res) => {
  try {
    await SalesInvoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get latest sale
exports.getLatestSale = async (req, res) => {
  try {
    const latestSale = await SalesInvoice.findOne().sort({ createdAt: -1 }); // Sort by newest first
    if (!latestSale) {
      return res.status(404).json({ message: "No sales found" });
    }
    res.json(latestSale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

