// // const Ledger = require("../models/Ledger");

// // exports.getTrialBalance = async (req, res) => {
// //   try {
// //     console.log("📘 Generating Trial Balance...");
// //     const { viewType } = req.query;

// //     // ✅ Fetch all ledger entries
// //     const ledgers = await Ledger.find();

// //     if (!ledgers.length) {
// //       return res.status(200).json({
// //         message: "No ledger entries found",
// //         trialBalance: []
// //       });
// //     }

// //     // ✅ Group by account_name
// //     const accounts = {};

// //     ledgers.forEach(entry => {
// //       if (!accounts[entry.account_name]) {
// //         accounts[entry.account_name] = {
// //           account_name: entry.account_name,
// //           debit: 0,
// //           credit: 0,
// //           ledgerEntries: []  // ✅ will contain narration also
// //         };
// //       }

// //       accounts[entry.account_name].debit += Number(entry.debit || 0);
// //       accounts[entry.account_name].credit += Number(entry.credit || 0);

// //       accounts[entry.account_name].ledgerEntries.push({
// //         date: entry.date,
// //         voucher_no: entry.voucher_no,
// //         debit: entry.debit,
// //         credit: entry.credit,
// //         narration: entry.narration,  // ✅ narration included!
// //         reference_type: entry.reference_type
// //       });
// //     });

// //     const trialBalance = Object.values(accounts).map(acc => ({
// //       account_name: acc.account_name,
// //       debit: acc.debit,
// //       credit: acc.credit,
// //       balance: acc.debit - acc.credit,
// //       ledger: acc.ledgerEntries
// //     }));

// //     res.status(200).json({
// //       message: "✅ Trial Balance Generated Successfully",
// //       trialBalance
// //     });

// //   } catch (error) {
// //     console.error("❌ Trial Balance Error:", error);
// //     res.status(500).json({ message: "Error generating trial balance", error });
// //   }
// // };


// const Ledger = require("../models/Ledger");

// exports.getTrialBalance = async (req, res) => {
//   try {
//     console.log("📘 Generating Trial Balance...");

//     const { viewType } = req.query; // 👈 Get from frontend (ledger-wise / group-wise / detailed)
//     const ledgers = await Ledger.find();

//     if (!ledgers.length) {
//       return res.status(200).json({
//         message: "No ledger entries found",
//         trialBalance: [],
//       });
//     }

//     // ========== 📊 VIEW TYPE: LEDGER-WISE ==========
//     if (viewType === "ledger-wise") {
//       const accounts = {};

//       ledgers.forEach((entry) => {
//         if (!accounts[entry.account_name]) {
//           accounts[entry.account_name] = {
//             account_name: entry.account_name,
//             debit: 0,
//             credit: 0,
//             ledgerEntries: [],
//           };
//         }

//         accounts[entry.account_name].debit += Number(entry.debit || 0);
//         accounts[entry.account_name].credit += Number(entry.credit || 0);

//         accounts[entry.account_name].ledgerEntries.push({
//           date: entry.date,
//           voucher_no: entry.voucher_no,
//           debit: entry.debit,
//           credit: entry.credit,
//           narration: entry.narration,
//           reference_type: entry.reference_type,
//         });
//       });

//       const trialBalance = Object.values(accounts).map((acc) => ({
//         account_name: acc.account_name,
//         debit: acc.debit,
//         credit: acc.credit,
//         balance: acc.debit - acc.credit,
//         ledger: acc.ledgerEntries,
//       }));

//       return res.status(200).json({
//         message: "✅ Ledger-wise Trial Balance Generated",
//         trialBalance,
//       });
//     }

//     // ========== 📚 VIEW TYPE: GROUP-WISE ==========
//     if (viewType === "group-wise") {
//       const groups = {};

//       ledgers.forEach((entry) => {
//         const group = entry.group || "Others";

//         if (!groups[group]) {
//           groups[group] = {
//             group,
//             totalDebit: 0,
//             totalCredit: 0,
//             ledgers: [],
//           };
//         }

//         groups[group].totalDebit += Number(entry.debit || 0);
//         groups[group].totalCredit += Number(entry.credit || 0);

//         groups[group].ledgers.push({
//           account_name: entry.account_name,
//           debit: entry.debit,
//           credit: entry.credit,
//           narration: entry.narration,
//           balanceType: entry.balanceType,
//         });
//       });

//       return res.status(200).json({
//         message: "✅ Group-wise Trial Balance Generated",
//         trialBalance: Object.values(groups),
//       });
//     }

//     // ========== 🔍 VIEW TYPE: DETAILED VIEW ==========
//     if (viewType === "detailed") {
//       return res.status(200).json({
//         message: "✅ Detailed Trial Balance Generated",
//         trialBalance: ledgers,
//       });
//     }

//     // ========== DEFAULT ==========
//     res.status(200).json({
//       message: "✅ Default Trial Balance Generated",
//       trialBalance: ledgers,
//     });

//   } catch (error) {
//     console.error("❌ Trial Balance Error:", error);
//     res.status(500).json({ message: "Error generating trial balance", error });
//   }
// };

const Ledger = require("../models/Ledger");
const AllLedger = require("../models/AllLedger");

exports.getTrialBalance = async (req, res) => {
  try {
    console.log("📘 Generating Trial Balance...");
    console.log("🔍 Query params:", req.query);

    const { viewType } = req.query;
    const viewTypeLower = viewType ? viewType.toLowerCase() : "";
    
    const ledgers = await Ledger.find();

    if (!ledgers.length) {
      return res.status(200).json({
        message: "No ledger entries found",
        trialBalance: [],
      });
    }

    // ========== 📊 VIEW TYPE: LEDGER-WISE ==========
    if (viewTypeLower === "ledger-wise") {
      console.log("📊 Processing Ledger-wise view");
      const accounts = {};

      ledgers.forEach((entry) => {
        if (!accounts[entry.account_name]) {
          accounts[entry.account_name] = {
            account_name: entry.account_name,
            debit: 0,
            credit: 0,
            ledgerEntries: [],
          };
        }

        accounts[entry.account_name].debit += Number(entry.debit || 0);
        accounts[entry.account_name].credit += Number(entry.credit || 0);

        accounts[entry.account_name].ledgerEntries.push({
          date: entry.date,
          voucher_no: entry.voucher_no,
          debit: entry.debit,
          credit: entry.credit,
          narration: entry.narration,
          reference_type: entry.reference_type,
        });
      });

      const trialBalance = Object.values(accounts).map((acc) => ({
        account_name: acc.account_name,
        debit: acc.debit,
        credit: acc.credit,
        balance: acc.debit - acc.credit,
        nature: acc.debit - acc.credit >= 0 ? "Dr" : "Cr",
        ledger: acc.ledgerEntries,
      }));

      return res.status(200).json({
        message: "✅ Ledger-wise Trial Balance Generated",
        trialBalance,
      });
    }

    // ========== 📚 VIEW TYPE: GROUP-WISE ==========
    if (viewTypeLower === "group-wise") {
      console.log("📚 Processing Group-wise view");

      // Fetch all accounts from AllLedger
      const allAccounts = await AllLedger.find();
      console.log("📋 Total accounts in AllLedger:", allAccounts.length);

      // Create a map of account name to account info
      const accountMap = new Map();
      allAccounts.forEach(acc => {
        accountMap.set(acc.accountName, acc);
      });

      // Helper function to determine group
      const getAccountGroup = (accountName) => {
        const account = accountMap.get(accountName);
        
        if (account && account.group && account.group !== "") {
          return account.group;
        }

        // Auto-assign based on account name or type
        const nameLower = accountName.toLowerCase();
        let group = "";

        if (account) {
          if (nameLower.includes("bank")) {
            group = "Bank";
          } else if (nameLower.includes("cash")) {
            group = "Cash";
          } else if (nameLower.includes("purchase")) {
            group = "Direct Expense";
          } else if (nameLower.includes("sales") || nameLower.includes("sale")) {
            group = "Direct Income";
          } else if (nameLower.includes("supplier") || nameLower.includes("creditor") || nameLower.includes("trading")) {
            group = "Supplier";
          } else if (nameLower.includes("customer") || nameLower.includes("debtor")) {
            group = "Customer";
          } else if (account.accountType === "Asset") {
            group = "Current Asset";
          } else if (account.accountType === "Liability") {
            group = "Current Liability";
          } else if (account.accountType === "Expense") {
            group = "Indirect Expense";
          } else if (account.accountType === "Income") {
            group = "Indirect Income";
          } else if (account.accountType === "Equity") {
            group = "Capital";
          }
        } else {
          if (nameLower.includes("bank")) group = "Bank";
          else if (nameLower.includes("cash")) group = "Cash";
          else if (nameLower.includes("purchase")) group = "Direct Expense";
          else if (nameLower.includes("sales") || nameLower.includes("sale")) group = "Direct Income";
          else if (nameLower.includes("supplier") || nameLower.includes("creditor") || nameLower.includes("trading")) group = "Supplier";
          else if (nameLower.includes("customer") || nameLower.includes("debtor")) group = "Customer";
        }

        return group || "Other Accounts";
      };

      // 👇 GROUP LEDGER ENTRIES BY ACCOUNT FIRST
      const accounts = {};
      
      ledgers.forEach((entry) => {
        if (!accounts[entry.account_name]) {
          accounts[entry.account_name] = {
            account_name: entry.account_name,
            debit: 0,
            credit: 0,
            group: getAccountGroup(entry.account_name),
          };
        }

        accounts[entry.account_name].debit += Number(entry.debit || 0);
        accounts[entry.account_name].credit += Number(entry.credit || 0);
      });

      // 👇 CONVERT TO FLAT ARRAY WITH GROUP INFO (Frontend expects this format)
      const trialBalance = Object.values(accounts).map((acc) => ({
        account_name: acc.account_name,
        debit: acc.debit,
        credit: acc.credit,
        balance: acc.debit - acc.credit,
        nature: acc.debit - acc.credit >= 0 ? "Dr" : "Cr",
        group: acc.group,  // 👈 Frontend needs this for grouping
        account_group: acc.group,  // 👈 Alternative field name
      }));

      console.log("✅ Group-wise trial balance generated with", trialBalance.length, "accounts");

      return res.status(200).json({
        message: "✅ Group-wise Trial Balance Generated",
        trialBalance,
      });
    }

    // ========== 🔍 VIEW TYPE: DETAILED VIEW ==========
    if (viewTypeLower === "detailed") {
      console.log("🔍 Processing Detailed view");
      return res.status(200).json({
        message: "✅ Detailed Trial Balance Generated",
        trialBalance: ledgers,
      });
    }

    // ========== DEFAULT ==========
    console.log("📄 Processing Default view");
    const accounts = {};

    ledgers.forEach((entry) => {
      if (!accounts[entry.account_name]) {
        accounts[entry.account_name] = {
          account_name: entry.account_name,
          debit: 0,
          credit: 0,
        };
      }

      accounts[entry.account_name].debit += Number(entry.debit || 0);
      accounts[entry.account_name].credit += Number(entry.credit || 0);
    });

    const trialBalance = Object.values(accounts).map((acc) => ({
      account_name: acc.account_name,
      debit: acc.debit,
      credit: acc.credit,
      balance: acc.debit - acc.credit,
      nature: acc.debit - acc.credit >= 0 ? "Dr" : "Cr",
    }));

    res.status(200).json({
      message: "✅ Default Trial Balance Generated",
      trialBalance,
    });

  } catch (error) {
    console.error("❌ Trial Balance Error:", error);
    res.status(500).json({ message: "Error generating trial balance", error });
  }
};