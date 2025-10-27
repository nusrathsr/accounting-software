import React, { useState, useEffect, useRef } from "react";
import {
  Receipt,
  User,
  Calendar,
  ShoppingCart,
  CreditCard,
  Download,
  Printer,
  ArrowLeft,
  Save,
  Plus,
  X,
  FileText,
  CheckCircle
} from "lucide-react";
import api from "../../utils/api";
import DownloadButton from "../../components/DownloadButton";
import PrintButton from "../../components/PrintButton";

export default function AddSalesInvoice() {
  const invoiceRef = useRef();
  const n = (v) => parseFloat(v) || 0;

  const [productOptions, setProductOptions] = useState([]);
  const [lastSavedInvoice, setLastSavedInvoice] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const data = res.data;
        const products = data.flatMap((p) =>
          p.variants && p.variants.length > 0
            ? p.variants.map((v) => ({
              id: v._id,
              parentId: p._id,
              name: `${p.name} - ${v.variantName}`,
              price: Number(v.sellingPrice) || 0,
              taxRate: Number(v.taxPercentage || 0),
              isTaxInclusive: v.taxInclusive === true,
              sizes: (v.sizeOrWeight ? [v.sizeOrWeight] : []),
            }))
            : [
              {
                id: p._id,
                parentId: null,
                name: p.name || "Unnamed Product",
                price: Number(p.sellingPrice) || 0,
                taxRate: Number(p.taxPercentage) || 0,
                isTaxInclusive: p.taxType === "GST IN",
                sizes: (p.sizes || []).map((s) => s?.size?.trim() || ""),
              },
            ]
        );
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
    paymentMode: "single",
    paymentStatus: false,
    singlePaymentMode: "cash",
    splitPayments: [
      { method: "cash", amount: "", paid: false },
      { method: "upi", amount: "", paid: false }
    ],
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
  });

  const [dropdownState, setDropdownState] = useState([{ open: false, searchTerm: "" }]);

  const generateInvoiceNumber = () =>
    `S-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

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
      variantId: product.parentId ? product.id : null,
      productName: product.name,
      sizeOrWeight: product.sizes?.[0] || "",
      quantity: "",
      unitPrice: Number(product.price),
      discount: "",
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

  const handleSplitPaymentChange = (index, field, value) => {
    const updatedSplitPayments = [...formData.splitPayments];
    updatedSplitPayments[index][field] = value;
    setFormData((prev) => ({ ...prev, splitPayments: updatedSplitPayments }));
  };

  const addSplitPayment = () => {
    setFormData((prev) => ({
      ...prev,
      splitPayments: [...prev.splitPayments, { method: "cash", amount: "", paid: false }]
    }));
  };

  const removeSplitPayment = (index) => {
    if (formData.splitPayments.length > 1) {
      setFormData((prev) => ({
        ...prev,
        splitPayments: prev.splitPayments.filter((_, i) => i !== index)
      }));
    }
  };

  const getTotalSplitAmount = () => {
    return formData.splitPayments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
  };

  const getRemainingAmount = () => {
    const total = calculateTotal();
    const splitTotal = getTotalSplitAmount();
    return Math.max(0, total - splitTotal);
  };

  const isSplitPaymentComplete = () => {
    const total = calculateTotal();
    const splitTotal = getTotalSplitAmount();
    return Math.abs(total - splitTotal) < 0.01;
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

  const onSearchChange = (index, value) => {
    const product = productOptions.find(p => p.name.toLowerCase() === value.toLowerCase());

    const updatedItems = [...formData.items];
    updatedItems[index].productName = value;
    if (product) {
      updatedItems[index].productId = product.id;
      updatedItems[index].size = "";
    } else {
      updatedItems[index].productId = null;
      updatedItems[index].size = "";
    }
    setFormData((prev) => ({ ...prev, items: updatedItems }));

    const updatedDropdown = [...dropdownState];
    updatedDropdown[index].searchTerm = value;
    updatedDropdown[index].open = true;
    setDropdownState(updatedDropdown);
  };

  const getEffectiveUnitPrice = (item) => {
    const basePrice = n(item.unitPrice);
    const discountAmount = (basePrice * n(item.discount)) / 100;
    return basePrice - discountAmount;
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

  const [alertState, setAlertState] = useState({
    show: false,
    title: '',
    text: '',
    type: 'info'
  });

  const showAlert = (title, text, type = 'info') => {
    setAlertState({
      show: true,
      title,
      text,
      type
    });
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, show: false }));
  };

  const CustomAlert = () => {
    if (!alertState.show) return null;

    const getIcon = () => {
      switch (alertState.type) {
        case 'success':
          return (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          );
        case 'error':
          return (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <X className="h-6 w-6 text-red-600" />
            </div>
          );
        case 'warning':
          return (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <span className="text-2xl">⚠️</span>
            </div>
          );
        default:
          return (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <span className="text-2xl">ℹ️</span>
            </div>
          );
      }
    };

    const getButtonColor = () => {
      switch (alertState.type) {
        case 'success':
          return 'bg-green-600 hover:bg-green-700';
        case 'error':
          return 'bg-red-600 hover:bg-red-700';
        case 'warning':
          return 'bg-yellow-600 hover:bg-yellow-700';
        default:
          return 'bg-blue-600 hover:bg-blue-700';
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in fade-in zoom-in duration-200">
          <div className="p-6 text-center">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
              {alertState.title}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {alertState.text}
            </p>
            <button
              onClick={closeAlert}
              className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${getButtonColor()}`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Create invoice data from current form or API
  const createInvoiceData = (invoiceData = null) => {
    if (invoiceData) {
      return invoiceData; // Use provided invoice data from API
    }

    // Create from current form data
    const formattedProducts = formData.items
      .filter(item => item.productId && n(item.quantity) > 0)
      .map((item) => {
        const basePrice = n(item.unitPrice);
        const discountAmount = (basePrice * n(item.discount)) / 100;
        const effectivePrice = basePrice - discountAmount;
        const lineTotal = n(item.quantity) * effectivePrice;
        const taxAmount = (lineTotal * n(item.tax)) / 100;
        const total = lineTotal + taxAmount;

        return {
          productId: item.productId,
          variantId: item.variantId,
          name: item.productName,
          sizeOrWeight: item.sizeOrWeight || item.size || "",
          quantity: n(item.quantity),
          unitPrice: basePrice,
          discount: discountAmount,
          tax: taxAmount,
          total
        };
      });

    const subtotal = formattedProducts.reduce((sum, p) => sum + (p.unitPrice * p.quantity) - p.discount, 0);
    const totalTax = formattedProducts.reduce((sum, p) => sum + p.tax, 0);
    const totalAmount = subtotal + totalTax;

    return {
      invoiceNumber: formData.invoiceNumber,
      customerName: formData.customerName,
      number: formData.number,
      date: formData.saleDate,
      products: formattedProducts,
      subtotal,
      tax: totalTax,
      totalAmount,
      paymentMode: formData.paymentMode,
      paymentStatus: formData.paymentStatus,
      ...(formData.paymentMode === "single"
        ? { singlePaymentMode: formData.singlePaymentMode }
        : { splitPayments: formData.splitPayments.filter(payment => payment.amount && parseFloat(payment.amount) > 0) }
      )
    };
  };

  // Generate HTML content for invoice
  const generateInvoiceHTML = (invoiceData) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              background: #f8fafc;
              padding: 20px;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            
            .header {
              background: linear-gradient(135deg, #2563eb, #1d4ed8);
              color: white;
              padding: 30px;
              text-align: center;
            }
            
            .header h1 {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            
            .header p {
              font-size: 16px;
              opacity: 0.9;
            }
            
            .content {
              padding: 30px;
            }
            
            .invoice-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 40px;
              padding: 20px;
              background: #f8fafc;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            
            .invoice-details h3 {
              color: #1f2937;
              font-size: 18px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            
            .invoice-details p {
              margin-bottom: 8px;
              font-size: 14px;
            }
            
            .invoice-details strong {
              color: #111827;
              font-weight: 600;
            }
            
            .total-summary {
              text-align: right;
              background: #eff6ff;
              padding: 20px;
              border-radius: 8px;
              border: 2px solid #bfdbfe;
            }
            
            .total-summary h3 {
              color: #1e40af;
              margin-bottom: 15px;
            }
            
            .total-amount {
              font-size: 28px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            
            .payment-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            
            .paid {
              background: #dcfce7;
              color: #166534;
            }
            
            .pending {
              background: #fee2e2;
              color: #dc2626;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            th {
              background: linear-gradient(135deg, #374151, #1f2937);
              color: white;
              padding: 15px 12px;
              text-align: left;
              font-weight: 600;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            th:first-child { border-radius: 8px 0 0 0; }
            th:last-child { border-radius: 0 8px 0 0; }
            
            td {
              padding: 15px 12px;
              border-bottom: 1px solid #f3f4f6;
              font-size: 14px;
            }
            
            tr:nth-child(even) {
              background: #f9fafb;
            }
            
            tr:hover {
              background: #f3f4f6;
            }
            
            .product-name {
              font-weight: 600;
              color: #1f2937;
            }
            
            .product-size {
              font-size: 12px;
              color: #6b7280;
              margin-top: 4px;
            }
            
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            
            .totals-section {
              background: #f8fafc;
              padding: 25px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
              margin-bottom: 30px;
            }
            
            .totals-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
              font-size: 16px;
            }
            
            .totals-row.final {
              border-top: 2px solid #2563eb;
              padding-top: 15px;
              margin-top: 15px;
              font-size: 20px;
              font-weight: bold;
              color: #2563eb;
            }
            
            .discount-total { color: #dc2626; }
            .tax-total { color: #059669; }
            
            .payment-section {
              background: #f0f9ff;
              padding: 25px;
              border-radius: 8px;
              border-left: 4px solid #2563eb;
            }
            
            .payment-section h3 {
              color: #1e40af;
              font-size: 18px;
              margin-bottom: 20px;
              font-weight: 600;
            }
            
            .payment-method {
              background: white;
              padding: 15px;
              border-radius: 6px;
              margin-bottom: 12px;
              border: 1px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .payment-method:last-child {
              margin-bottom: 0;
            }
            
            .method-name {
              font-weight: 600;
              text-transform: uppercase;
            }
            
            .method-amount {
              font-weight: 600;
            }
            
            .overall-status {
              background: white;
              padding: 15px;
              border-radius: 6px;
              margin-top: 20px;
              text-align: center;
              border: 2px solid #e5e7eb;
            }
            
            @media print {
              body {
                background: white;
                padding: 0;
              }
              .invoice-container {
                box-shadow: none;
                border-radius: 0;
              }
              .no-print {
                display: none !important;
              }
            }
            
            @media (max-width: 768px) {
              .invoice-info {
                grid-template-columns: 1fr;
                gap: 20px;
              }
              
              table {
                font-size: 12px;
              }
              
              th, td {
                padding: 10px 8px;
              }
              
              .content {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <h1>📄 SALES INVOICE</h1>
              <p>Professional Invoice Document</p>
            </div>
            
            <div class="content">
              <div class="invoice-info">
                <div class="invoice-details">
                  <h3>Invoice Details</h3>
                  <p><strong>Invoice Number:</strong> ${invoiceData.invoiceNumber}</p>
                  <p><strong>Date:</strong> ${new Date(invoiceData.date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}</p>
                  ${invoiceData.customerName ? `<p><strong>Customer:</strong> ${invoiceData.customerName}</p>` : ''}
                  ${invoiceData.number ? `<p><strong>Mobile:</strong> ${invoiceData.number}</p>` : ''}
                </div>
                
                <div class="total-summary">
                  <h3>Total Summary</h3>
                  <div class="total-amount">₹${invoiceData.totalAmount.toFixed(2)}</div>
                  <span class="payment-badge ${invoiceData.paymentStatus ? 'paid' : 'pending'}">
                    ${invoiceData.paymentStatus ? '✅ PAID' : '⏳ PENDING'}
                  </span>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th style="width: 35%;">Item Details</th>
                    <th style="width: 8%;" class="text-center">Qty</th>
                    <th style="width: 12%;" class="text-right">Unit Price</th>
                    <th style="width: 12%;" class="text-right">Discount</th>
                    <th style="width: 12%;" class="text-right">Tax</th>
                    <th style="width: 15%;" class="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoiceData.products.map(product => `
                    <tr>
                      <td>
                        <div class="product-name">${product.name}</div>
                        ${product.sizeOrWeight ? `<div class="product-size">Size/Weight: ${product.sizeOrWeight}</div>` : ''}
                      </td>
                      <td class="text-center" style="font-weight: 600;">${product.quantity}</td>
                      <td class="text-right">₹${product.unitPrice.toFixed(2)}</td>
                      <td class="text-right discount-total">₹${product.discount.toFixed(2)}</td>
                      <td class="text-right tax-total">₹${product.tax.toFixed(2)}</td>
                      <td class="text-right" style="font-weight: 600; color: #2563eb;">₹${product.total.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="totals-section">
                <div class="totals-row">
                  <span><strong>Subtotal:</strong></span>
                  <span style="color: #2563eb; font-weight: 600;">₹${invoiceData.subtotal.toFixed(2)}</span>
                </div>
                <div class="totals-row">
                  <span><strong>Total Discount:</strong></span>
                  <span class="discount-total" style="font-weight: 600;">₹${invoiceData.products.reduce((sum, p) => sum + p.discount, 0).toFixed(2)}</span>
                </div>
                <div class="totals-row">
                  <span><strong>Total Tax (GST):</strong></span>
                  <span class="tax-total" style="font-weight: 600;">₹${invoiceData.tax.toFixed(2)}</span>
                </div>
                <div class="totals-row final">
                  <span>Grand Total:</span>
                  <span>₹${invoiceData.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div class="payment-section">
                <h3>💳 Payment Information</h3>
                ${invoiceData.paymentMode === 'single'
        ? `<div class="payment-method">
                       <span class="method-name">${invoiceData.singlePaymentMode}</span>
                       <span class="method-amount">₹${invoiceData.totalAmount.toFixed(2)}</span>
                     </div>`
        : `<div style="margin-bottom: 15px;"><strong>Split Payment Details:</strong></div>
                     ${invoiceData.splitPayments.map(payment =>
          `<div class="payment-method">
                          <span>
                            <span class="method-name">${payment.method}</span>
                            <span class="payment-badge ${payment.paid ? 'paid' : 'pending'}" style="margin-left: 10px;">
                              ${payment.paid ? '✅ Paid' : '⏳ Pending'}
                            </span>
                          </span>
                          <span class="method-amount">₹${parseFloat(payment.amount).toFixed(2)}</span>
                        </div>`
        ).join('')}`
      }
                
                <div class="overall-status">
                  <strong style="color: ${invoiceData.paymentStatus ? '#166534' : '#dc2626'};">
                    Overall Payment Status: ${invoiceData.paymentStatus ? '✅ FULLY PAID' : '⏳ PAYMENT PENDING'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const validItems = formData.items.filter((item) => {
  //     const product = productOptions.find(p => p.id === item.productId);
  //     if (!item.productId || n(item.quantity) <= 0) return false;
  //     if (product?.sizes?.some(s => s.trim() !== "") && !item.size) return false;
  //     return true;
  //   });

  //   if (validItems.length === 0) {
  //     showAlert("Warning", "Please add at least one product with quantity greater than 0", "warning");
  //     return;
  //   }

  //   const invoiceData = createInvoiceData();

  //   try {
  //     await api.post("/sales", invoiceData);
  //     setLastSavedInvoice(invoiceData);

  //     showAlert("Success!", `Invoice ${formData.invoiceNumber} saved successfully. Total: ₹${invoiceData.totalAmount.toFixed(2)}`, "success");

  //     setFormData({
  //       invoiceNumber: generateInvoiceNumber(),
  //       customerName: "",
  //       number: "",
  //       saleDate: new Date().toISOString().slice(0, 10),
  //       paymentMode: "single",
  //       paymentStatus: false,
  //       singlePaymentMode: "cash",
  //       splitPayments: [
  //         { method: "cash", amount: "", paid: false },
  //         { method: "upi", amount: "", paid: false }
  //       ],
  //       items: [{ productId: null, productName: "", quantity: "", unitPrice: "", discount: "0", tax: "" }],
  //     });
  //     setDropdownState([{ open: false, searchTerm: "" }]);
  //   } catch (err) {
  //     console.error(err);
  //     showAlert("Error!", "Failed to save invoice. Please check server connection.", "error");
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();

  const validItems = formData.items.filter((item) => {
    const product = productOptions.find(p => p.id === item.productId);
    if (!item.productId || Number(item.quantity) <= 0) return false;
    if (product?.sizes?.some(s => s.trim() !== "") && !item.size) return false;
    return true;
  });

  if (validItems.length === 0) {
    showAlert("Warning", "Please add at least one product with quantity greater than 0", "warning");
    return;
  }

  const invoiceData = createInvoiceData();

  // ✅ Fix paymentStatus before sending to backend
  let paymentStatus = "Pending"; // default
  if (invoiceData.paymentMode === "single") {
    paymentStatus = "Paid";
  } else if (invoiceData.paymentMode === "split") {
    const totalPaid = invoiceData.splitPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    paymentStatus = totalPaid >= invoiceData.totalAmount ? "Paid" : "Partial";
  }

  invoiceData.paymentStatus = paymentStatus; // string enum now

  try {
    await api.post("/sales", invoiceData);
    setLastSavedInvoice(invoiceData);

    showAlert(
      "Success!",
      `Invoice ${formData.invoiceNumber} saved successfully. Total: ₹${invoiceData.totalAmount.toFixed(2)}`,
      "success"
    );

    // Reset form
    setFormData({
      invoiceNumber: generateInvoiceNumber(),
      customerName: "",
      number: "",
      saleDate: new Date().toISOString().slice(0, 10),
      paymentMode: "single",
      paymentStatus: "Paid",
      singlePaymentMode: "cash",
      splitPayments: [
        { method: "cash", amount: "", paid: false },
        { method: "upi", amount: "", paid: false }
      ],
      items: [{ productId: null, productName: "", quantity: "", unitPrice: "", discount: "0", tax: "" }],
    });
    setDropdownState([{ open: false, searchTerm: "" }]);
  } catch (err) {
    console.error(err);
    showAlert("Error!", "Failed to save invoice. Please check server connection.", "error");
  }
};


return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <CustomAlert />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Add Sales Invoice</h1>
                  <p className="text-blue-100 text-sm">Create and manage sales invoices</p>
                </div>
              </div>
              <div className="flex space-x-3">
                {/* <button
                  onClick={handleDownload}
                  className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button> */}
                <DownloadButton
                  downloadData={lastSavedInvoice}         
                  apiUrl="/sales/latest"                  
                  fileName="Invoice"                      
                  generateHtml={generateInvoiceHTML}     
                  showAlert={showAlert}                  
                />
                <PrintButton
                  printData={lastSavedInvoice}
                  apiUrl="/sales/latest"
                  generateHtml={generateInvoiceHTML}
                  showAlert={showAlert}
                />
                
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">

            {/* Invoice Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Invoice Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-blue-600" />
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    readOnly
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-100 font-medium text-gray-700 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Sale Date
                  </label>
                  <input
                    type="date"
                    name="saleDate"
                    value={formData.saleDate}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                  />
                </div>

                <div className="space-y-2 md:col-span-2 xl:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Customer Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                    placeholder="Enter customer name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Invoice Items</h2>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="space-y-4 p-6">
                  {formData.items.map((item, index) => {
                    const filteredOptions = dropdownState[index]?.searchTerm
                      ? productOptions.filter((p) =>
                        p.name.toLowerCase().includes(dropdownState[index].searchTerm.toLowerCase())
                      )
                      : productOptions;

                    return (
                      <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                            <div className="lg:col-span-3 relative">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
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
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                              />
                              {dropdownState[index]?.open && (
                                <div className="absolute z-20 bg-white border border-gray-200 w-full max-h-48 overflow-auto mt-1 rounded-xl shadow-lg">
                                  {filteredOptions.length > 0 ? (
                                    filteredOptions.map((product) => (
                                      <div
                                        key={product.id}
                                        onMouseDown={(e) => {
                                          e.preventDefault();
                                          handleProductSelect(index, product);
                                        }}
                                        className="cursor-pointer px-4 py-3 hover:bg-gray-100 transition-colors duration-150 text-sm"
                                      >
                                        {product.name}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="px-4 py-3 text-gray-500 text-sm">No products found</div>
                                  )}
                                </div>
                              )}
                            </div>

                            {item.productId && productOptions.find(p => p.id === item.productId)?.sizes?.some(s => s.trim() !== "") && (
                              <div className="lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Size/Weight</label>
                                <select
                                  value={item.size || ""}
                                  onChange={(e) => handleItemChange(index, "size", e.target.value)}
                                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                                  required={true}
                                >
                                  <option value="">Select Size</option>
                                  {productOptions
                                    .find(p => p.id === item.productId)
                                    .sizes.filter(s => s.trim() !== "")
                                    .map((s, i) => (
                                      <option key={i} value={s}>{s}</option>
                                    ))}
                                </select>
                              </div>
                            )}

                            <div className="lg:col-span-1 flex items-end">
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="w-full px-3 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 flex items-center justify-center"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                              <input
                                type="number"
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price ₹</label>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Unit ₹"
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Discount %</label>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Disc %"
                                value={item.discount}
                                onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">GST %</label>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="GST %"
                                value={item.tax}
                                onChange={(e) => handleItemChange(index, "tax", e.target.value)}
                                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Effective Price ₹</label>
                              <div className="w-full px-3 py-3 border border-gray-200 rounded-xl bg-gray-100 font-medium text-gray-700 text-right text-base">
                                ₹{getEffectiveUnitPrice(item).toFixed(2)}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Line Total ₹</label>
                              <div className="w-full px-3 py-3 border border-gray-200 rounded-xl bg-blue-50 font-bold text-blue-700 text-right text-base">
                                ₹{(n(item.quantity) * getEffectiveUnitPrice(item) + (n(item.quantity) * getEffectiveUnitPrice(item) * n(item.tax)) / 100).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex justify-center pt-4">
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-2">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="single"
                      checked={formData.paymentMode === "single"}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Single Payment</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="split"
                      checked={formData.paymentMode === "split"}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Split Payment</span>
                  </label>
                </div>
              </div>

              {formData.paymentMode === "single" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      Payment Mode
                    </label>
                    <select
                      name="singlePaymentMode"
                      value={formData.singlePaymentMode}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                    >
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                      <option value="wallet">Wallet</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      Payment Status
                    </label>
                    <div className="flex items-center space-x-3 mt-4">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="paymentStatus"
                          checked={formData.paymentStatus}
                          onChange={handleCheckboxChange}
                          className="w-6 h-6 text-purple-600 border-2 border-gray-300 rounded-lg focus:ring-purple-500 focus:ring-2 transition-all duration-200"
                          id="paymentStatus"
                        />
                      </div>
                      <label htmlFor="paymentStatus" className="text-base font-medium text-gray-700 cursor-pointer select-none">
                        Mark as Paid
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span>Total Amount: </span>
                        <span className="font-semibold text-gray-900">₹{calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>Split Total: </span>
                        <span className={`font-semibold ${isSplitPaymentComplete() ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{getTotalSplitAmount().toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>Remaining: </span>
                        <span className={`font-semibold ${getRemainingAmount() === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                          ₹{getRemainingAmount().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                    {formData.splitPayments.map((payment, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                            <select
                              value={payment.method}
                              onChange={(e) => handleSplitPaymentChange(index, 'method', e.target.value)}
                              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                            >
                              <option value="cash">Cash</option>
                              <option value="upi">UPI</option>
                              <option value="card">Card</option>
                              <option value="wallet">Wallet</option>
                              <option value="credit">Credit</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount ₹</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={payment.amount}
                              onChange={(e) => handleSplitPaymentChange(index, 'amount', e.target.value)}
                              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-base"
                            />
                          </div>

                          <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={payment.paid}
                                onChange={(e) => handleSplitPaymentChange(index, 'paid', e.target.checked)}
                                className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-200"
                              />
                              <span className="ml-2 text-sm font-medium text-gray-700">Paid</span>
                            </label>
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={() => removeSplitPayment(index)}
                              disabled={formData.splitPayments.length <= 1}
                              className={`w-full px-3 py-3 rounded-lg transition-all duration-200 flex items-center justify-center ${formData.splitPayments.length <= 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                                }`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={addSplitPayment}
                        className="px-4 py-2 bg-purple-50 text-purple-600 font-medium rounded-lg hover:bg-purple-100 transition-all duration-200 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Payment Method
                      </button>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Overall Payment Status:</span>
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="paymentStatus"
                            checked={formData.paymentStatus}
                            onChange={handleCheckboxChange}
                            className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-200"
                            id="splitPaymentStatus"
                          />
                          <label htmlFor="splitPaymentStatus" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Mark invoice as fully paid
                          </label>
                        </div>
                      </div>

                      {!isSplitPaymentComplete() && getRemainingAmount() > 0 && (
                        <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                          <span>⚠️ Split payments don't cover the full amount. Remaining: ₹{getRemainingAmount().toFixed(2)}</span>
                        </div>
                      )}

                      {getTotalSplitAmount() > calculateTotal() && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                          <span>⚠️ Split payment total exceeds invoice amount by ₹{(getTotalSplitAmount() - calculateTotal()).toFixed(2)}</span>
                        </div>
                      )}

                      {isSplitPaymentComplete() && (
                        <div className="mt-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                          <span>✓ Split payments match the invoice total perfectly</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Totals Section */}
            <div className="mb-10">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
                <div className="flex flex-col items-end space-y-3">
                  <div className="text-lg font-medium text-gray-700 flex justify-between w-full max-w-md">
                    <span>Subtotal:</span>
                    <span className="text-blue-600 font-semibold">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="text-lg font-medium text-gray-700 flex justify-between w-full max-w-md">
                    <span>Total Discount:</span>
                    <span className="text-red-600 font-semibold">₹{calculateDiscountTotal().toFixed(2)}</span>
                  </div>
                  <div className="text-lg font-medium text-gray-700 flex justify-between w-full max-w-md">
                    <span>Total GST:</span>
                    <span className="text-green-600 font-semibold">₹{calculateTaxTotal().toFixed(2)}</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 border-t pt-3 flex justify-between w-full max-w-md">
                    <span>Grand Total:</span>
                    <span className="text-blue-700">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 border-t border-gray-100">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}