const mongoose = require('mongoose');
const SalesReturn = require('../models/SalesReturn');
const SalesInvoice = require('../models/SalesInvoice');
const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');

// Generate unique return ID
const generateReturnId = async () => {
  const year = new Date().getFullYear();
  const lastReturn = await SalesReturn.findOne({ returnId: new RegExp(`^SR-${year}`) })
    .sort({ createdAt: -1 });

  if (lastReturn) {
    const lastNum = parseInt(lastReturn.returnId.split('-')[2]);
    return `SR-${year}-${String(lastNum + 1).padStart(4, '0')}`;
  }
  return `SR-${year}-0001`;
};

// Create a new sales return
exports.addSalesReturn = async (req, res) => {
  const session = await Product.startSession();
  session.startTransaction();

  try {
    console.log("📥 Received sales return request:", JSON.stringify(req.body, null, 2));

    const {
      referenceSaleId,
      returnDate,
      returnItems,
      refundMode,
      refundStatus,
      refundAmount,
      narration,
      notes
    } = req.body;

    // Validation
    if (!referenceSaleId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Reference sale ID is required' });
    }

    if (!returnItems || returnItems.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'At least one return item is required' });
    }

    // Validate reference sale exists
    const originalSale = await SalesInvoice.findById(referenceSaleId)
      .populate('products.variantId')
      .populate('products.productId')
      .session(session);

    if (!originalSale) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Original sale invoice not found' });
    }

    console.log("✅ Found original sale:", originalSale.invoiceNumber);

    // Validate return quantities and ensure productId exists
    for (const returnItem of returnItems) {
      if (!returnItem.returnQuantity || returnItem.returnQuantity <= 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Return quantity must be greater than 0 for ${returnItem.productName}`
        });
      }

      if (returnItem.returnQuantity > returnItem.soldQuantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Return quantity cannot exceed sold quantity for ${returnItem.productName}`
        });
      }

      // ✅ CRITICAL FIX: Handle missing productId
      let productId = returnItem.productId;

      // Strategy 1: If productId is missing, try to get it from variant
      if (!productId && returnItem.variantId) {
        console.log(`⚠️ ProductId missing for ${returnItem.productName}, fetching from variant...`);

        const variant = await ProductVariant.findById(returnItem.variantId).session(session);

        if (!variant) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: `Variant not found for: ${returnItem.productName}`
          });
        }

        // Check if variant has productId field
        if (variant.productId) {
          productId = variant.productId;
          returnItem.productId = productId;
          console.log(`✅ Retrieved productId from variant: ${productId}`);
        } else {
          // Strategy 2: If variant doesn't have productId, use variantId as productId
          // This handles the case where variants ARE the products (no parent-child relationship)
          console.log(`⚠️ Variant has no productId field, using variantId as productId`);
          productId = returnItem.variantId;
          returnItem.productId = productId;
        }
      }

      // Strategy 3: If still no productId, use variantId as fallback
      if (!productId && returnItem.variantId) {
        console.log(`⚠️ Using variantId as productId for ${returnItem.productName}`);
        productId = returnItem.variantId;
        returnItem.productId = productId;
      }

      // Final validation - productId must exist now
      if (!productId) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Cannot determine product ID for: ${returnItem.productName}`
        });
      }

      // Validate the product/variant exists
      let productOrVariant;

      // First try as a Product
      productOrVariant = await Product.findById(productId).session(session);

      // If not found as Product, try as ProductVariant
      if (!productOrVariant && returnItem.variantId) {
        productOrVariant = await ProductVariant.findById(productId).session(session);
      }

      if (!productOrVariant) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Product/Variant not found: ${returnItem.productName}`
        });
      }
    }

    console.log("✅ All validations passed");


    // 🔹 Generate return ID based on the sales invoice number
let returnId;

if (originalSale.invoiceNumber) {
  // Match both prefixes: S- or INV-
  if (originalSale.invoiceNumber.startsWith('S-') || originalSale.invoiceNumber.startsWith('INV-')) {
    // Remove prefix (S- or INV-) and replace with SR-
    returnId = originalSale.invoiceNumber.replace(/^(S-|INV-)/, 'SR-');
  }
}

// 🔹 If no valid invoice pattern, fallback to yearly auto-increment
if (!returnId) {
  const year = new Date().getFullYear();
  const lastReturn = await SalesReturn.findOne({ returnId: new RegExp(`^SR-${year}`) })
    .sort({ createdAt: -1 });

  if (lastReturn) {
    const lastNum = parseInt(lastReturn.returnId.split('-')[2]);
    returnId = `SR-${year}-${String(lastNum + 1).padStart(4, '0')}`;
  } else {
    returnId = `SR-${year}-0001`;
  }
}

// 🔹 Prevent duplicate returns for same invoice
const existingReturn = await SalesReturn.findOne({ returnId }).session(session);
if (existingReturn) {
  await session.abortTransaction();
  session.endSession();
  return res.status(400).json({ 
    message: `Sales return already exists for invoice ${originalSale.invoiceNumber}` 
  });
}

console.log("✅ Generated return ID:", returnId);



    // Calculate totals before creating document
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    const processedReturnItems = returnItems.map(item => {
      const itemSubtotal = item.returnQuantity * item.unitPrice;
      const itemDiscount = (itemSubtotal * (item.discount || 0)) / 100;
      const afterDiscount = itemSubtotal - itemDiscount;
      const itemTax = (afterDiscount * (item.taxRate || 0)) / 100;
      const calculatedReturnAmount = afterDiscount + itemTax;

      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;
      totalTax += itemTax;

      return {
        productId: item.productId,
        variantId: item.variantId || null,
        productName: item.productName,
        sizeOrWeight: item.sizeOrWeight || "",
        soldQuantity: item.soldQuantity,
        returnQuantity: item.returnQuantity,
        unitPrice: parseFloat(item.unitPrice) || 0,
        taxRate: parseFloat(item.taxRate) || 0,
        discount: parseFloat(item.discount) || 0,
        returnAmount: calculatedReturnAmount
      };
    });

    const totalReturnAmount = subtotal - totalDiscount + totalTax;

    console.log("💰 Calculated totals:", { subtotal, totalDiscount, totalTax, totalReturnAmount });

    // Create sales return with proper field mapping
    const salesReturn = new SalesReturn({
      returnId,
      returnDate: returnDate || new Date(),
      referenceSaleId,
      invoiceNumber: originalSale.invoiceNumber,
      customerName: originalSale.customerName || 'Walk-in Customer',
      customerId: originalSale.customerId,
      customerPhone: originalSale.number,
      returnItems: processedReturnItems,
      subtotal,
      totalTax,
      totalDiscount,
      totalReturnAmount,
      refundMode: refundMode || 'cash',
      refundStatus: refundStatus || 'pending',
      refundAmount: parseFloat(refundAmount) || 0,
      narration: narration || "",
      notes: notes || ""
    });

    console.log("💾 Saving sales return...");

    // Save the return (pre-save middleware will recalculate if needed)
    await salesReturn.save({ session });

    console.log("✅ Sales return saved:", salesReturn.returnId);

    // Update stock - add returned items back to inventory
    for (const item of returnItems) {
      console.log(`📦 Updating stock for: ${item.productName}`);

      // If we have a variantId, update variant stock
      if (item.variantId) {
        const variant = await ProductVariant.findByIdAndUpdate(
          item.variantId,
          { $inc: { quantity: item.returnQuantity } },
          { session, new: true }
        );
        console.log(`  ✅ Variant stock updated:`, variant?.quantity);
      }

      // Update product stock only if productId is different from variantId
      // (to avoid double-updating when they're the same)
      if (item.productId && item.productId.toString() !== item.variantId?.toString()) {
        const product = await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: item.returnQuantity } },
          { session, new: true }
        );
        console.log(`  ✅ Product stock updated:`, product?.quantity);
      } else if (item.productId && !item.variantId) {
        // If no variant, just update the product
        const product = await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: item.returnQuantity } },
          { session, new: true }
        );
        console.log(`  ✅ Product stock updated:`, product?.quantity);
      }
    }

    await session.commitTransaction();
    session.endSession();

    console.log("🎉 Sales return created successfully!");

    res.status(201).json({
      message: 'Sales return created successfully',
      salesReturn
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('❌ Error creating sales return:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      message: 'Server error while creating sales return',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get all sales returns
exports.getAllSalesReturns = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      customerName,
      refundStatus,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Date filter
    if (startDate || endDate) {
      query.returnDate = {};
      if (startDate) query.returnDate.$gte = new Date(startDate);
      if (endDate) query.returnDate.$lte = new Date(endDate);
    }

    // Customer filter
    if (customerName) {
      query.customerName = new RegExp(customerName, 'i');
    }

    // Status filter
    if (refundStatus) {
      query.refundStatus = refundStatus;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const salesReturns = await SalesReturn.find(query)
      .populate({
        path: 'referenceSaleId',
        select: 'invoiceNumber saleDate totalAmount'
      })
      .populate({
        path: 'returnItems.productId',
        select: 'name'
      })
      .populate({
        path: 'returnItems.variantId',
        select: 'variantName'
      })
      .sort({ returnDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await SalesReturn.countDocuments(query);

    res.json({
      salesReturns,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching sales returns:', error);
    res.status(500).json({
      message: 'Server error while fetching sales returns',
      error: error.message
    });
  }
};

// Get single sales return by ID
exports.getSalesReturnById = async (req, res) => {
  try {
    const salesReturn = await SalesReturn.findById(req.params.id)
      .populate({
        path: 'referenceSaleId',
        select: 'invoiceNumber saleDate totalAmount products'
      })
      .populate({
        path: 'returnItems.productId',
        select: 'name'
      })
      .populate({
        path: 'returnItems.variantId',
        select: 'variantName'
      });

    if (!salesReturn) {
      return res.status(404).json({ message: 'Sales return not found' });
    }

    res.json(salesReturn);

  } catch (error) {
    console.error('Error fetching sales return:', error);
    res.status(500).json({
      message: 'Server error while fetching sales return',
      error: error.message
    });
  }
};

// Get sales return by return ID
exports.getSalesReturnByReturnId = async (req, res) => {
  try {
    const salesReturn = await SalesReturn.findOne({ returnId: req.params.returnId })
      .populate({
        path: 'referenceSaleId',
        select: 'invoiceNumber saleDate totalAmount'
      })
      .populate({
        path: 'returnItems.productId',
        select: 'name'
      })
      .populate({
        path: 'returnItems.variantId',
        select: 'variantName'
      });

    if (!salesReturn) {
      return res.status(404).json({ message: 'Sales return not found' });
    }

    res.json(salesReturn);

  } catch (error) {
    console.error('Error fetching sales return:', error);
    res.status(500).json({
      message: 'Server error while fetching sales return',
      error: error.message
    });
  }
};

// Get sale invoice details for return
exports.getSaleForReturn = async (req, res) => {
  try {
    console.log("🔍 Fetching sale for return:", req.params.saleId);

    const sale = await SalesInvoice.findById(req.params.saleId).lean();

    if (!sale) {
      return res.status(404).json({ message: 'Sale invoice not found' });
    }

    console.log("✅ Found sale:", sale.invoiceNumber);

    // Get existing returns
    const existingReturns = await SalesReturn.find({
      referenceSaleId: req.params.saleId
    }).lean();

    console.log(`📋 Found ${existingReturns.length} existing returns`);

    // Calculate already returned quantities
    const returnedQuantities = {};
    existingReturns.forEach(returnDoc => {
      returnDoc.returnItems.forEach(item => {
        const key = `${item.productId}_${item.variantId || 'no-variant'}`;
        returnedQuantities[key] = (returnedQuantities[key] || 0) + item.returnQuantity;
      });
    });

    // Process products - just use what's already saved!
    const processedProducts = sale.products.map((product) => {
      // Extract IDs - they're already saved in the invoice
      const finalProductId = product.productId?.toString() || product.productId;
      const finalVariantId = product.variantId?.toString() || product.variantId;

      const key = `${finalProductId}_${finalVariantId || 'no-variant'}`;
      const alreadyReturned = returnedQuantities[key] || 0;

      return {
        ...product,
        productId: finalProductId,
        variantId: finalVariantId,
        availableForReturn: product.quantity - alreadyReturned,
        alreadyReturned
      };
    });

    sale.products = processedProducts;

    console.log("✅ Products processed successfully");
    console.log("📦 Sample product:", JSON.stringify(sale.products[0], null, 2));

    res.json(sale);

  } catch (error) {
    console.error('❌ Error fetching sale for return:', error);
    res.status(500).json({
      message: 'Server error while fetching sale',
      error: error.message
    });
  }
};

// Update sales return (for refund status, etc.)
exports.updateSalesReturn = async (req, res) => {
  try {
    const { refundStatus, refundAmount, notes } = req.body;

    const salesReturn = await SalesReturn.findById(req.params.id);

    if (!salesReturn) {
      return res.status(404).json({ message: 'Sales return not found' });
    }

    if (refundStatus) salesReturn.refundStatus = refundStatus;
    if (refundAmount !== undefined) salesReturn.refundAmount = refundAmount;
    if (notes !== undefined) salesReturn.notes = notes;

    await salesReturn.save();

    res.json({
      message: 'Sales return updated successfully',
      salesReturn
    });

  } catch (error) {
    console.error('Error updating sales return:', error);
    res.status(500).json({
      message: 'Server error while updating sales return',
      error: error.message
    });
  }
};

// Delete sales return (and restore stock)
exports.deleteSalesReturn = async (req, res) => {
  const session = await Product.startSession();
  session.startTransaction();

  try {
    const salesReturn = await SalesReturn.findById(req.params.id).session(session);

    if (!salesReturn) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Sales return not found' });
    }

    // Restore stock (remove the returned quantities)
    for (const item of salesReturn.returnItems) {
      // If variant exists, restore variant stock
      if (item.variantId) {
        await ProductVariant.findByIdAndUpdate(
          item.variantId,
          { $inc: { quantity: -item.returnQuantity } },
          { session }
        );
      }

      // Only restore product stock if productId is different from variantId
      if (item.productId && item.productId.toString() !== item.variantId?.toString()) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: -item.returnQuantity } },
          { session }
        );
      } else if (item.productId && !item.variantId) {
        // If no variant, just restore product
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: -item.returnQuantity } },
          { session }
        );
      }
    }

    await SalesReturn.findByIdAndDelete(req.params.id).session(session);

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Sales return deleted successfully' });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error deleting sales return:', error);
    res.status(500).json({
      message: 'Server error while deleting sales return',
      error: error.message
    });
  }
};

// Get sales return statistics
exports.getSalesReturnStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchQuery = {};
    if (startDate || endDate) {
      matchQuery.returnDate = {};
      if (startDate) matchQuery.returnDate.$gte = new Date(startDate);
      if (endDate) matchQuery.returnDate.$lte = new Date(endDate);
    }

    const stats = await SalesReturn.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalReturns: { $sum: 1 },
          totalReturnAmount: { $sum: '$totalReturnAmount' },
          totalRefunded: { $sum: '$refundAmount' },
          pendingRefunds: {
            $sum: {
              $cond: [{ $eq: ['$refundStatus', 'pending'] }, 1, 0]
            }
          },
          completedRefunds: {
            $sum: {
              $cond: [{ $eq: ['$refundStatus', 'completed'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json(stats[0] || {
      totalReturns: 0,
      totalReturnAmount: 0,
      totalRefunded: 0,
      pendingRefunds: 0,
      completedRefunds: 0
    });

  } catch (error) {
    console.error('Error fetching sales return stats:', error);
    res.status(500).json({
      message: 'Server error while fetching statistics',
      error: error.message
    });
  }
};

module.exports = exports;