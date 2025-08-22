import React, { useState, useEffect } from "react";
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
  Truck
} from "lucide-react";

export default function AddPurchase() {
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    purchaseOrderNumber: "",
    sellerName: "",
    product: "",
    quantity: "",
    unitPrice: "",
    tax: "",
    totalAmount: "",
    paidAmount: "",
    purchaseDate: new Date().toISOString().slice(0, 10),
  });

  const [sellerSearch, setSellerSearch] = useState("");
  const [sellerDropdownOpen, setSellerDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

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
    
    getSellers: async () => {
      try {
        const response = await fetch("http://localhost:4000/api/customers/sellers");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
        throw error;
      }
    },

    savePurchase: async (data) => {
      try {
        const response = await fetch("http://localhost:4000/api/purchases", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      } catch (error) {
        console.error("Failed to save purchase:", error);
        throw error;
      }
    }
  };

  // Fetch products and sellers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, sellersData] = await Promise.all([
          api.getProducts(),
          api.getSellers()
        ]);
        setProducts(productsData);
        setSellers(sellersData);
      } catch (err) {
        console.error("Error fetching data:", err);
        showNotification("error", "Error", "Failed to fetch data. Please check server connection.");
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
        setSellerDropdownOpen(false);
        setProductDropdownOpen(false);
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

      if (["quantity", "unitPrice", "tax"].includes(name)) {
        const qty = parseFloat(updated.quantity) || 0;
        const price = parseFloat(updated.unitPrice) || 0;
        const taxPct = parseFloat(updated.tax) || 0;
        updated.totalAmount = (qty * price + (qty * price * taxPct) / 100).toFixed(2);
      }

      return updated;
    });
  };

  // Select seller
  const handleSellerSelect = (seller) => {
    setFormData((prev) => ({ ...prev, sellerName: seller.name }));
    setSellerSearch(seller.name);
    setSellerDropdownOpen(false);
  };

  // Select product
  const handleProductSelect = (product) => {
    setFormData((prev) => ({ ...prev, product: product.name }));
    setProductSearch(product.name);
    setProductDropdownOpen(false);
  };

  // Handle seller search
  const handleSellerSearchChange = (value) => {
    setSellerSearch(value);
    setFormData((prev) => ({ ...prev, sellerName: value }));
    setSellerDropdownOpen(true);
  };

  // Handle product search
  const handleProductSearchChange = (value) => {
    setProductSearch(value);
    setFormData((prev) => ({ ...prev, product: value }));
    setProductDropdownOpen(true);
  };

  // Submit form
  const handleSubmit = async () => {
    if (!formData.sellerName || !formData.product) {
      showNotification("warning", "Validation Error", "Please select a seller and a product.");
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
        sellerName: formData.sellerName,
        product: formData.product,
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
        tax: Number(formData.tax) || 0,
        totalAmount: Number(formData.totalAmount),
        paidAmount: Number(formData.paidAmount) || 0,
        purchaseDate: new Date(formData.purchaseDate),
      };

      await api.savePurchase(payload);
      
      showNotification("success", "Purchase Saved!", `Purchase of ${formData.product} saved successfully! Total: ₹${formData.totalAmount}`, 2500);

      // Reset form
      setFormData({
        purchaseOrderNumber: generatePONumber(),
        sellerName: "",
        product: "",
        quantity: "",
        unitPrice: "",
        tax: "",
        totalAmount: "",
        paidAmount: "",
        purchaseDate: new Date().toISOString().slice(0, 10),
      });
      setSellerSearch("");
      setProductSearch("");
    } catch (err) {
      console.error("Error saving purchase:", err);
      showNotification("error", "Error", "Failed to save purchase. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  // Filter functions
  const filteredSellers = sellers.filter((s) =>
    s.name.toLowerCase().includes(sellerSearch.toLowerCase())
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
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
                Seller Information
              </h2>
              <div className="space-y-2 relative dropdown-container">
                <label className="block text-sm font-medium text-gray-700">
                  Seller Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                  <input
                    type="text"
                    value={sellerSearch}
                    onChange={(e) => handleSellerSearchChange(e.target.value)}
                    onFocus={() => setSellerDropdownOpen(true)}
                    placeholder="Search seller..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white relative z-10"
                  />
                  {sellerDropdownOpen && (
                    <div className="absolute z-50 bg-white border border-gray-200 w-full max-h-60 overflow-y-auto mt-1 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5">
                      {filteredSellers.length > 0 ? (
                        filteredSellers.map((seller) => (
                          <div
                            key={seller._id}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSellerSelect(seller);
                            }}
                            className="cursor-pointer px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                          >
                            <span className="font-medium text-gray-900">{seller.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">No sellers found</div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Unit Price
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
                      ₹{(((parseFloat(formData.quantity) * parseFloat(formData.unitPrice)) * parseFloat(formData.tax)) / 100 || 0).toFixed(2)}
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