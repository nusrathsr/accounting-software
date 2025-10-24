// const express = require("express");
// const router = express.Router();
// const { getDashboardStats } = require("../controllers/dashboardController");

// router.get("/", getDashboardStats);

// module.exports = router;

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Sale = require('../models/SalesInvoice');
const Purchase = require('../models/PurchaseInvoice');
const Payment = require('../models/Payment');
const Category = require('../models/Category');
const FinancialYear = require('../models/FinancialYear');
const Expense = require('../models/Expense');

// Main dashboard stats
router.get('/', async (req, res) => {
  try {
    // Get today's date range - start of day to end of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log("📅 Today range:", { today, tomorrow });

    // Get current financial year
   let financialYear = "N/A";
try {
  const today = new Date();
  const currentFinancialYear = await FinancialYear.findOne({
    startDate: { $lte: today },
    endDate: { $gte: today }
  });

  if (currentFinancialYear) {
    financialYear = currentFinancialYear.name || 
      `${currentFinancialYear.startDate.getFullYear()}-${currentFinancialYear.endDate.getFullYear()}`;
  } else {
    console.log("No financial year matches today's date");
  }
} catch (err) {
  console.log("Financial year error:", err.message);
}


    // Total products
    const totalProducts = await Product.countDocuments();

    // Out of stock products
    const outOfStock = await Product.countDocuments({ 
      quantity: { $lte: 0 } 
    });

    // Total customers
    const totalCustomers = await Customer.countDocuments();

    // Total suppliers - check Purchase model for supplier field
    let totalSuppliers = 0;
    try {
      // Debug: Check purchase structure
      const samplePurchase = await Purchase.findOne();
      console.log("Sample Purchase:", samplePurchase);
      
      // Try different supplier field names
      const supplierFields = ['supplier', 'supplierName', 'vendorName', 'vendor'];
      let uniqueSuppliers = [];
      
      for (const field of supplierFields) {
        try {
          uniqueSuppliers = await Purchase.distinct(field);
          if (uniqueSuppliers && uniqueSuppliers.length > 0) {
            console.log(`✅ Found suppliers in field: ${field}`, uniqueSuppliers);
            break;
          }
        } catch (err) {
          continue;
        }
      }
      
      totalSuppliers = uniqueSuppliers.filter(s => s != null && s !== '').length;
      console.log("👥 Total Suppliers:", totalSuppliers);
    } catch (err) {
      console.log("Supplier count error:", err.message);
    }

    // Today's sales - using totalAmount field
    let todaySales = 0;
    try {
      const todaySalesData = await Sale.aggregate([
        { 
          $match: { 
            date: { 
              $gte: today,
              $lt: tomorrow
            } 
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      
      todaySales = todaySalesData.length > 0 ? todaySalesData[0].total : 0;
      console.log("💰 Today Sales:", todaySales);
    } catch (err) {
      console.log("Today sales error:", err.message);
    }
    const purchaseFields = ['totalAmount', 'total', 'grandTotal', 'amount'];
    let todayPurchases = 0;
    for (const field of purchaseFields) {
      const purchaseData = await Purchase.aggregate([
        { $match: { purchaseDate: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      if (purchaseData.length > 0 && purchaseData[0].total > 0) {
        todayPurchases = purchaseData[0].total;
        break;
      }
    }

const sampleProduct = await Product.findOne();
    const priceFields = ['purchasePrice', 'price', 'sellingPrice', 'salePrice', 'unitPrice'];
    let priceField = 'purchasePrice';
    for (const field of priceFields) {
      if (sampleProduct && sampleProduct[field] !== undefined) {
        priceField = field;
        break;
      }
    }

    const inventoryValue = await Product.aggregate([
      {
        $project: {
            name: 1,
            quantity: { $ifNull: ['$quantity', 0] },
            price: { $ifNull: ['$purchasePrice', 0] },
            value: { $multiply: [{ $ifNull: ['$quantity', 0] }, { $ifNull: ['$purchasePrice', 0] }] }
        }
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$value' },
          totalItems: { $sum: '$quantity' },
          productCount: { $sum: 1 }
        }
      }
    ]);
    const value = inventoryValue.length > 0 ? inventoryValue[0] : {
        totalValue: 0,
        totalItems: 0,
        productCount: 0
    }

    res.json({
      financialYear,
      totalProducts,
      outOfStock,
      totalCustomers,
      totalSuppliers,
      todaySales: Math.round(todaySales * 100) / 100,
      todayPurchases: Math.round(todayPurchases * 100) / 100,
      inventoryValue: Math.round(inventoryValue * 100) / 100,
      totalItems: value.totalItems || 0,
      productCount: value.productCount || 0
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});
// Sales & Purchases Trends (Last 6 months)
router.get('/sales-trends', async (req, res) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      
      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        start,
        end
      });
    }

    const trendsData = await Promise.all(months.map(async ({ month, start, end }) => {
      let sales = 0;
      let purchases = 0;

      try {
        const salesData = await Sale.aggregate([
          { $match: { date: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        sales = salesData.length > 0 ? Math.round(salesData[0].total) : 0;
      } catch (err) {
        console.log(`Sales data error for ${month}:`, err.message);
      }

      try {
        // Try multiple fields
        const purchaseFields = ['totalAmount', 'total', 'grandTotal'];
        for (const field of purchaseFields) {
          try {
            const purchasesData = await Purchase.aggregate([
              { $match: { date: { $gte: start, $lte: end } } },
              { $group: { _id: null, total: { $sum: `$${field}` } } }
            ]);
            if (purchasesData.length > 0 && purchasesData[0].total > 0) {
              purchases = Math.round(purchasesData[0].total);
              break;
            }
          } catch (err) {
            continue;
          }
        }
      } catch (err) {
        console.log(`Purchases data error for ${month}:`, err.message);
      }

      return { month, sales, purchases };
    }));

    res.json(trendsData);
  } catch (error) {
    console.error('Sales trends error:', error);
    res.status(500).json({ message: 'Error fetching sales trends', error: error.message });
  }
});

// Top Selling Products
router.get('/top-products', async (req, res) => {
  try {
    const saleCount = await Sale.countDocuments();
    if (saleCount === 0) {
      return res.json([]);
    }

    const sampleSale = await Sale.findOne();
    let topProducts = [];

    // Your model uses 'products' array with different structure
    if (sampleSale && sampleSale.products && Array.isArray(sampleSale.products)) {
      topProducts = await Sale.aggregate([
        { $unwind: '$products' },
        {
          $group: {
            _id: '$products.name',
            quantity: { $sum: '$products.quantity' },
            revenue: { 
              $sum: { 
                $multiply: [
                  '$products.quantity', 
                  { $subtract: ['$products.unitPrice', { $multiply: ['$products.unitPrice', { $divide: [{ $ifNull: ['$products.discount', 0] }, 100] }] }] }
                ] 
              } 
            }
          }
        },
        { $sort: { quantity: -1 } },
        { $limit: 10 },
        {
          $project: {
            name: '$_id',
            quantity: 1,
            revenue: { $round: ['$revenue', 2] }
          }
        }
      ]);
    }

    res.json(topProducts);
  } catch (error) {
    console.error('Top products error:', error);
    res.json([]);
  }
});

// Category Distribution Route

router.get('/category-distribution', async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find();

    const distribution = await Promise.all(
      categories.map(async (category) => {
        // Match category by NAME (since your products use string names)
        const products = await Product.find({ category: category.name });

        // Calculate total stock value (purchasePrice * quantity)
        const totalValue = products.reduce((sum, p) => {
          const price = p.sellingPrice || p.purchasePrice || 0;
          const qty = p.quantity || 0;
          return sum + price * qty;
        }, 0);

        return { name: category.name, value: totalValue };
      })
    );

    console.log("Sales by Category Distribution:", distribution);
    res.json(distribution);
  } catch (error) {
    console.error("Error fetching category distribution:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Monthly Summary (Revenue vs Expenses)
router.get('/monthly-summary', async (req, res) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      
      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        start,
        end
      });
    }

    const summaryData = await Promise.all(months.map(async ({ month, start, end }) => {
      let revenue = 0;
      let expenses = 0;

      try {
        const revenueData = await Sale.aggregate([
          { $match: { date: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        revenue = revenueData.length > 0 ? Math.round(revenueData[0].total) : 0;
      } catch (err) {
        console.log(`Revenue error for ${month}`);
      }

      try {
        const expensesData = await Expense.aggregate([
          { $match: { date: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        expenses = expensesData.length > 0 ? expensesData[0].total : 0;

        // Try multiple fields for purchases
        const purchaseFields = ['totalAmount', 'total', 'grandTotal'];
        for (const field of purchaseFields) {
          try {
            const purchaseExpenses = await Purchase.aggregate([
              { $match: { date: { $gte: start, $lte: end } } },
              { $group: { _id: null, total: { $sum: `$${field}` } } }
            ]);
            if (purchaseExpenses.length > 0 && purchaseExpenses[0].total > 0) {
              expenses += purchaseExpenses[0].total;
              break;
            }
          } catch (err) {
            continue;
          }
        }
        
        expenses = Math.round(expenses);
      } catch (err) {
        console.log(`Expenses error for ${month}`);
      }

      return { month, revenue, expenses };
    }));

    res.json(summaryData);
  } catch (error) {
    console.error('Monthly summary error:', error);
    res.json([]);
  }
});

// Low Stock Alert
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      stock: { $lte: 10 }
    })
    .select('name stock reorderLevel')
    .sort({ stock: 1 })
    .limit(10);

    res.json(lowStockProducts);
  } catch (error) {
    console.error('Low stock error:', error);
    res.json([]);
  }
});

// Sales Performance by Customer
router.get('/customer-performance', async (req, res) => {
  try {
    const saleCount = await Sale.countDocuments();
    if (saleCount === 0) {
      return res.json([]);
    }

    // Using customerName field instead of customer reference
    const customerPerformance = await Sale.aggregate([
      { $match: { customerName: { $ne: '' } } },
      {
        $group: {
          _id: '$customerName',
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: '$_id',
          email: 'N/A',
          totalSales: { $round: ['$totalSales', 2] },
          orderCount: 1,
          averageOrder: { $round: [{ $divide: ['$totalSales', '$orderCount'] }, 2] }
        }
      }
    ]);

    res.json(customerPerformance);
  } catch (error) {
    console.error('Customer performance error:', error);
    res.json([]);
  }
});

// Inventory Value
router.get('/inventory-value', async (req, res) => {
  try {
    const sampleProduct = await Product.findOne();
    const priceFields = ['price', 'sellingPrice', 'salePrice', 'unitPrice'];
    let priceField = 'price';

    for (const field of priceFields) {
      if (sampleProduct && sampleProduct[field] !== undefined) {
        priceField = field;
        break;
      }
    }

    const inventoryValue = await Product.aggregate([
      {
        $project: {
          name: 1,
          stock: 1,
          price: `$${priceField}`,
          value: { 
            $multiply: [
              { $ifNull: ['$stock', 0] }, 
              { $ifNull: [`$${priceField}`, 0] }
            ] 
          }
        }
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$value' },
          totalItems: { $sum: '$stock' },
          productCount: { $sum: 1 }
        }
      }
    ]);

    const value = inventoryValue.length > 0 ? inventoryValue[0] : {
      totalValue: 0,
      totalItems: 0,
      productCount: 0
    };

    res.json({
      totalValue: Math.round(value.totalValue * 100) / 100,
      totalItems: value.totalItems || 0,
      productCount: value.productCount || 0
    });
  } catch (error) {
    console.error('Inventory value error:', error);
    res.json({ totalValue: 0, totalItems: 0, productCount: 0 });
  }
});

// Payment Method Distribution
router.get('/payment-methods', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const paymentData = await Sale.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: '$paymentMode',
          count: { $sum: 1 },
          total: { $sum: '$totalAmount' }
        }
      },
      {
        $project: {
          method: { $ifNull: ['$_id', 'Cash'] },
          count: 1,
          total: { $round: ['$total', 2] }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(paymentData);
  } catch (error) {
    console.error('Payment methods error:', error);
    res.json([]);
  }
});

// Recent Transactions
router.get('/recent-transactions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const recentSales = await Sale.find()
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    const transactions = recentSales.map(sale => ({
      date: sale.date,
      type: 'sale',
      customer: sale.customerName || 'Walk-in Customer',
      amount: sale.totalAmount,
      status: ['completed', 'partial'].includes(sale.paymentStatus) ? sale.paymentStatus : 'pending'
    // status: sale.paymentStatus === 'true' || sale.paymentStatus === true ? 'completed' : 'pending'
    }));

    res.json(transactions);
  } catch (error) {
    console.error('Recent transactions error:', error);
    res.json([]);
  }
});

module.exports = router;