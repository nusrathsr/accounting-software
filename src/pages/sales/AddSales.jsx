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
            sizes: (p.sizes || []).map(s => s?.size?.trim() || ""),
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
    items: [{ productId: null, productName: "", size: "", quantity: "", unitPrice: "", tax: "" }],
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

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: null, productName: "",size: "", quantity: "", unitPrice: "", tax: "" }],
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

  const calculateSubtotal = () =>
    formData.items.reduce((sum, item) => sum + n(item.quantity) * n(item.unitPrice), 0);

  const calculateTaxTotal = () =>
    formData.items.reduce((sum, item) => sum + (n(item.quantity) * n(item.unitPrice) * n(item.tax)) / 100, 0);

  const calculateTotal = () => calculateSubtotal() + calculateTaxTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validItems = formData.items.filter(
    (item) => item.productId && n(item.quantity) > 0
  );

  if (validItems.length === 0) {
    alert("Please add at least one product with quantity > 0");
    return;
  }
    const salesRecord = {
      invoiceNumber: formData.invoiceNumber,
      customerName: formData.customerName,
      saleDate: formData.saleDate,
      products: formData.items.map((item) => ({
        productId: item.productId,
        name: item.productName,
        size: item.size,
        quantity: n(item.quantity),
        unitPrice: n(item.unitPrice),
        tax: n(item.tax),
        total: n(item.quantity) * n(item.unitPrice) + (n(item.quantity) * n(item.unitPrice) * n(item.tax)) / 100,
      })),
      subtotal: calculateSubtotal(),
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
        items: [{ productId: null, productName: "", quantity: "", unitPrice: "", tax: "" }],
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

    if (!invoice) {
      alert("No invoice found!");
      return;
    }
    const invoiceDate = invoice.saleDate ? new Date(invoice.saleDate) : new Date();
    const formattedDate = isNaN(invoiceDate.getTime())
      ? new Date().toLocaleDateString()
      : invoiceDate.toLocaleDateString();

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
    doc.text(`Mobile: ${invoice.number}`, 40, y + 15);

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

    invoice.products.forEach((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      // const lineWithTax = lineTotal + (lineTotal * item.tax) / 100 || lineTotal;
      const lineWithTax = lineTotal + (lineTotal * (item.tax || 0)) / 100;

      doc.text(item.name || "N/A", 40, y);
      doc.text(String(item.quantity), 200, y);
      doc.text(item.unitPrice.toFixed(2), 260, y);
      doc.text(String(item.tax || 0), 340, y);
      doc.text(lineWithTax.toFixed(2), 420, y);
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


  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const printContents = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
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
    className="border px-2 py-1 rounded"
  >
    <option value="">Select Size</option>
    {productOptions
      .find(p => p.id === item.productId)
      .sizes.map((s, i) => (
        <option key={i} value={s}>{s}</option>
    ))}
  </select>
)}
                <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} className="w-20 border px-3 py-2 rounded text-center" />
                <input type="number" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)} className="w-28 border px-3 py-2 rounded text-right" />
                <input type="number" placeholder="Tax %" value={item.tax} onChange={(e) => handleItemChange(index, "tax", e.target.value)} className="w-20 border px-3 py-2 rounded text-center" />
                {formData.items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="text-red-600 px-2">
                    ✖
                  </button>
                )}
              </div>
            );
          })}
          <button type="button" onClick={addItem} className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add Item
          </button>
        </div>

        <div className="text-right font-semibold space-y-1">
          <p>Subtotal: Rs.{calculateSubtotal().toFixed(2)}</p>
          <p>Tax Total: Rs.{calculateTaxTotal().toFixed(2)}</p>
          <p className="text-lg">Total: ₹{calculateTotal().toFixed(2)}</p>
        </div>

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Save Invoice
        </button>
      </form>

      <div ref={invoiceRef} className="mt-10 p-6 border rounded bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Invoice Preview</h2>
        <p>Invoice No: {formData.invoiceNumber}</p>
        <p>Date: {formData.saleDate}</p>
        <p>Customer: {formData.customerName || "—"}</p>
        <p>Mobile: {formData.number || "—"}</p>
        <table className="w-full mt-4 border-collapse border">
          <thead>
            <tr className="border">
              <th className="border px-2 py-1">Product</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Unit ₹</th>
              <th className="border px-2 py-1">Tax %</th>
              <th className="border px-2 py-1">Total ₹</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => {
              const lineTotal = n(item.quantity) * n(item.unitPrice);
              const lineWithTax = lineTotal + (lineTotal * n(item.tax)) / 100;
              return (
                <tr key={index}>
                  <td className="border px-2 py-1">{item.productName || "N/A"}</td>
                  <td className="border px-2 py-1 text-center">{n(item.quantity)}</td>
                  <td className="border px-2 py-1 text-right">{n(item.unitPrice).toFixed(2)}</td>
                  <td className="border px-2 py-1 text-center">{n(item.tax)}</td>
                  <td className="border px-2 py-1 text-right">{lineWithTax.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="text-right mt-4 space-y-1">
          <p>Subtotal: Rs.{calculateSubtotal().toFixed(2)}</p>
          <p>Tax Total: Rs.{calculateTaxTotal().toFixed(2)}</p>
          <p className="font-bold">Total: Rs.{calculateTotal().toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

