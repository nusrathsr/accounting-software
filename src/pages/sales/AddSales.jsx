import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";

export default function AddSalesInvoice() {
  const invoiceRef = useRef();
  const n = (v) => parseFloat(v) || 0;

  const [productOptions, setProductOptions] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/products");
        const products = res.data.map((p) => ({
          id: p._id,
          name: p.name || "Unnamed Product",
          price: Number(p.sellingPrice) || 0,
          taxRate: Number(p.taxPercentage) || 0,
          isTaxInclusive: p.taxType === "GST IN",
          sizes: (p.sizes || []).map((s) => s?.size?.trim() || ""),
        }));
        setProductOptions(products);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customerName: "",
    number: "",
    saleDate: new Date().toISOString().slice(0, 10),
    items: [
      {
        productId: null,
        productName: "",
        size: "",
        quantity: "",
        unitPrice: "",
        discount: "",
        tax: "",
      },
    ],
    paymentMode: "cash",
    paymentStatus: false,
  });

  const [dropdownState, setDropdownState] = useState([{ open: false, searchTerm: "" }]);

  const generateInvoiceNumber = () =>
    `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  useEffect(() => {
    setFormData((prev) => ({ ...prev, invoiceNumber: generateInvoiceNumber() }));
  }, []);

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
      unitPrice: product.price.toFixed(2),
      discount: "0",
      tax: product.taxRate.toFixed(2),
    };
    setFormData((prev) => ({ ...prev, items: updatedItems }));

    const updatedDropdown = [...dropdownState];
    updatedDropdown[index] = { open: false, searchTerm: "" };
    setDropdownState(updatedDropdown);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleCheckboxChange = (e) => {
  const { name, checked } = e.target;
  setFormData((prev) => ({ ...prev, [name]: checked }));
};

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: null, productName: "", size: "", quantity: "", unitPrice: "", discount: "0", tax: "" },
      ],
    }));
    setDropdownState((prev) => [...prev, { open: false, searchTerm: "" }]);
  };

  const removeItem = (index) => {
    setFormData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    setDropdownState((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDropdown = (index) => {
    setDropdownState((prev) =>
      prev.map((d, i) => (i === index ? { ...d, open: !d.open, searchTerm: "" } : { ...d, open: false, searchTerm: "" }))
    );
  };

  const onSearchChange = (index, value) => {
    const updatedDropdown = [...dropdownState];
    updatedDropdown[index].searchTerm = value;
    updatedDropdown[index].open = true;
    setDropdownState(updatedDropdown);

    const updatedItems = [...formData.items];
    updatedItems[index].productName = value;
    updatedItems[index].productId = null;
    updatedItems[index].size = "";
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const getEffectiveUnitPrice = (item) => {
    const basePrice = n(item.unitPrice);
    const discountAmount = (basePrice * n(item.discount)) / 100;
    return basePrice - discountAmount;
  };

  const calculateLineTotal = (item) => {
    const effectivePrice = getEffectiveUnitPrice(item);
    const lineTotal = n(item.quantity) * effectivePrice;
    const taxAmount = (lineTotal * n(item.tax)) / 100;
    return lineTotal + taxAmount;
  };

  const calculateSubtotal = () =>
    formData.items.reduce((sum, item) => sum + n(item.quantity) * getEffectiveUnitPrice(item), 0);

  const calculateTaxTotal = () =>
    formData.items.reduce((sum, item) => {
      const lineTotal = n(item.quantity) * getEffectiveUnitPrice(item);
      return sum + (lineTotal * n(item.tax)) / 100;
    }, 0);
    const calculateDiscountTotal = () =>
  formData.items.reduce((sum, item) => {
    return sum + (n(item.unitPrice) * n(item.quantity) * n(item.discount)) / 100;
  }, 0);

  const calculateTotal = () => calculateSubtotal() + calculateTaxTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validItems = formData.items.filter((item) => item.productId && n(item.quantity) > 0);
    if (validItems.length === 0) {
      alert("Please add at least one product with quantity > 0");
      return;
    }

    const salesRecord = {
      invoiceNumber: formData.invoiceNumber,
      customerName: formData.customerName,
      saleDate: formData.saleDate,
      paymentMode: formData.paymentMode,
      paymentStatus: formData.paymentStatus,
      products: formData.items.map((item) => {
        const basePrice = n(item.unitPrice);
        const discountAmount = (basePrice * n(item.discount)) / 100;
        const effectivePrice = basePrice - discountAmount;
        const lineTotal = n(item.quantity) * effectivePrice;
        const taxAmount = (lineTotal * n(item.tax)) / 100;

        return {
          productId: item.productId,
          name: item.productName,
          size: item.size,
          quantity: n(item.quantity),
          unitPrice: basePrice,
          discount: n(item.discount),
          tax: n(item.tax),
          lineTotal: lineTotal + taxAmount,
        };
      }),
      subtotal: calculateSubtotal(),
      discountTotal: calculateDiscountTotal(),
      tax: calculateTaxTotal(),
      totalAmount: calculateTotal(),
    };

    try {
      await axios.post("http://localhost:4000/api/sales", salesRecord);
      alert("Sales invoice saved successfully!");
      setFormData({
        invoiceNumber: generateInvoiceNumber(),
        customerName: "",
        number: "",
        saleDate: new Date().toISOString().slice(0, 10),
        items: [{ productId: null, productName: "", quantity: "", unitPrice: "", discount: "0", tax: "" }],
      });
      setDropdownState([{ open: false, searchTerm: "" }]);
    } catch (err) {
      console.error(err);
      alert("Error saving invoice. Check server connection.");
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/sales/latest");
      const invoice = res.data;
      if (!invoice) return alert("No invoice found!");
      const invoiceDate = invoice.saleDate ? new Date(invoice.saleDate) : new Date();
      const formattedDate = isNaN(invoiceDate.getTime()) ? new Date().toLocaleDateString() : invoiceDate.toLocaleDateString();

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      let y = 40;

      doc.setFontSize(18);
      doc.text("Shop Name", 40, y);
      doc.setFontSize(11);
      doc.text("Phone: +1234567890", 40, y + 25);
      doc.text("Email: shop@example.com", 40, y + 40);

      y += 70;
      doc.setFontSize(16);
      doc.text("Sales Invoice", 40, y);
      y += 20;
      doc.setFontSize(11);
      doc.text(`Invoice No: ${invoice.invoiceNumber}`, 40, y);
      doc.text(`Date: ${formattedDate}`, 300, y);
      y += 20;
      doc.text(`Bill To: ${invoice.customerName}`, 40, y);
      doc.text(`Mobile: ${invoice.number || "—"}`, 40, y + 15);
      y += 20;
      doc.text(`Payment Mode: ${invoice.paymentMode || "—"}`, 40, y);
      doc.text(`Payment Status: ${invoice.paymentStatus ? "Paid" : "Unpaid"}`, 300, y);

      y += 20;
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("Product", 40, y);
      doc.text("Qty", 200, y);
      doc.text("Unit (Rs.)", 260, y);
      doc.text("Disc %", 340, y); 
      doc.text("GST %", 400, y);
      doc.text("Line Total (Rs.)", 470, y);
      doc.setFont(undefined, "normal");
      y += 10;
      doc.line(40, y, 550, y);
      y += 15;

      invoice.products.forEach((item) => {
        const basePrice = n(item.unitPrice);
        const discountAmount = (basePrice * n(item.discount)) / 100;
        const effectivePrice = basePrice - discountAmount;
        const lineTotal = n(item.quantity) * effectivePrice;
        const lineWithTax = lineTotal + (lineTotal * n(item.tax)) / 100;

        doc.text(item.name || "N/A", 40, y);
        doc.text(String(item.quantity), 200, y);
        doc.text(basePrice.toFixed(2), 260, y);
        doc.text(String(item.discount || 0), 340, y);
        doc.text(String(item.tax || 0), 400, y);
        doc.text(lineWithTax.toFixed(2), 470, y);
        y += 20;
      });

      y += 10;
      doc.line(40, y, 550, y);
      y += 20;
      doc.text(`Subtotal: Rs.${invoice.subtotal.toFixed(2)}`, 300, y);
      y += 15;
      doc.text(`Tax Total: Rs.${invoice.tax.toFixed(2)}`, 300, y);
      y += 15;
      doc.setFont(undefined, "bold");
      doc.text(`Total Amount: Rs.${invoice.totalAmount.toFixed(2)}`, 300, y);

      doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error fetching the latest invoice.");
    }
  };

  const handlePrint = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/sales/latest");
      const invoice = res.data;
      if (!invoice) return alert("No invoice found!");
      const invoiceDate = invoice.saleDate ? new Date(invoice.saleDate) : new Date();
      const formattedDate = isNaN(invoiceDate.getTime()) ? new Date().toLocaleDateString() : invoiceDate.toLocaleDateString();

      const printableContent = `
      <div>
        <h2 style="text-align:center;">Sales Invoice</h2>
        <p><strong>Invoice No:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Customer:</strong> ${invoice.customerName || "—"}</p>
        <p><strong>Mobile:</strong> ${invoice.number || "—"}</p>
        <p><strong>Payment Mode:</strong> ${invoice.paymentMode || "—"}</p>
        <p><strong>Payment Status:</strong> ${invoice.paymentStatus ? "Paid" : "Unpaid"}</p>
        <table border="1" cellspacing="0" cellpadding="5" width="100%" style="border-collapse:collapse; margin-top:10px;">
          <thead>
            <tr>
              <th>Product</th><th>Qty</th><th>Unit ₹</th><th>Disc %</th><th>GST %</th><th>Total ₹</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.products
              .map((item) => {
                const basePrice = n(item.unitPrice);
                const discountAmount = (basePrice * n(item.discount)) / 100;
                const effectivePrice = basePrice - discountAmount;
                const lineTotal = n(item.quantity) * effectivePrice;
                const lineWithTax = lineTotal + (lineTotal * n(item.tax)) / 100;
                return `<tr>
                  <td>${item.name || "N/A"}</td>
                  <td style="text-align:center;">${item.quantity}</td>
                  <td style="text-align:right;">${basePrice.toFixed(2)}</td>
                  <td style="text-align:center;">${item.discount || 0}</td>
                  <td style="text-align:center;">${item.tax || 0}</td>
                  <td style="text-align:right;">${lineWithTax.toFixed(2)}</td>
                </tr>`;
              })
              .join("")}
          </tbody>
        </table>
        <p style="text-align:right; margin-top:10px;">Subtotal: ₹${invoice.subtotal.toFixed(2)}</p>
        <p style="text-align:right;">Tax Total: ₹${invoice.tax.toFixed(2)}</p>
        <p style="text-align:right; font-weight:bold;">Total: ₹${invoice.totalAmount.toFixed(2)}</p>
      </div>
    `;

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`<html><head><title>Invoice</title></head><body>${printableContent}</body></html>`);
      printWindow.document.close();
      printWindow.print();
    } catch (err) {
      console.error(err);
      alert("Error fetching the latest invoice for printing.");
    }
  };

  return (
    <div className="p-6 w-full bg-white rounded shadow">
      <div className="flex justify-end space-x-3 mb-6">
        <button onClick={handleDownload} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Download Invoice
        </button>
        <button onClick={handlePrint} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
          Export
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Add Sales Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label>Invoice Number</label>
            <input type="text" value={formData.invoiceNumber} readOnly className="w-full border px-3 py-2 rounded bg-gray-100" />
          </div>
          <div className="flex-1">
            <label>Customer Name(optional)</label>
            <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
          <div className="flex-1">
            <label>Mobile Number(optional)</label>
            <input
              type="tel"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter mobile number"
            />
          </div>
        </div>
        <div>
          <label>Sale Date</label>
          <input type="date" name="saleDate" value={formData.saleDate} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="flex space-x-4">
  <div className="flex-1">
    <label>Payment Mode</label>
    <select
      name="paymentMode"
      value={formData.paymentMode}
      onChange={handleChange}
      className="w-full border px-3 py-2 rounded"
    >
      <option value="cash">Cash</option>
      <option value="upi">UPI</option>
      <option value="card">Card</option>
      <option value="wallet">Wallet</option>
      <option value="credit">Credit</option>
    </select>
  </div>

  <div className="flex-1 flex items-center space-x-2 mt-6">
    <input
      type="checkbox"
      name="paymentStatus"
      checked={formData.paymentStatus}
      onChange={handleCheckboxChange}
      className="w-5 h-5"
    />
    <label>Paid</label>
  </div>
</div>


        <div>
          <label>Items</label>
          {formData.items.map((item, index) => {
            const filteredOptions = dropdownState[index]?.searchTerm
              ? productOptions.filter((p) =>
                  p.name.toLowerCase().includes(dropdownState[index].searchTerm.toLowerCase())
                )
              : productOptions;

            return (
              <div key={index} className="flex space-x-2 mb-3 items-center relative">
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
                  className="w-full border px-3 py-2 rounded"
                />
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
                          {product.name} - ₹{Number(product.price).toFixed(2)} {product.isTaxInclusive ? "(Tax Incl.)" : ""}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500">No products found</div>
                    )}
                  </div>
                )}

                {item.productId && productOptions.find(p => p.id === item.productId)?.sizes && (
                  <select
                    value={item.size}
                    onChange={(e) => handleItemChange(index, "size", e.target.value)}
                    className="w-24 border px-2 py-1 rounded"
                  >
                    <option value="">Select Size</option>
                    {productOptions.find(p => p.id === item.productId).sizes.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                )}
                <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} className="w-20 border px-2 py-1 rounded" />
                <input type="number" placeholder="Unit ₹" value={item.unitPrice} onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)} className="w-24 border px-2 py-1 rounded" />
                <input type="number" placeholder="Disc %" value={item.discount} onChange={(e) => handleItemChange(index, "discount", e.target.value)} className="w-20 border px-2 py-1 rounded" />
                <input type="number" placeholder="GST %" value={item.tax} onChange={(e) => handleItemChange(index, "tax", e.target.value)} className="w-20 border px-2 py-1 rounded" />
                {/* <span className="w-24">{calculateLineTotal(item).toFixed(2)}</span> */}
                 <span className="w-24 font-medium text-right">
          ₹{getEffectiveUnitPrice(item).toFixed(2)}
        </span>
                <button type="button" onClick={() => removeItem(index)} className="text-red-500 px-2">X</button>
              </div>
            );
          })}
          <button type="button" onClick={addItem} className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Item</button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4">Save Invoice</button>
       <div className="flex flex-col items-end space-y-1 mt-6">
  <div>Subtotal: ₹{calculateSubtotal().toFixed(2)}</div>
  <div>Discount: ₹{calculateDiscountTotal().toFixed(2)}</div>
  <div>GST: ₹{calculateTaxTotal().toFixed(2)}</div>
  <div className="font-bold">Total: ₹{calculateTotal().toFixed(2)}</div>
</div>

      </form>
    </div>
  );
}
