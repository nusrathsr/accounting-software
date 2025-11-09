const Ledger = require("../models/Ledger");

exports.getTrialBalance = async (req, res) => {
  try {
    console.log("📘 Generating Trial Balance...");

    // ✅ Fetch all ledger entries
    const ledgers = await Ledger.find();

    if (!ledgers.length) {
      return res.status(200).json({
        message: "No ledger entries found",
        trialBalance: []
      });
    }

    // ✅ Group by account_name
    const accounts = {};

    ledgers.forEach(entry => {
      if (!accounts[entry.account_name]) {
        accounts[entry.account_name] = {
          account_name: entry.account_name,
          debit: 0,
          credit: 0,
          ledgerEntries: []  // ✅ will contain narration also
        };
      }

      accounts[entry.account_name].debit += Number(entry.debit || 0);
      accounts[entry.account_name].credit += Number(entry.credit || 0);

      accounts[entry.account_name].ledgerEntries.push({
        date: entry.date,
        voucher_no: entry.voucher_no,
        debit: entry.debit,
        credit: entry.credit,
        narration: entry.narration,  // ✅ narration included!
        reference_type: entry.reference_type
      });
    });

    const trialBalance = Object.values(accounts).map(acc => ({
      account_name: acc.account_name,
      debit: acc.debit,
      credit: acc.credit,
      balance: acc.debit - acc.credit,
      ledger: acc.ledgerEntries
    }));

    res.status(200).json({
      message: "✅ Trial Balance Generated Successfully",
      trialBalance
    });

  } catch (error) {
    console.error("❌ Trial Balance Error:", error);
    res.status(500).json({ message: "Error generating trial balance", error });
  }
};
