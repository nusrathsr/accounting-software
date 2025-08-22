import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  User,
  Phone,
  Calendar,
  Download,
  Printer,
  Plus,
  X,
  ShoppingCart,
  IndianRupee,
  CreditCard,
  Search,
  Check,
  Save,
  ArrowLeft,
  Package,
  Percent,
  Hash,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function AddSalesInvoice() {
  const invoiceRef = useRef();
  const n = (v) => parseFloat(v) || 0;

  const [productOptions, setProductOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Show notification
  const showNotification = (type, title, message, duration = 3000) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), duration);
  };

  // API functions using fetch
  const api = {
    getProducts: async () => {
      try {
        const response = await fetch("http://localhost:4000/api/products");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      } catch (error) {
        console.error("Failed to fetch products:", error);
        throw error;
      }
    },
    
    saveSales: async (data) => {
      try {
        const response = await fetch("http://localhost:4000/api/sales", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      } catch (error) {
        console.error("Failed to save sales:", error);
        throw error;
      }
    },

    getLatestInvoice: async () => {
      try {
        const response = await fetch("http://localhost:4000/api/sales/latest");
        if (!response.ok) {
          if (response.status === 404) {
            return null; // No invoices found
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error("Failed to get latest invoice:", error);
        throw error;
      }
    },

    getInvoiceById: async (invoiceId) => {
      try {
        const response = await fetch(`http://localhost:4000/api/sales/${invoiceId}`);
        if (!response.ok) {
          if (response.status === 404) {
            return null; // Invoice not found
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error("Failed to fetch invoice:", error);
        throw error;
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        const products = data.map((p) => ({
          id: p._id,
          name: p.name || "Unnamed Product",
          price: Number(p.sellingPrice) || 0,
          taxRate: Number(p.taxPercentage) || 0,
          isTaxInclusive: p.taxType === "GST IN",
          sizes: (p.sizes || []).map((s) => s?.size?.trim() || "").filter(s => s),
        }));
        setProductOptions(products);
      } catch (err) {
        console.error("Error fetching products:", err);
        showNotification("error", "Error", "Failed to fetch products. Please check server connection.");
      } finally {
        setLoading(false);
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
        discount: "0",
        tax: "",
      },
    ],
    paymentMode: "cash",
    paymentStatus: false,
  });

  const [dropdownState, setDropdownState] = useState([{ open: false, searchTerm: "" }]);
  const [lastSavedInvoiceId, setLastSavedInvoiceId] = useState(null);

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
      ...updatedItems[index],
      productId: product.id,
      productName: product.name,
      quantity: "",
      unitPrice: product.price.toFixed(2),
      discount: "0",
      tax: product.taxRate.toFixed(2),
      size: ""
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
    if (formData.items.length > 1) {
      setFormData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
      setDropdownState((prev) => prev.filter((_, i) => i !== index));
    }
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

  // Generate PDF content for direct download/print
  const generatePDFContent = (invoice) => {
    const invoiceDate = invoice.saleDate ? new Date(invoice.saleDate) : new Date();
    const formattedDate = isNaN(invoiceDate.getTime()) ? new Date().toLocaleDateString() : invoiceDate.toLocaleDateString();

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.invoiceNumber}</title>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 20px; 
            color: #333;
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
          }
          .company-name { 
            font-size: 28px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 5px;
          }
          .company-info { 
            color: #666; 
            font-size: 14px;
          }
          .invoice-title { 
            background: linear-gradient(135deg, #2563eb, #3b82f6); 
            color: white; 
            padding: 15px; 
            margin: 20px 0; 
            text-align: center; 
            font-size: 20px; 
            font-weight: bold;
            border-radius: 8px;
          }
          .invoice-details { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin-bottom: 30px;
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
          }
          .detail-section h3 {
            color: #2563eb;
            margin-bottom: 10px;
            font-size: 16px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
          }
          .detail-item { 
            margin-bottom: 8px; 
            display: flex; 
            justify-content: space-between;
          }
          .detail-label { 
            font-weight: 600; 
            color: #374151;
          }
          .detail-value { 
            color: #6b7280;
          }
          .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          .table th { 
            background: linear-gradient(135deg, #2563eb, #3b82f6); 
            color: white; 
            padding: 15px 10px; 
            text-align: left; 
            font-weight: 600;
            font-size: 14px;
          }
          .table td { 
            padding: 12px 10px; 
            border-bottom: 1px solid #e5e7eb;
            background: white;
          }
          .table tbody tr:nth-child(even) {
            background: #f9fafb;
          }
          .table tbody tr:hover {
            background: #f3f4f6;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .totals { 
            margin-top: 30px; 
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
          }
          .total-row { 
            display: flex; 
            justify-content: space-between; 
            margin: 8px 0; 
            padding: 5px 0;
          }
          .total-row.final-total { 
            border-top: 2px solid #2563eb; 
            margin-top: 15px; 
            padding-top: 15px;
            font-size: 18px; 
            font-weight: bold; 
            color: #2563eb;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          @media print {
            body { margin: 0; }
            .header { page-break-inside: avoid; }
            .table { page-break-inside: avoid; }
            .totals { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">Your Store Name</div>
          <div class="company-info">Phone: +91 9876543210 | Email: store@example.com</div>
        </div>
        
        <div class="invoice-title">SALES INVOICE</div>
        
        <div class="invoice-details">
          <div class="detail-section">
            <h3>Invoice Details</h3>
            <div class="detail-item">
              <span class="detail-label">Invoice No:</span>
              <span class="detail-value">${invoice.invoiceNumber}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Payment Mode:</span>
              <span class="detail-value">${invoice.paymentMode?.toUpperCase() || "—"}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Status:</span>
              <span class="detail-value" style="color: ${invoice.paymentStatus ? '#059669' : '#dc2626'}">
                ${invoice.paymentStatus ? "✅ Paid" : "⏳ Unpaid"}
              </span>
            </div>
          </div>
          <div class="detail-section">
            <h3>Customer Information</h3>
            <div class="detail-item">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${invoice.customerName || "Walk-in Customer"}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Mobile:</span>
              <span class="detail-value">${invoice.number || "—"}</span>
            </div>
          </div>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th style="width: 5%">#</th>
              <th style="width: 35%">Product</th>
              <th style="width: 8%">Qty</th>
              <th style="width: 12%">Unit Price</th>
              <th style="width: 10%">Disc%</th>
              <th style="width: 10%">GST%</th>
              <th style="width: 20%" class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.products.map((item, index) => {
              const basePrice = n(item.unitPrice);
              const discountAmount = (basePrice * n(item.discount)) / 100;
              const effectivePrice = basePrice - discountAmount;
              const lineTotal = n(item.quantity) * effectivePrice;
              const taxAmount = (lineTotal * n(item.tax)) / 100;
              const finalAmount = lineTotal + taxAmount;
              
              return `<tr>
                <td class="text-center">${index + 1}</td>
                <td>
                  <strong>${item.name || "N/A"}</strong>
                  ${item.size ? `<br><small style="color: #666;">(${item.size})</small>` : ""}
                </td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">₹${basePrice.toFixed(2)}</td>
                <td class="text-center">${item.discount || 0}%</td>
                <td class="text-center">${item.tax || 0}%</td>
                <td class="text-right"><strong>₹${finalAmount.toFixed(2)}</strong></td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row" style="color: #dc2626;">
            <span>Total Discount:</span>
            <span>-₹${invoice.discountTotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div class="total-row" style="color: #059669;">
            <span>GST Total:</span>
            <span>₹${invoice.tax.toFixed(2)}</span>
          </div>
          <div class="total-row final-total">
            <span>TOTAL AMOUNT:</span>
            <span>₹${invoice.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validItems = formData.items.filter((item) => {
      const product = productOptions.find(p => p.id === item.productId);
      if (!item.productId || n(item.quantity) <= 0) return false;
      if (product?.sizes?.length > 0 && !item.size) return false;
      return true;
    });

    if (validItems.length === 0) {
      showNotification("warning", "Oops...", "Please add at least one product with quantity greater than 0");
      return;
    }

    const salesRecord = {
      invoiceNumber: formData.invoiceNumber,
      customerName: formData.customerName,
      number: formData.number,
      saleDate: formData.saleDate,
      paymentMode: formData.paymentMode,
      paymentStatus: formData.paymentStatus,
      products: validItems.map((item) => {
        const basePrice = n(item.unitPrice);
        const discountAmount = (basePrice * n(item.discount)) / 100;
        const effectivePrice = basePrice - discountAmount;
        const lineTotal = n(item.quantity) * effectivePrice;
        const taxAmount = (lineTotal * n(item.tax)) / 100;

        return {
          productId: item.productId,
          name: item.productName,
          size: item.size || "",
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
      setLoading(true);
      const savedInvoice = await api.saveSales(salesRecord);
      setLastSavedInvoiceId(savedInvoice._id || savedInvoice.id);
      
      showNotification("success", "Invoice Saved!", `Invoice ${formData.invoiceNumber} saved successfully. Total: ₹${calculateTotal().toFixed(2)}`, 2500);

      // Reset form
      setFormData({
        invoiceNumber: generateInvoiceNumber(),
        customerName: "",
        number: "",
        saleDate: new Date().toISOString().slice(0, 10),
        items: [{ productId: null, productName: "", size: "", quantity: "", unitPrice: "", discount: "0", tax: "" }],
        paymentMode: "cash",
        paymentStatus: false,
      });
      setDropdownState([{ open: false, searchTerm: "" }]);
    } catch (err) {
      console.error(err);
      showNotification("error", "Error", "Failed to save invoice. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      let invoice;
      
      // Try different approaches to get invoice data
      try {
        if (lastSavedInvoiceId) {
          invoice = await api.getInvoiceById(lastSavedInvoiceId);
        } else {
          invoice = await api.getLatestInvoice();
        }
      } catch (apiError) {
        console.warn("API call failed, using current form data:", apiError);
        // Fallback to current form data if API fails
        if (formData.items.some(item => item.productId && item.quantity)) {
          invoice = {
            invoiceNumber: formData.invoiceNumber,
            customerName: formData.customerName,
            number: formData.number,
            saleDate: formData.saleDate,
            paymentMode: formData.paymentMode,
            paymentStatus: formData.paymentStatus,
            products: formData.items.filter(item => item.productId && item.quantity).map(item => ({
              name: item.productName,
              size: item.size,
              quantity: parseFloat(item.quantity) || 0,
              unitPrice: parseFloat(item.unitPrice) || 0,
              discount: parseFloat(item.discount) || 0,
              tax: parseFloat(item.tax) || 0
            })),
            subtotal: calculateSubtotal(),
            discountTotal: calculateDiscountTotal(),
            tax: calculateTaxTotal(),
            totalAmount: calculateTotal()
          };
        }
      }
      
      if (!invoice || !invoice.invoiceNumber) {
        showNotification("warning", "No Invoice Found", "Please save an invoice first or ensure form has valid data before downloading.");
        return;
      }

      // Generate PDF content
      const pdfContent = generatePDFContent(invoice);
      
      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${invoice.invoiceNumber}_${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showNotification("success", "Downloaded!", `Invoice ${invoice.invoiceNumber} downloaded successfully.`, 2000);
    } catch (err) {
      console.error("Download error:", err);
      showNotification("error", "Download Failed", `Error downloading the invoice: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setLoading(true);
      
      let invoice;
      
      // Try different approaches to get invoice data
      try {
        if (lastSavedInvoiceId) {
          invoice = await api.getInvoiceById(lastSavedInvoiceId);
        } else {
          invoice = await api.getLatestInvoice();
        }
      } catch (apiError) {
        console.warn("API call failed, using current form data:", apiError);
        // Fallback to current form data if API fails
        if (formData.items.some(item => item.productId && item.quantity)) {
          invoice = {
            invoiceNumber: formData.invoiceNumber,
            customerName: formData.customerName,
            number: formData.number,
            saleDate: formData.saleDate,
            paymentMode: formData.paymentMode,
            paymentStatus: formData.paymentStatus,
            products: formData.items.filter(item => item.productId && item.quantity).map(item => ({
              name: item.productName,
              size: item.size,
              quantity: parseFloat(item.quantity) || 0,
              unitPrice: parseFloat(item.unitPrice) || 0,
              discount: parseFloat(item.discount) || 0,
              tax: parseFloat(item.tax) || 0
            })),
            subtotal: calculateSubtotal(),
            discountTotal: calculateDiscountTotal(),
            tax: calculateTaxTotal(),
            totalAmount: calculateTotal()
          };
        }
      }
      
      if (!invoice || !invoice.invoiceNumber) {
        showNotification("warning", "No Invoice Found", "Please save an invoice first or ensure form has valid data before printing.");
        return;
      }

      // Generate PDF content
      const pdfContent = generatePDFContent(invoice);
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        showNotification("error", "Print Failed", "Please allow popups for this site to enable printing.");
        return;
      }
      
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }, 500);
      };
      
      showNotification("success", "Printing...", `Invoice ${invoice.invoiceNumber} sent to printer.`, 2000);
    } catch (err) {
      console.error("Print error:", err);
      showNotification("error", "Print Failed", `Error printing the invoice: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && productOptions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border max-w-md ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}>
            <div className="flex items-start gap-3">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />}
              {notification.type === 'warning' && <AlertCircle className="w-5 h-5 mt-0.5 text-yellow-600" />}
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm mt-1" dangerouslySetInnerHTML={{ __html: notification.message }}></p>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
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
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Sales Invoice</h1>
                  <p className="text-blue-100 text-sm">Create and manage your sales invoices</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center gap-2 font-medium disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  disabled={loading}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center gap-2 font-medium disabled:opacity-50"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Invoice Number
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.invoiceNumber}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Customer Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Enter customer name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sale Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      name="saleDate"
                      value={formData.saleDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Items Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  Invoice Items
                </h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => {
                  const filteredOptions = dropdownState[index]?.searchTerm
                    ? productOptions.filter((p) =>
                      p.name.toLowerCase().includes(dropdownState[index].searchTerm.toLowerCase())
                    )
                    : productOptions;

                  const selectedProduct = productOptions.find(p => p.id === item.productId);

                  return (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 items-end">
                        {/* Product Search */}
                        <div className="lg:col-span-2 relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <input
                              type="text"
                              placeholder="Search product..."
                              value={item.productName}
                              onChange={(e) => onSearchChange(index, e.target.value)}
                              onFocus={() => {
                                const updatedDropdown = [...dropdownState];
                                updatedDropdown[index].open = true;
                                setDropdownState(updatedDropdown);
                              }}
                              onBlur={() => {
                                // Add a small delay to allow for option selection
                                setTimeout(() => {
                                  const updatedDropdown = [...dropdownState];
                                  updatedDropdown[index].open = false;
                                  setDropdownState(updatedDropdown);
                                }, 200);
                              }}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 relative z-10"
                            />
                            {dropdownState[index]?.open && (
                              <div className="absolute z-50 bg-white border border-gray-200 w-full 
                                max-h-[60vh] overflow-auto mt-1 rounded-xl shadow-xl">
                                {filteredOptions.length > 0 ? (
                                  filteredOptions.map((product) => (
                                    <div
                                      key={product.id}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleProductSelect(index, product);
                                      }}
                                      className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                                    >
                                      <div className="flex items-center justify-between">
                                       <span className="font-medium text-gray-900">{product.name}</span>
                                        <span className="text-sm text-gray-600 font-semibold">₹{product.price.toFixed(2)}</span>
                                      </div>
                                      {product.isTaxInclusive && (
                                         <span className="text-xs text-blue-600 mt-1">(Tax Inclusive)</span>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-4 py-3 text-gray-500 text-center">No products found</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Size Selection */}
                        {selectedProduct?.sizes?.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Size
                            </label>
                            <select
                              value={item.size || ""}
                              onChange={(e) => handleItemChange(index, "size", e.target.value)}
                              className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              required={true}
                            >
                              <option value="">Select Size</option>
                              {selectedProduct.sizes.map((s, i) => (
                                <option key={i} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Quantity */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                          </label>
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="number"
                              placeholder="0"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              min="1"
                            />
                          </div>
                        </div>

                        {/* Unit Price */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit Price
                          </label>
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="number"
                              placeholder="0.00"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              step="0.01"
                              min="0"
                            />
                          </div>
                        </div>

                        {/* Discount */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount %
                          </label>
                          <div className="relative">
                            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="number"
                              placeholder="0"
                              value={item.discount}
                              onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>

                        {/* Tax */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            GST %
                          </label>
                          <div className="relative">
                            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="number"
                              placeholder="0"
                              value={item.tax}
                              onChange={(e) => handleItemChange(index, "tax", e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              min="0"
                            />
                          </div>
                        </div>

                        {/* Line Total */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Line Total
                          </label>
                          <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl font-semibold text-blue-800">
                            ₹{calculateLineTotal(item).toFixed(2)}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={formData.items.length === 1}
                            className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

           {/* Payment Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Mode
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="paymentMode"
                      value={formData.paymentMode}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                    >
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                      <option value="wallet">Wallet</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-3 pt-8">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="paymentStatus"
                      checked={formData.paymentStatus}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <Check className={`absolute left-0.5 top-0.5 w-3 h-3 text-white pointer-events-none ${formData.paymentStatus ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                  </div>
                  <label className="text-sm font-medium text-gray-700">
                    Payment Received
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-blue-600" />
                Invoice Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-semibold text-red-600">-₹{calculateDiscountTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">GST Total:</span>
                    <span className="font-semibold">₹{calculateTaxTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-blue-50 rounded-xl px-4 border-2 border-blue-200">
                    <span className="text-lg font-bold text-blue-800">Total Amount:</span>
                    <span className="text-xl font-bold text-blue-800">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Invoice
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}