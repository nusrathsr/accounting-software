import React, { useState, useEffect, useRef } from "react";
import api from "../../utils/api";
import {
  FileText,
  User,
  Package,
  Calendar,
  IndianRupee,
  Hash,
  Percent,
  Search,
  Save,
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  CheckCircle,
  AlertCircle,
  X,
  Truck,
  Layers,
  Download,
  Printer
} from "lucide-react";
import DownloadButton from "../../components/DownloadButton";
import PrintButton from "../../components/PrintButton";

export default function AddPurchase() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const printRef = useRef(null);

  const [formData, setFormData] = useState({
    purchaseOrderNumber: "",
    supplierName: "",
    product: "",
    productId: "",
    variant: "",
    variantId: "",
    quantity: "",
    unitPrice: "",
    tax: "",
    taxInclusive: "no",
    totalAmount: "",
    paidAmount: "",
    purchaseDate: new Date().toISOString().slice(0, 10),
    expiryDate: "",
  });

  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [variantSearch, setVariantSearch] = useState("");
  const [variantDropdownOpen, setVariantDropdownOpen] = useState(false);

  // Show notification
  const showNotification = (type, title, message, duration = 3000) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), duration);
  };


  // ✅ API calls using api.js
  const getProducts = async () => {
    try {
      const res = await api.get("/products");
      console.log("Products fetched:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  const getSuppliers = async () => {
    try {
      const res = await api.get("/customer/suppliers");

      return res.data;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw error;
    }
  };

  // Get variants for a specific product
  const getProductVariants = async (productId) => {
    if (!productId) return [];  // Avoid calling API with undefined ID
    try {
      const res = await api.get(`/products/${productId}/variants`);
      return res.data;
    } catch (error) {
      console.error("Error fetching product variants:", error);
      return [];

    }
  };

  const savePurchase = async (data) => {
    const res = await api.post("/purchases", data);
    return res.data;
  };

  // Fetch products and suppliers initially
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productsData, suppliersData] = await Promise.all([
          getProducts(),
          getSuppliers()
        ]);

        setProducts(productsData || []);
        setSuppliers(suppliersData || []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        showNotification("error", "Error", "Failed to fetch data. Please check server connection.");
        // Set empty arrays as fallback
        setProducts([]);
        setSuppliers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Generate PO number
  const generatePONumber = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `PO-${new Date().getFullYear()}-${randomNum}`;
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      purchaseOrderNumber: generatePONumber(),
    }));
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setSupplierDropdownOpen(false);
        setProductDropdownOpen(false);
        setVariantDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (["quantity", "unitPrice", "tax", "taxInclusive"].includes(name)) {
        const qty = parseFloat(updated.quantity) || 0;
        const price = parseFloat(updated.unitPrice) || 0;
        const taxPct = parseFloat(updated.tax) || 0;
        updated.totalAmount = updated.taxInclusive === "yes"
          ? (qty * price + (qty * price * taxPct) / 100).toFixed(2)
          : (qty * price).toFixed(2);
      }

      return updated;
    });
  };


  // Select supplier
  const handleSupplierSelect = (supplier) => {
    setFormData((prev) => ({ ...prev, supplierName: supplier.name }));
    setSupplierSearch(supplier.name);
    setSupplierDropdownOpen(false);
  };

  // Select product and fetch its variants
  const handleProductSelect = async (product) => {
    setFormData((prev) => ({ ...prev, product: product.name, productId: product._id, variant: "", variantId: "" }));
    setProductSearch(product.name);
    setVariantSearch("");
    setProductDropdownOpen(false);

    // Fetch variants for the selected product
    try {
      const productVariants = await getProductVariants(product._id);
      setVariants(productVariants || []);
    } catch (error) {
      console.error("Failed to load variants for product:", error);
      setVariants([]);
      showNotification("warning", "Warning", "Could not load variants for this product.");
    }
  };

  // Select variant
  const handleVariantSelect = (variant) => {
    setFormData((prev) => ({
      ...prev, variant: variant.variantName || variant.name,
      variantId: variant._id
    }));
    setVariantSearch(variant.variantName || variant.name);
    setVariantDropdownOpen(false);
  };

  // Handle supplier search
  const handleSupplierSearchChange = (value) => {
    setSupplierSearch(value);
    setFormData((prev) => ({ ...prev, supplierName: value }));
    setSupplierDropdownOpen(true);
  };

  // Handle product search
  const handleProductSearchChange = (value) => {
    setProductSearch(value);
    setFormData((prev) => ({ ...prev, product: value, variant: "", variantId: "" }));
    setVariantSearch("");
    setVariants([]); // Clear variants when product changes
    setProductDropdownOpen(true);
  };

  // Handle variant search
  const handleVariantSearchChange = (value) => {
    setVariantSearch(value);
    setFormData((prev) => ({ ...prev, variant: value }));
    setVariantDropdownOpen(true);
  };

  // // Print function
  // const handlePrint = () => {
  //   if (!formData.supplierName || !formData.product || !formData.quantity) {
  //     showNotification("warning", "Incomplete Data", "Please fill in all required fields before printing.");
  //     return;
  //   }

  //   const printWindow = window.open('', '_blank');
  //   const printContent = generatePrintContent();

  //   printWindow.document.write(printContent);
  //   printWindow.document.close();
  //   printWindow.focus();

  //   setTimeout(() => {
  //     printWindow.print();
  //     printWindow.close();
  //   }, 250);
  // };

  // Download as PDF (using print to PDF)
  // const handleDownload = () => {
  //   if (!formData.supplierName || !formData.product || !formData.quantity) {
  //     showNotification("warning", "Incomplete Data", "Please fill in all required fields before downloading.");
  //     return;
  //   }

  //   showNotification("info", "Download", "Use your browser's 'Save as PDF' option in the print dialog.");
  //   handlePrint();
  // };

  // Generate print content
  const generatePrintContent = () => {
    const subtotal = (parseFloat(formData.quantity) * parseFloat(formData.unitPrice) || 0).toFixed(2);
    const taxAmount = formData.taxInclusive === "yes"
      ? (((parseFloat(formData.quantity) * parseFloat(formData.unitPrice)) * parseFloat(formData.tax)) / 100 || 0).toFixed(2)
      : "0.00";
    const balanceDue = (parseFloat(formData.totalAmount || 0) - parseFloat(formData.paidAmount || 0)).toFixed(2);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Purchase Order - ${formData.purchaseOrderNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 40px; 
            color: #333;
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
          }
          .header h1 { 
            color: #2563eb; 
            font-size: 32px;
            margin-bottom: 10px;
          }
          .header p { 
            color: #666; 
            font-size: 14px;
          }
          .info-section { 
            margin-bottom: 30px;
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
          }
          .info-section h2 { 
            color: #2563eb; 
            font-size: 18px;
            margin-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
          }
          .info-row { 
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child { border-bottom: none; }
          .info-label { 
            font-weight: bold;
            color: #666;
          }
          .info-value { 
            color: #333;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td { 
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          th { 
            background: #2563eb;
            color: white;
            font-weight: bold;
          }
          .total-section {
            margin-top: 30px;
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 16px;
          }
          .total-row.grand-total {
            border-top: 2px solid #2563eb;
            padding-top: 15px;
            margin-top: 10px;
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PURCHASE ORDER</h1>
          <p>Purchase Order Number: ${formData.purchaseOrderNumber}</p>
          <p>Date: ${new Date(formData.purchaseDate).toLocaleDateString()}</p>
        </div>

        <div class="info-section">
          <h2>Supplier Information</h2>
          <div class="info-row">
            <span class="info-label">Supplier Name:</span>
            <span class="info-value">${formData.supplierName}</span>
          </div>
        </div>

        <div class="info-section">
          <h2>Product Details</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${formData.product}</td>
                <td>${formData.variant || 'N/A'}</td>
                <td>${formData.quantity}</td>
                <td>₹${parseFloat(formData.unitPrice || 0).toFixed(2)}</td>
                <td>₹${subtotal}</td>
              </tr>
            </tbody>
          </table>
          ${formData.expiryDate ? `
          <div class="info-row">
            <span class="info-label">Expiry Date:</span>
            <span class="info-value">${new Date(formData.expiryDate).toLocaleDateString()}</span>
          </div>
          ` : ''}
        </div>

        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${subtotal}</span>
          </div>
          ${formData.taxInclusive === "yes" ? `
          <div class="total-row">
            <span>Tax (${formData.tax}%):</span>
            <span>₹${taxAmount}</span>
          </div>
          ` : ''}
          <div class="total-row grand-total">
            <span>Total Amount:</span>
            <span>₹${formData.totalAmount || '0.00'}</span>
          </div>
          <div class="total-row">
            <span>Paid Amount:</span>
            <span style="color: #10b981;">₹${parseFloat(formData.paidAmount || 0).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Balance Due:</span>
            <span style="color: ${parseFloat(balanceDue) > 0 ? '#ef4444' : '#10b981'};">₹${balanceDue}</span>
          </div>
        </div>

        <div class="footer">
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>This is a computer generated document</p>
        </div>
      </body>
      </html>
    `;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!formData.supplierName || !formData.product) {
      showNotification("warning", "Validation Error", "Please select a supplier and a product.");
      return;
    }

    if (!formData.variant || !formData.variantId) {
      showNotification("warning", "Validation Error", "Please select a variant.");
      return;
    }

    if (!formData.quantity || !formData.unitPrice) {
      showNotification("warning", "Validation Error", "Please enter quantity and unit price.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        purchaseOrderNumber: formData.purchaseOrderNumber,
        supplierName: formData.supplierName,
        product: formData.product,
        productId: formData.productId,
        variant: formData.variant,
        variantId: formData.variantId,
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
        tax: Number(formData.tax) || 0,
        totalAmount: Number(formData.totalAmount),
        paidAmount: Number(formData.paidAmount) || 0,
        purchaseDate: new Date(formData.purchaseDate),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
      };
      await savePurchase(payload);

      // 🆕 Update stock after saving purchase
      try {
        // Trigger a refresh on the products list after stock update
        window.dispatchEvent(new Event('productsUpdated'));
        console.log("✅ Stock updated successfully");
      } catch (error) {
        console.error("❌ Failed to update stock:", error);
        showNotification("warning", "Stock Update Failed", "Purchase saved but stock not updated.");
      }


      showNotification("success", "Purchase Saved!", `Purchase of ${formData.product} (${formData.variant}) saved successfully! Total: ₹${formData.totalAmount}`, 2500);

      // Reset form
      setFormData({
        purchaseOrderNumber: generatePONumber(),
        supplierName: "",
        product: "",
        productId: "",
        variant: "",
        variantId: "",
        quantity: "",
        unitPrice: "",
        tax: "",
        taxInclusive: "no",
        totalAmount: "",
        paidAmount: "",
        purchaseDate: new Date().toISOString().slice(0, 10),
        expiryDate: "",
      });
      setSupplierSearch("");
      setProductSearch("");
      setVariantSearch("");
      setVariants([]); // Clear variants after successful submission
    } catch (err) {
      console.error("Error saving purchase:", err);
      showNotification("error", "Error", "Failed to save purchase. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  // Filter functions
  const filteredSuppliers = suppliers.filter((s) =>
    s && s.name && s.name.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  const filteredProducts = products.filter((p) =>
    p && p.name && p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredVariants = variants.filter((v) =>
    v && (v.variantName || v.name).toLowerCase().includes(variantSearch.toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border max-w-md ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}>
            <div className="flex items-start gap-3">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />}
              {notification.type === 'warning' && <AlertCircle className="w-5 h-5 mt-0.5 text-yellow-600" />}
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm mt-1">{notification.message}</p>
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

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Add Purchase</h1>
                  <p className="text-blue-100 text-sm">Create and manage your purchase orders</p>
                </div>
              </div>
              <div className="flex gap-3">
                {/* <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                </button> */}
                <DownloadButton
                  downloadData={formData}
                  fileName={`Purchase-${formData.purchaseOrderNumber}`}
                  generateHtml={generatePrintContent}
                  showAlert={(title, message, type) => showNotification(type, title, message)}
                />

                <PrintButton
                  printData={formData}
                  generateHtml={generatePrintContent}
                  showAlert={(title, message, type) => showNotification(type, title, message)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Purchase Order Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Purchase Order Number
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="purchaseOrderNumber"
                      value={formData.purchaseOrderNumber}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Purchase Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Supplier Information
              </h2>
              <div className="space-y-2 relative dropdown-container">
                <label className="block text-sm font-medium text-gray-700">
                  Supplier Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                  <input
                    type="text"
                    value={supplierSearch}
                    onChange={(e) => handleSupplierSearchChange(e.target.value)}
                    onFocus={() => setSupplierDropdownOpen(true)}
                    placeholder="Search supplier..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white relative z-10"
                  />
                  {supplierDropdownOpen && (
                    <div className="absolute z-50 bg-white border border-gray-200 w-full max-h-60 overflow-y-auto mt-1 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5">
                      {filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map((supplier) => (
                          <div
                            key={supplier._id}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSupplierSelect(supplier);
                            }}
                            className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                          >
                            <span className="font-medium text-gray-900">{supplier.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">No suppliers found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Product Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2 relative dropdown-container">
                  <label className="block text-sm font-medium text-gray-700">
                    Product
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => handleProductSearchChange(e.target.value)}
                      onFocus={() => setProductDropdownOpen(true)}
                      placeholder="Search product..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white relative z-10"
                    />
                    {productDropdownOpen && (
                      <div className="absolute z-50 bg-white border border-gray-200 w-full max-h-60 overflow-y-auto mt-1 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <div
                              key={product._id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleProductSelect(product);
                              }}
                              className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                            >
                              <span className="font-medium text-gray-900">{product.name}</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">No products found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 relative dropdown-container">
                  <label className="block text-sm font-medium text-gray-700">
                    Variant
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <input
                      type="text"
                      value={variantSearch}
                      onChange={(e) => handleVariantSearchChange(e.target.value)}
                      onFocus={() => setVariantDropdownOpen(true)}
                      placeholder="Search variant..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white relative z-10"
                      disabled={!formData.product}
                    />
                    {variantDropdownOpen && formData.product && (
                      <div className="absolute z-50 bg-white border border-gray-200 w-full max-h-60 overflow-y-auto mt-1 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5">
                        {filteredVariants.length > 0 ? (
                          filteredVariants.map((variant) => {
                            console.log(variant);
                            console.log(variant._id);
                            return (
                              <div
                                key={variant._id}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleVariantSelect(variant);
                                }}
                                className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                              >
                                <span className="font-medium text-gray-900">{variant.variantName}</span>
                              </div>
                            )
                          }

                          )
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">No variants found</div>
                        )}
                      </div>
                    )}
                  </div>
                  {!formData.product && (
                    <p className="text-xs text-gray-500">Please select a product first</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      required
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-blue-600" />
                Pricing Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Purchased Price
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="unitPrice"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tax Inclusive
                  </label>
                  <select
                    name="taxInclusive"
                    value={formData.taxInclusive}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
               focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {formData.taxInclusive === "yes" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tax (%)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="tax"
                        value={formData.tax}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Amount
                  </label>
                  <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl font-semibold text-blue-800">
                    ₹{formData.totalAmount || '0.00'}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Paid Amount
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="paidAmount"
                      value={formData.paidAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                Purchase Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">
                      ₹{(parseFloat(formData.quantity) * parseFloat(formData.unitPrice) || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-semibold">
                      {formData.taxInclusive === "yes"
                        ? `₹${(((parseFloat(formData.quantity) * parseFloat(formData.unitPrice)) * parseFloat(formData.tax)) / 100 || 0).toFixed(2)}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-blue-50 rounded-xl px-4 border-2 border-blue-200">
                    <span className="text-lg font-bold text-blue-800">Total Amount:</span>
                    <span className="text-xl font-bold text-blue-800">₹{formData.totalAmount || '0.00'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Paid Amount:</span>
                    <span className="font-semibold text-green-600">₹{parseFloat(formData.paidAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Balance Due:</span>
                    <span className={`font-semibold ${(parseFloat(formData.totalAmount || 0) - parseFloat(formData.paidAmount || 0)) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{(parseFloat(formData.totalAmount || 0) - parseFloat(formData.paidAmount || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
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
                        Save Purchase
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}