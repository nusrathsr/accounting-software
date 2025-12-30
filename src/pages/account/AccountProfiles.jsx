import React, { useEffect, useState } from "react";
import api from "../../utils/api";

// React Icons
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// SweetAlert2
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const AccountProfile = () => {
  const [form, setForm] = useState(false);
  const [ledgerAccount, setLedgerAccount] = useState([]);
  const [ledgerTransactions, setLedgerTransactions] = useState([]);
  const [accountProfiles, setAccountProfiles] = useState([]);

  const [formData, setFormData] = useState({
    accountId: "",
    accountName: "",
    accountType: "",
    status: "",
    contact: {
      contactPerson: "",
      mobileNo: "",
      Email: "",
      whatsAppNo: "",
      remarks: "",
    },
    address: {
      street: "",
      locality: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
    },

    openingBalance: "",
    creditLimit: "",
    paymentTerms: "Cash",
    gstin: "",
    pan: "",

    totalSales: 0,
    totalPurchase: 0,
    outstandingBalance: 0,
    lastTransactionDate: "",
  });

  // ============================ FETCH ACCOUNT PROFILES ============================
  const fetchAccountProfiles = async () => {
    try {
      const res = await api.get("/accountProfile");
      setAccountProfiles(res.data);
    } catch (error) {
      console.log("error fetching account profiles", error);
    }
  };

  // ============================ FETCH LEDGER TRANSACTIONS ============================
  const fetchLedgerTransactions = async () => {
    try {
      const res = await api.get("/ledger");
      setLedgerTransactions(res.data);
       console.log(res.data);
       
console.log(ledgerTransactions);
      
    } catch (error) {
      console.log("Error fetching ledger transactions", error);
    }
  };

  // ============================ FETCH LEDGER ACCOUNTS ============================
  const fetchLedgerAccount = async () => {
    try {
      const res = await api.get("/allLedger");
      setLedgerAccount(res.data.data);
    } catch (error) {
      console.log("Error fetching ledger accounts", error);
    }
  };

  useEffect(() => {
    fetchLedgerAccount();
    fetchLedgerTransactions();
    fetchAccountProfiles();
  }, []);

  // ============================ HANDLE FORM CHANGE ============================
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      return;
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
      return;
    }

    if (name === "accountName") {
      const selected = ledgerAccount.find((acc) => acc.accountName === value);

      setFormData((prev) => ({
        ...prev,
        accountName: value,
        accountId: selected ? selected.ledgerId : "",
        accountType: selected ? selected.accountType : "",
        openingBalance: selected ? selected.openingBalance : "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
console.log(ledgerTransactions);

  // ============================ AUTO CALCULATE SUMMARY ============================
useEffect(() => {
  if (!formData.accountName || !Array.isArray(ledgerTransactions)) return;

  const txns = ledgerTransactions.filter(
    (t) =>
      (t?.account_name || "").toLowerCase().trim() ===
      formData.accountName.toLowerCase().trim()
  );

  
  
  // ------ If no transactions ------
  if (txns.length === 0) {
    const opening =
      formData.balanceType === "Credit"
        ? -Math.abs(Number(formData.openingBalance))
        : Math.abs(Number(formData.openingBalance));

    setFormData((prev) => ({
      ...prev,
      totalSales: 0,
      totalPurchase: 0,
      outstandingBalance: opening,
      lastTransactionDate: "",
    }));
    return;
  }

  // ------ SUM debit/credit ------
  const totalCredit = txns.reduce((sum, t) => sum + Number(t.credit || 0), 0);
  const totalDebit = txns.reduce((sum, t) => sum + Number(t.debit || 0), 0);

  // ------ Get ledger account details ------
  const ledgerAcc = ledgerAccount.find(
    (acc) => acc.accountName === formData.accountName
  );

  const accType = ledgerAcc?.accountType || ""; // Income / Expense / Asset / Liability
  const group = ledgerAcc?.group || ""; // Customer / Supplier etc.

  // ------ Opening Balance Logic ------
  const opening =
    ledgerAcc?.balanceType === "Credit"
      ? -Math.abs(Number(ledgerAcc.openingBalance))
      : Math.abs(Number(ledgerAcc.openingBalance));

  let outstanding = 0;

  // ---------------------------------------------------
  // CUSTOMER → Sales = Credit, Payments = Debit
  // outstanding = opening + credit - debit
  // ---------------------------------------------------
  if (group === "Customer") {
    outstanding = opening + totalCredit - totalDebit;
  }

  // ---------------------------------------------------
  // SUPPLIER → Purchase = Debit, Payments = Credit
  // outstanding = opening + debit - credit
  // ---------------------------------------------------
  else if (group === "Supplier") {
    outstanding = opening + totalDebit - totalCredit;
  }

  // ---------------------------------------------------
  // INCOME ACCOUNT → Credit increases
  // ---------------------------------------------------
  else if (accType === "Income") {
    outstanding = opening - totalCredit + totalDebit;
  }

  // ---------------------------------------------------
  // EXPENSE ACCOUNT → Debit increases
  // ---------------------------------------------------
  else if (accType === "Expense") {
    outstanding = opening + totalDebit - totalCredit;
  }

  // ---------------------------------------------------
  // ASSETS → Debit increases
  // ---------------------------------------------------
  else if (accType === "Assets" || accType === "Fixed Asset") {
    outstanding = opening + totalDebit - totalCredit;
  }

  // ---------------------------------------------------
  // LIABILITY → Credit increases
  // ---------------------------------------------------
  else if (accType === "Liability") {
    outstanding = opening + totalCredit - totalDebit;
  }

  // ------ FIND LAST TRANSACTION DATE ------
  const dateList = txns
    .map((t) => new Date(t.date).getTime())
    .filter((x) => !isNaN(x));

  const lastTransactionDate =
    dateList.length > 0
      ? new Date(Math.max(...dateList)).toISOString().slice(0, 10)
      : "";

  setFormData((prev) => ({
    ...prev,
    totalSales: totalCredit,
    totalPurchase: totalDebit,
    outstandingBalance: outstanding,
    lastTransactionDate,
  }));
}, [formData.accountName, ledgerTransactions]);

  // ============================ DELETE PROFILE ============================
  const deleteProfile = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This account profile will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/accountProfile/${id}`);
          fetchAccountProfiles();

          Swal.fire("Deleted!", "Account profile removed.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete", "error");
        }
      }
    });
  };

  // ============================ SUBMIT FORM ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/accountProfile", formData);
      fetchAccountProfiles();

      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Account Profile Successfully Saved",
        timer: 1500,
        showConfirmButton: false,
      });

      setForm(false);
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* ===================== SHOW TABLE ===================== */}
      {!form && (
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="mb-3">
            <button
              onClick={() => setForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
            >
              <FaPlus /> Add New
            </button>
          </div>

          <table className="w-full border">
            <thead className="bg-gray-200 text-sm">
              <tr>
                <th className="p-2 border">Account Name</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Contact Person</th>
                <th className="p-2 border">Mobile</th>
                <th className="p-2 border">City</th>
                <th className="p-2 border">Outstanding</th>
                <th className="p-2 border">Last Txn</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {accountProfiles.map((d, i) => (
                <tr key={i} className="text-sm text-center">
                  <td className="border p-2">{d.accountName}</td>
                  <td className="border p-2">{d.accountType}</td>
                  <td className="border p-2">{d.contact?.contactPerson}</td>
                  <td className="border p-2">{d.contact?.mobileNo}</td>
                  <td className="border p-2">{d.address?.city}</td>
                  <td className="border p-2">{d.outstandingBalance}</td>
                  <td className="border p-2">{d.lastTransactionDate}</td>
                  <td className="border p-2">{d.status}</td>

                  <td className="border p-2 flex justify-center gap-3">
                    <button className="text-blue-600 text-lg">
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => deleteProfile(d._id)}
                      className="text-red-600 text-lg"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================== FORM ===================== */}
      {form && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Account Profile
          </h2>

          <form onSubmit={handleSubmit}>
            {/* BASIC DETAILS */}
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Basic Account Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Account ID</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.accountId}
                    className="w-full border px-3 py-2 rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Account Name</label>
                  <select
                    name="accountName"
                    onChange={handleChange}
                    value={formData.accountName}
                    className="w-full border px-3 py-2 rounded-lg"
                  >
                    <option value="">Select account</option>
                    {ledgerAccount.map((acc, i) => (
                      <option key={i} value={acc.accountName}>
                        {acc.accountName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Account Type</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.accountType}
                    className="w-full border px-3 py-2 rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="status"
                    onChange={handleChange}
                    value={formData.status}
                    className="w-full border px-3 py-2 rounded-lg"
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="contact.contactPerson"
                  value={formData.contact.contactPerson}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder="Contact Person"
                />

                <input
                  type="text"
                  name="contact.mobileNo"
                  value={formData.contact.mobileNo}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder="Mobile No"
                />

                <input
                  type="email"
                  name="contact.Email"
                  value={formData.contact.Email}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder="Email"
                />

                <input
                  type="text"
                  name="contact.whatsAppNo"
                  value={formData.contact.whatsAppNo}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder="WhatsApp No"
                />

                <textarea
                  name="contact.remarks"
                  value={formData.contact.remarks}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg md:col-span-2"
                  placeholder="Remarks"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Address Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(formData.address).map((field, i) => (
                  <div key={i}>
                    <label className="text-sm font-medium capitalize">
                      {field}
                    </label>

                    <input
                      type="text"
                      name={`address.${field}`}
                      value={formData.address[field]}
                      disabled={field === "country"}
                      onChange={handleChange}
                      className={`w-full border px-3 py-2 rounded-lg ${field === "country" ? "bg-gray-100" : ""
                        }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* FINANCIAL INFO */}
            <div className="bg-white p-5 rounded-xl shadow-sm border space-y-4">
              <h3 className="text-lg font-semibold">
                Financial & Tax Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Opening Balance</label>
                  <input
                    type="text"
                    value={`₹${formData.openingBalance} ${formData.balanceType === "Credit" ? "Cr" : "Dr"}`}
                    readOnly
                    className="w-full border px-3 py-2 rounded-lg bg-gray-100"
                  />

                </div>

                <div>
                  <label className="text-sm font-medium">Credit Limit</label>
                  <input
                    type="text"
                    name="creditLimit"
                    value={formData.creditLimit}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Payment Terms</label>
                  <select
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit 15 Days">Credit 15 Days</option>
                    <option value="Credit 30 Days">Credit 30 Days</option>
                    <option value="Credit 45 Days">Credit 45 Days</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">GSTIN</label>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">PAN</label>
                  <input
                    type="text"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* ACCOUNT SUMMARY */}
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">
                Account Summary (Live Data)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border-l-4 border-green-600 bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">Total Sales</p>
                  <h2 className="text-xl font-semibold text-green-700">
                    ₹{formData.totalSales.toLocaleString()}
                  </h2>
                </div>

                <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">Total Purchases</p>
                  <h2 className="text-xl font-semibold text-red-600">
                    ₹{formData.totalPurchase.toLocaleString()}
                  </h2>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">Outstanding Balance</p>
                  <h2 className="text-xl font-semibold text-blue-700">
                    ₹{formData.outstandingBalance}
                  </h2>
                </div>

                <div className="border-l-4 border-gray-600 bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">Last Transaction Date</p>
                  <h2 className="text-xl font-semibold text-gray-700">
                    {formData.lastTransactionDate}
                  </h2>
                </div>
              </div>
            </div>

            {/* ATTACHMENTS */}
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Attachments</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="file"
                  name="uploadDocuments"
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                />

                <input
                  type="file"
                  name="profileImage"
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg shadow"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountProfile;


