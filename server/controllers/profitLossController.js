// // controllers/profitLossController.js
// const Ledger = require("../models/Ledger");
// const AllLedger = require("../models/AllLedger");

// exports.getProfitLoss = async (req, res) => {
//   try {
//     const { fromDate, toDate, branch, costCenter, period, reportType, currency } = req.query;
    
//     console.log("Fetching P&L with params:", { fromDate, toDate });

//     // Build date filter
//     let dateFilter = {};
//     if (fromDate && toDate) {
//       dateFilter = {
//         date: {
//           $gte: new Date(fromDate),
//           $lte: new Date(toDate)
//         }
//       };
//     }

//     // Get all ledger transactions within date range
//     const transactions = await Ledger.find(dateFilter).lean();

//     // Get all ledger accounts with their types
//     const allLedgers = await AllLedger.find().lean();
    
//     // Create a map of account names to their account info
//     const accountInfoMap = {};
//     allLedgers.forEach(ledger => {
//       accountInfoMap[ledger.accountName] = {
//         accountType: ledger.accountType,
//         group: ledger.group,
//         openingBalance: ledger.openingBalance,
//         balanceType: ledger.balanceType
//       };
//     });

//     // Group transactions by account name
//     const accountSummary = {};
    
//     transactions.forEach(txn => {
//       if (!accountSummary[txn.account_name]) {
//         accountSummary[txn.account_name] = {
//           debit: 0,
//           credit: 0,
//           transactions: []
//         };
//       }
//       accountSummary[txn.account_name].debit += txn.debit || 0;
//       accountSummary[txn.account_name].credit += txn.credit || 0;
//       accountSummary[txn.account_name].transactions.push(txn);
//     });

//     // Initialize revenue and expense arrays
//     let revenues = [];
//     let expenses = [];
//     let totalRevenue = 0;
//     let totalExpenses = 0;

//     // Categorize accounts into revenue and expenses
//     Object.keys(accountSummary).forEach(accountName => {
//       const account = accountSummary[accountName];
//       const accountInfo = accountInfoMap[accountName];
      
//       if (!accountInfo) return; // Skip if account not found in AllLedger

//       const netAmount = Math.abs(account.credit - account.debit);

//       // INCOME/REVENUE ACCOUNTS
//       if (accountInfo.accountType === 'Income') {
//         const revenueAmount = account.credit - account.debit; // Income has credit balance
//         totalRevenue += revenueAmount;
        
//         revenues.push({
//           name: accountName,
//           current: revenueAmount,
//           previous: revenueAmount * 0.88, // Mock: 88% of current for previous period
//           variance: 13.6 // Mock variance %
//         });
//       }
      
//       // EXPENSE ACCOUNTS
//       else if (accountInfo.accountType === 'Expense') {
//         const expenseAmount = account.debit - account.credit; // Expense has debit balance
//         totalExpenses += expenseAmount;
        
//         expenses.push({
//           name: accountName,
//           current: expenseAmount,
//           previous: expenseAmount * 0.93, // Mock: 93% of current for previous period
//           variance: 7.5 // Mock variance %
//         });
//       }
//     });

//     // Calculate previous period totals (mock - you can implement actual previous period query)
//     const previousRevenue = totalRevenue * 0.88;
//     const previousExpenses = totalExpenses * 0.93;

//     // Calculate profits
//     const grossProfit = totalRevenue - totalExpenses;
//     const previousGrossProfit = previousRevenue - previousExpenses;
//     const netProfit = grossProfit; // In basic P&L, net profit = gross profit
//     const previousNetProfit = previousGrossProfit;

//     // Calculate growth percentages
//     const revenueGrowth = previousRevenue > 0 
//       ? ((totalRevenue - previousRevenue) / previousRevenue * 100) 
//       : 0;
    
//     const expenseGrowth = previousExpenses > 0 
//       ? ((totalExpenses - previousExpenses) / previousExpenses * 100) 
//       : 0;
    
//     const grossProfitGrowth = previousGrossProfit > 0 
//       ? ((grossProfit - previousGrossProfit) / Math.abs(previousGrossProfit) * 100) 
//       : 0;
    
//     const netProfitGrowth = previousNetProfit > 0 
//       ? ((netProfit - previousNetProfit) / Math.abs(previousNetProfit) * 100) 
//       : 0;

//     // Calculate margins
//     const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue * 100) : 0;
//     const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue * 100) : 0;

//     // Format period dates
//     const formatDate = (dateString) => {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
//     };

//     const periodText = fromDate && toDate ? `${formatDate(fromDate)} to ${formatDate(toDate)}` : 'All Time';

//     // Prepare response
//     const data = {
//       totalRevenue: Math.round(totalRevenue * 100) / 100,
//       totalExpenses: Math.round(totalExpenses * 100) / 100,
//       grossProfit: Math.round(grossProfit * 100) / 100,
//       netProfit: Math.round(netProfit * 100) / 100,
//       revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
//       expenseGrowth: parseFloat(expenseGrowth.toFixed(1)),
//       grossProfitGrowth: parseFloat(grossProfitGrowth.toFixed(1)),
//       netProfitGrowth: parseFloat(netProfitGrowth.toFixed(1)),
//       operatingRevenue: Math.round(totalRevenue * 100) / 100,
//       operatingExpenses: Math.round(totalExpenses * 100) / 100,
//       grossMargin: parseFloat(grossMargin.toFixed(1)),
//       netMargin: parseFloat(netMargin.toFixed(1)),
//       revenues: revenues.map(r => ({
//         ...r,
//         current: Math.round(r.current * 100) / 100,
//         previous: Math.round(r.previous * 100) / 100,
//         variance: parseFloat(r.variance.toFixed(1))
//       })),
//       expenses: expenses.map(e => ({
//         ...e,
//         current: Math.round(e.current * 100) / 100,
//         previous: Math.round(e.previous * 100) / 100,
//         variance: parseFloat(e.variance.toFixed(1))
//       })),
//       period: periodText,
//       fromDate: fromDate,
//       toDate: toDate
//     };

//     res.status(200).json({
//       success: true,
//       message: "Profit & Loss statement retrieved successfully",
//       data: data
//     });

//   } catch (error) {
//     console.error("Error fetching profit & loss:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error retrieving profit & loss statement",
//       error: error.message
//     });
//   }
// };

// controllers/profitLossController.js
const Ledger = require("../models/Ledger");
const AllLedger = require("../models/AllLedger");

exports.getProfitLoss = async (req, res) => {
  try {
    const { fromDate, toDate, branch, costCenter, period, reportType, currency } = req.query;
    
    console.log("Fetching P&L with params:", { fromDate, toDate });

    // Build date filter
    let dateFilter = {};
    if (fromDate && toDate) {
      dateFilter = {
        date: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate)
        }
      };
    }

    // Get all ledger transactions within date range
    const transactions = await Ledger.find(dateFilter).lean();
    console.log(`Found ${transactions.length} transactions`);

    // Get all ledger accounts with their types
    const allLedgers = await AllLedger.find().lean();
    console.log(`Found ${allLedgers.length} ledger accounts`);
    
    // Create a map of account names to their account info
    const accountInfoMap = {};
    allLedgers.forEach(ledger => {
      accountInfoMap[ledger.accountName] = {
        accountType: ledger.accountType,
        group: ledger.group,
        openingBalance: ledger.openingBalance,
        balanceType: ledger.balanceType
      };
    });

    // Group transactions by account name
    const accountSummary = {};
    
    transactions.forEach(txn => {
      if (!accountSummary[txn.account_name]) {
        accountSummary[txn.account_name] = {
          debit: 0,
          credit: 0,
          transactions: []
        };
      }
      accountSummary[txn.account_name].debit += txn.debit || 0;
      accountSummary[txn.account_name].credit += txn.credit || 0;
      accountSummary[txn.account_name].transactions.push(txn);
    });

    console.log('Account Summary:', accountSummary);

    // Initialize revenue and expense arrays
    let revenues = [];
    let expenses = [];
    let totalRevenue = 0;
    let totalExpenses = 0;

    // Categorize accounts into revenue and expenses
    Object.keys(accountSummary).forEach(accountName => {
      const account = accountSummary[accountName];
      const accountInfo = accountInfoMap[accountName];
      
      console.log(`Processing account: ${accountName}, Type: ${accountInfo?.accountType}, Debit: ${account.debit}, Credit: ${account.credit}`);
      
      // Calculate net amount
      const netDebit = account.debit;
      const netCredit = account.credit;
      const netAmount = netCredit - netDebit;

      // INCOME/REVENUE ACCOUNTS
      // Income accounts typically have Credit balance (Credit > Debit)
      if (accountInfo && accountInfo.accountType === 'Income') {
        const revenueAmount = netCredit - netDebit;
        totalRevenue += revenueAmount;
        
        revenues.push({
          name: accountName,
          current: revenueAmount,
          previous: revenueAmount * 0.88,
          variance: 13.6
        });
      }
      // EXPENSE ACCOUNTS
      // Expense accounts typically have Debit balance (Debit > Credit)
      else if (accountInfo && accountInfo.accountType === 'Expense') {
        const expenseAmount = netDebit - netCredit;
        totalExpenses += expenseAmount;
        
        expenses.push({
          name: accountName,
          current: expenseAmount,
          previous: expenseAmount * 0.93,
          variance: 7.5
        });
      }
      // For accounts without proper type, try to categorize by transaction pattern
      else {
        // If credit > debit, likely income/revenue
        if (netCredit > netDebit) {
          const revenueAmount = netCredit - netDebit;
          totalRevenue += revenueAmount;
          
          revenues.push({
            name: accountName,
            current: revenueAmount,
            previous: revenueAmount * 0.88,
            variance: 13.6
          });
          console.log(`Categorized ${accountName} as REVENUE (Credit > Debit)`);
        }
        // If debit > credit, likely expense
        else if (netDebit > netCredit) {
          const expenseAmount = netDebit - netCredit;
          totalExpenses += expenseAmount;
          
          expenses.push({
            name: accountName,
            current: expenseAmount,
            previous: expenseAmount * 0.93,
            variance: 7.5
          });
          console.log(`Categorized ${accountName} as EXPENSE (Debit > Credit)`);
        }
      }
    });

    console.log(`Total Revenue: ${totalRevenue}, Total Expenses: ${totalExpenses}`);

    // Calculate previous period totals (mock - 88% and 93% of current)
    const previousRevenue = totalRevenue * 0.88;
    const previousExpenses = totalExpenses * 0.93;

    // Calculate profits
    const grossProfit = totalRevenue - totalExpenses;
    const previousGrossProfit = previousRevenue - previousExpenses;
    const netProfit = grossProfit;
    const previousNetProfit = previousGrossProfit;

    // Calculate growth percentages
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / Math.abs(previousRevenue) * 100) 
      : 0;
    
    const expenseGrowth = previousExpenses > 0 
      ? ((totalExpenses - previousExpenses) / Math.abs(previousExpenses) * 100) 
      : 0;
    
    const grossProfitGrowth = previousGrossProfit !== 0
      ? ((grossProfit - previousGrossProfit) / Math.abs(previousGrossProfit) * 100) 
      : 0;
    
    const netProfitGrowth = previousNetProfit !== 0
      ? ((netProfit - previousNetProfit) / Math.abs(previousNetProfit) * 100) 
      : 0;

    // Calculate margins
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue * 100) : 0;
    const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue * 100) : 0;

    // Format period dates
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const periodText = fromDate && toDate ? `${formatDate(fromDate)} to ${formatDate(toDate)}` : 'All Time';

    // Prepare response
    const data = {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      grossProfit: Math.round(grossProfit * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
      expenseGrowth: parseFloat(expenseGrowth.toFixed(1)),
      grossProfitGrowth: parseFloat(grossProfitGrowth.toFixed(1)),
      netProfitGrowth: parseFloat(netProfitGrowth.toFixed(1)),
      operatingRevenue: Math.round(totalRevenue * 100) / 100,
      operatingExpenses: Math.round(totalExpenses * 100) / 100,
      grossMargin: parseFloat(grossMargin.toFixed(1)),
      netMargin: parseFloat(netMargin.toFixed(1)),
      revenues: revenues.map(r => ({
        ...r,
        current: Math.round(r.current * 100) / 100,
        previous: Math.round(r.previous * 100) / 100,
        variance: parseFloat(r.variance.toFixed(1))
      })),
      expenses: expenses.map(e => ({
        ...e,
        current: Math.round(e.current * 100) / 100,
        previous: Math.round(e.previous * 100) / 100,
        variance: parseFloat(e.variance.toFixed(1))
      })),
      period: periodText,
      fromDate: fromDate,
      toDate: toDate
    };

    console.log('Final P&L Data:', JSON.stringify(data, null, 2));

    res.status(200).json({
      success: true,
      message: "Profit & Loss statement retrieved successfully",
      data: data
    });

  } catch (error) {
    console.error("Error fetching profit & loss:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving profit & loss statement",
      error: error.message
    });
  }
};