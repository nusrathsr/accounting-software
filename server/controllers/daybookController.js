// controllers/daybookController.js
const Ledger = require("../models/Ledger");

// Get daybook transactions
exports.getDaybookTransactions = async (req, res) => {
  try {
    const { dateFrom, dateTo, accountName, voucherType } = req.query;
    
    // Build filter
    let filter = {};
    
    if (dateFrom && dateTo) {
      filter.date = {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo)
      };
    }
    
    if (accountName && accountName !== 'All Accounts') {
      filter.account_name = accountName;
    }
    
    if (voucherType && voucherType !== 'All Types') {
      filter.reference_type = voucherType;
    }
    
    // Get transactions
    const transactions = await Ledger.find(filter)
      .sort({ date: 1, voucher_no: 1, _id: 1 })
      .lean();
    
    // Group by voucher_no to show double entries together
    const groupedByVoucher = {};
    transactions.forEach(txn => {
      if (!groupedByVoucher[txn.voucher_no]) {
        groupedByVoucher[txn.voucher_no] = [];
      }
      groupedByVoucher[txn.voucher_no].push({
        voucher_no: txn.voucher_no,
        date: txn.date,
        type: txn.reference_type,
        account_name: txn.account_name,
        particulars: txn.particulars || '', // Contra account
        debit: txn.debit,
        credit: txn.credit,
        narration: txn.narration
      });
    });
    
    // Get opening balance if dateFrom is provided
    let openingBalance = 0;
    if (dateFrom) {
      const openingTxns = await Ledger.find({
        date: { $lt: new Date(dateFrom) }
      });
      
      openingTxns.forEach(txn => {
        openingBalance += (txn.debit - txn.credit);
      });
    }
    
    // Calculate totals
    const totals = transactions.reduce((acc, txn) => {
      acc.debit += txn.debit;
      acc.credit += txn.credit;
      return acc;
    }, { debit: 0, credit: 0 });
    
    res.status(200).json({
      success: true,
      message: "Daybook transactions retrieved successfully",
      data: {
        transactions: groupedByVoucher,
        openingBalance,
        totals,
        period: { 
          dateFrom, 
          dateTo,
          formattedPeriod: formatPeriod(dateFrom, dateTo)
        }
      }
    });
    
  } catch (error) {
    console.error('Daybook error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error retrieving daybook transactions",
      error: error.message 
    });
  }
};

// Get unique account names for filter dropdown
exports.getAccountNames = async (req, res) => {
  try {
    const accounts = await Ledger.distinct('account_name');
    res.status(200).json({ 
      success: true, 
      data: accounts.sort() 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error retrieving account names",
      error: error.message 
    });
  }
};

// Get unique voucher types for filter dropdown
exports.getVoucherTypes = async (req, res) => {
  try {
    const types = await Ledger.distinct('reference_type');
    res.status(200).json({ 
      success: true, 
      data: types.sort() 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error retrieving voucher types",
      error: error.message 
    });
  }
};

// Helper function to format period
const formatPeriod = (dateFrom, dateTo) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const from = new Date(dateFrom).toLocaleDateString('en-GB', options);
  const to = new Date(dateTo).toLocaleDateString('en-GB', options);
  return `${from} - ${to}`;
};