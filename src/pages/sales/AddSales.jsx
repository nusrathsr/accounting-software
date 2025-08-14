import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const productOptions = [
  { id: 1, name: "Product A", price: 1000 },
  { id: 2, name: "Product B", price: 2000 },
  { id: 3, name: "Product C", price: 500 },
  { id: 4, name: "Product D", price: 13599 },
  { id: 5, name: "Product E", price: 999 },
];

export default function SalesInvoiceForm() {
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `INV-${year}-${randomNum}`;
  };

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customerName: "",
    number: "",
    saleDate: new Date().toISOString().slice(0, 10),
    items: [{ productId: null, productName: "", quantity: "", unitPrice: "", tax: "" }],
  });

  // For each item, we'll track dropdown open & search term state separately
  const [dropdownState, setDropdownState] = useState(
    formData.items.map(() => ({ open: false, searchTerm: "" }))
  );

  const invoiceRef = useRef();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      invoiceNumber: generateInvoiceNumber(),
    }));
  }, []);

  // Sync dropdownState length with items length
  useEffect(() => {
    if (dropdownState.length !== formData.items.length) {
      setDropdownState(formData.items.map(() => ({ open: false, searchTerm: "" })));
    }
  }, [formData.items.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (index, product) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      productId: product.id,
      productName: product.name,
      quantity: "",
      unitPrice: String(product.price),
      tax: "",
    };
    setFormData((prev) => ({ ...prev, items: updatedItems }));

    // Close dropdown and clear search for that index
    const updatedDropdown = [...dropdownState];
    updatedDropdown[index] = { open: false, searchTerm: "" };
    setDropdownState(updatedDropdown);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: null, productName: "", quantity: "", unitPrice: "", tax: "" }],
    }));

    setDropdownState((prev) => [...prev, { open: false, searchTerm: "" }]);
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));

    const updatedDropdown = dropdownState.filter((_, i) => i !== index);
    setDropdownState(updatedDropdown);
  };

  const toggleDropdown = (index) => {
    const updatedDropdown = dropdownState.map((d, i) => {
      if (i === index) return { ...d, open: !d.open, searchTerm: "" };
      return { ...d, open: false, searchTerm: "" }; // close others
    });
    setDropdownState(updatedDropdown);
  };

  const onSearchChange = (index, value) => {
    const updatedDropdown = [...dropdownState];
    updatedDropdown[index].searchTerm = value;
    updatedDropdown[index].open = true;
    setDropdownState(updatedDropdown);

    const updatedItems = [...formData.items];
    updatedItems[index].productName = value;
    updatedItems[index].productId = null;
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const n = (v) => {
    const x = parseFloat(v);
    return isNaN(x) ? 0 : x;
  };

  const calculateSubtotal = () =>
    formData.items.reduce((sum, item) => sum + n(item.quantity) * n(item.unitPrice), 0);

  const calculateTaxTotal = () =>
    formData.items.reduce((sum, item) => {
      const line = n(item.quantity) * n(item.unitPrice);
      const taxPct = n(item.tax);
      return sum + (line * taxPct) / 100;
    }, 0);

  const calculateTotal = () => calculateSubtotal() + calculateTaxTotal();

  const handleSubmit = (e) => {
    e.preventDefault();

    const salesRecord = {
      ...formData,
      subtotal: calculateSubtotal(),
      taxTotal: calculateTaxTotal(),
      totalAmount: calculateTotal(),
    };

    const existingSales = JSON.parse(localStorage.getItem("sales")) || [];
    localStorage.setItem("sales", JSON.stringify([...existingSales, salesRecord]));

    alert("Sales invoice saved!");
    setFormData({
      invoiceNumber: generateInvoiceNumber(),
      customerName: "",
      number: "",
      saleDate: new Date().toISOString().slice(0, 10),
      items: [{ productId: null, productName: "", quantity: "", unitPrice: "", tax: "" }],
    });
    setDropdownState([{ open: false, searchTerm: "" }]);
  };

  // Download PDF logic unchanged (same as you provided)
  const handleDownload = () => {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    if (sales.length === 0) {
      alert("No invoices found to download!");
      return;
    }
    const lastInvoice = sales[sales.length - 1];
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    let y = 40;
    doc.setFontSize(18);
    doc.text("Shop Name", 40, y);
    doc.setFontSize(11);
    doc.text("Phone: +1234567890", 40, y + 45);
    doc.text("Email: shop@example.com", 40, y + 60);

    y += 80;
    doc.setFontSize(16);
    doc.text("Sales Invoice", 40, y);

    y += 25;
    doc.setFontSize(11);
    doc.text(`Invoice No: ${lastInvoice.invoiceNumber}`, 40, y);
    doc.text(`Date: ${lastInvoice.saleDate}`, 300, y);

    y += 20;
    doc.text(`Bill To:`, 40, y);
    doc.text(`${lastInvoice.customerName || ""}`, 90, y);

    y += 20;

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Product", 40, y);
    doc.text("Qty", 200, y);
    doc.text("Unit (Rs.)", 260, y);
    doc.text("Tax %", 340, y);
    doc.text("Line Total (Rs.)", 420, y);

    doc.setFont(undefined, "normal");
    y += 10;
    doc.line(40, y, 550, y);
    y += 15;

    lastInvoice.items.forEach((item) => {
      const qty = n(item.quantity);
      const price = n(item.unitPrice);
      const taxPct = n(item.tax);
      const line = qty * price;
      const lineWithTax = line + (line * taxPct) / 100;

      doc.text(item.productName || "N/A", 40, y);
      doc.text(String(qty), 200, y);
      doc.text(price.toFixed(2), 260, y);
      doc.text(String(taxPct), 340, y);
      doc.text(lineWithTax.toFixed(2), 420, y);
      y += 20;
    });

    y += 10;
    doc.line(40, y, 550, y);
    y += 20;

    doc.text(`Subtotal: Rs.${(lastInvoice.subtotal || 0).toFixed(2)}`, 300, y);
    y += 15;
    doc.text(`Tax Total: Rs.${(lastInvoice.taxTotal || 0).toFixed(2)}`, 300, y);
    y += 15;
    doc.setFont(undefined, "bold");
    doc.text(`Total Amount: Rs.${(lastInvoice.totalAmount || 0).toFixed(2)}`, 300, y);

    doc.save(`invoice-${lastInvoice.invoiceNumber}.pdf`);
  };

  // Print invoice preview div only
  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const printContents = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // restore React UI
  };

  return (
    <div className="p-6 w-full bg-white rounded shadow">
      {/* Top Buttons */}
      <div className="flex justify-end space-x-3 mb-6">
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Download Invoice
        </button>
        <button
          onClick={handlePrint}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          Print Invoice
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Add Sales Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top fields */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Invoice Number</label>
            <input
              type="text"
              value={formData.invoiceNumber}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <div className="flex-1">
            <label className="block font-semibold mb-1">Customer Name (Optional)</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex-1">
            <label className="block font-semibold mb-1">Number (Optional)</label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Sale Date</label>
          <input
            type="date"
            name="saleDate"
            value={formData.saleDate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Items */}
        <div>
          <label className="block font-semibold mb-2">Items</label>
          {formData.items.map((item, index) => {
            const filteredOptions = dropdownState[index]?.searchTerm
              ? productOptions.filter((p) =>
                  p.name.toLowerCase().includes(dropdownState[index].searchTerm.toLowerCase())
                )
              : productOptions;

            return (
              <div key={index} className="flex space-x-2 mb-3 items-center relative">
                {/* Searchable dropdown with arrow */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Enter or search product..."
                    value={item.productName}
                    onChange={(e) => onSearchChange(index, e.target.value)}
                    onFocus={() => {
                      const updatedDropdown = [...dropdownState];
                      updatedDropdown[index].open = true;
                      setDropdownState(updatedDropdown);
                    }}
                    className="w-full border px-3 py-2 rounded pr-8"
                    autoComplete="off"
                  />
                  {/* Dropdown arrow */}
                  <button
                    type="button"
                    onClick={() => toggleDropdown(index)}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600"
                    aria-label="Toggle product dropdown"
                  >
                    ▼
                  </button>
                  {/* Dropdown list */}
                  {dropdownState[index]?.open && (
                    <div className="absolute z-20 bg-white border w-full max-h-48 overflow-auto mt-1 rounded shadow-lg">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((product) => (
                          <div
                            key={product.id}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleProductSelect(index, product);
                            }}
                            className="cursor-pointer px-3 py-2 hover:bg-gray-200"
                          >
                            {product.name} - ₹{product.price.toFixed(2)}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500">No products found</div>
                      )}
                    </div>
                  )}
                </div>

                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  className="w-20 border px-3 py-2 rounded text-center"
                  placeholder="Qty"
                  min="0"
                />

                <input
                  type="number"
                  name="unitPrice"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                  className="w-28 border px-3 py-2 rounded text-right"
                  placeholder="Unit Price"
                  min="0"
                />

                <input
                  type="number"
                  name="tax"
                  value={item.tax}
                  onChange={(e) => handleItemChange(index, "tax", e.target.value)}
                  className="w-20 border px-3 py-2 rounded text-center"
                  placeholder="Tax %"
                  min="0"
                  max="100"
                />

                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 px-2"
                    title="Remove item"
                  >
                    ✖
                  </button>
                )}
              </div>
            );
          })}
          <button
            type="button"
            onClick={addItem}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Item
          </button>
        </div>

        {/* Totals */}
        <div className="text-right font-semibold space-y-1">
          <p>Subtotal: ₹{calculateSubtotal().toFixed(2)}</p>
          <p>Tax Total: ₹{calculateTaxTotal().toFixed(2)}</p>
          <p className="text-lg">Total: ₹{calculateTotal().toFixed(2)}</p>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Save Invoice
        </button>
      </form>

      {/* Invoice Preview to print */}
      <div className="mt-10 p-6 border rounded shadow max-w-3xl mx-auto" ref={invoiceRef}>
        <h2 className="text-xl font-bold mb-4">Invoice Preview</h2>
        <p>Shop Name</p>
        <p>Phone: +1234567890</p>
        <p>Email: shop@example.com</p>
        <hr className="my-4" />
        <p>
          <strong>Invoice No:</strong> {formData.invoiceNumber} <br />
          <strong>Date:</strong> {formData.saleDate}
        </p>
        <p>
          <strong>Bill To:</strong> {formData.customerName || "—"}
        </p>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-left">Product</th>
              <th className="border border-gray-300 px-2 py-1 text-right">Qty</th>
              <th className="border border-gray-300 px-2 py-1 text-right">Unit (₹)</th>
              <th className="border border-gray-300 px-2 py-1 text-right">Tax %</th>
              <th className="border border-gray-300 px-2 py-1 text-right">Line Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, i) => {
              const qty = n(item.quantity);
              const price = n(item.unitPrice);
              const taxPct = n(item.tax);
              const line = qty * price;
              const lineWithTax = line + (line * taxPct) / 100;

              return (
                <tr key={i}>
                  <td className="border border-gray-300 px-2 py-1">{item.productName || "—"}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">{qty}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">{price.toFixed(2)}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">{taxPct}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">{lineWithTax.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="border border-gray-300 px-2 py-1 text-right font-semibold">
                Subtotal:
              </td>
              <td className="border border-gray-300 px-2 py-1 text-right font-semibold">
                ₹{calculateSubtotal().toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="border border-gray-300 px-2 py-1 text-right font-semibold">
                Tax Total:
              </td>
              <td className="border border-gray-300 px-2 py-1 text-right font-semibold">
                ₹{calculateTaxTotal().toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="border border-gray-300 px-2 py-1 text-right font-bold text-lg">
                Total:
              </td>
              <td className="border border-gray-300 px-2 py-1 text-right font-bold text-lg">
                ₹{calculateTotal().toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
