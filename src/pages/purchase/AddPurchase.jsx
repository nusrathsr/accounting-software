import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddPurchase() {
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    purchaseOrderNumber: "",
    sellerName: "",
    product: "",
    quantity: "",
    unitPrice: "",
    tax: "",
    totalAmount: "",
    paidAmount: "",
    purchaseDate: "",
  });

  const [sellerSearch, setSellerSearch] = useState("");
  const [sellerDropdownOpen, setSellerDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch sellers
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/customers/sellers");
        setSellers(res.data);
      } catch (err) {
        console.error("Error fetching sellers:", err);
      }
    };
    fetchSellers();
  }, []);

  // Generate PO number
  useEffect(() => {
    generatePONumber();
  }, []);

  const generatePONumber = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({
      ...prev,
      purchaseOrderNumber: `PO-${new Date().getFullYear()}-${randomNum}`,
    }));
  };

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
  const handleSellerSelect = (name) => {
    setFormData((prev) => ({ ...prev, sellerName: name }));
    setSellerSearch(name);
    setSellerDropdownOpen(false);
  };

  // Select product
  const handleProductSelect = (product) => {
    setFormData((prev) => ({ ...prev, product: product.name }));
    setProductSearch(product.name);
    setProductDropdownOpen(false);
    const currentStock = product.sizes && product.sizes.length > 0 ? product.sizes[0].quantity : 0;
    alert(`Current stock of ${product.name}: ${currentStock}`);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sellerName || !formData.product) {
      alert("Please select a seller and a product.");
      return;
    }

    try {
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

      await axios.post("http://localhost:4000/api/purchases", payload);
      fetchProducts();
      alert("✅ Purchase saved to MongoDB!");

      // Reset form
      setFormData({
        purchaseOrderNumber: "",
        sellerName: "",
        product: "",
        quantity: "",
        unitPrice: "",
        tax: "",
        totalAmount: "",
        paidAmount: "",
        purchaseDate: "",
      });
      setSellerSearch("");
      setProductSearch("");
      generatePONumber();
    } catch (err) {
      console.error("❌ Error saving purchase:", err.response?.data || err);
      alert("Failed to save purchase.");
    }
  };

  return (
    <div className="p-6 w-full max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Purchase</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full">
        {/* Row 1: PO & Seller */}
        <div className="flex flex-wrap space-x-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">Purchase Order Number</label>
            <input
              type="text"
              name="purchaseOrderNumber"
              value={formData.purchaseOrderNumber}
              readOnly
              className="shadow appearance-none border bg-gray-100 cursor-not-allowed rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="flex-1 min-w-[200px] relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">Seller Name</label>
            <input
              type="text"
              value={sellerSearch}
              onChange={(e) => {
                setSellerSearch(e.target.value);
                setSellerDropdownOpen(true);
              }}
              onFocus={() => setSellerDropdownOpen(true)}
              placeholder="Search seller..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
            {sellerDropdownOpen && (
              <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto">
                {sellers
                  .filter((s) => s.name.toLowerCase().includes(sellerSearch.toLowerCase()))
                  .map((s) => (
                    <li
                      key={s._id}
                      onClick={() => handleSellerSelect(s.name)}
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                    >
                      {s.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* Row 2: Product & Quantity */}
        <div className="flex flex-wrap space-x-4 mb-4">
          <div className="flex-1 min-w-[200px] relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">Product</label>
            <input
              type="text"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setProductDropdownOpen(true);
              }}
              onFocus={() => setProductDropdownOpen(true)}
              placeholder="Search product..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
            {productDropdownOpen && (
              <ul className="absolute z-10 bg-white border w-full max-h-60 overflow-y-auto">
                {products
                  .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                  .map((p) => (
                    <li
                      key={p._id}
                      onClick={() => handleProductSelect(p)}
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                    >
                      {p.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
              min={0}
            />
          </div>
        </div>

        {/* Row 3: Price & Tax */}
        <div className="flex flex-wrap space-x-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">Purchased Price</label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
              min={0}
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">Tax (%)</label>
            <input
              type="number"
              name="tax"
              value={formData.tax}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              min={0}
            />
          </div>
        </div>

        {/* Row 4: Total & Paid */}
        <div className="flex flex-wrap space-x-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">Total Amount</label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              readOnly
              className="shadow appearance-none border bg-gray-100 cursor-not-allowed rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">Paid Amount</label>
            <input
              type="number"
              name="paidAmount"
              value={formData.paidAmount}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              min={0}
            />
          </div>
        </div>

        {/* Purchase Date */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            required
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
