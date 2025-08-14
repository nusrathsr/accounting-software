import React, { useState, useEffect } from "react";

export default function AddPurchase() {
  const sellers = ["ABC Traders", "XYZ Supplies", "Global Wholesale", "FastMart"];
  const products = [
    { name: "Laptop", price: 25000 },
    { name: "Mouse", price: 500 },
    { name: "Keyboard", price: 1200 },
    { name: "Monitor", price: 8000 },
  ];

  const [formData, setFormData] = useState({
    purchaseOrderNumber: "",
    sellerName: "",
    product: "",
    quantity: "",
    unitPrice: "",
    tax: "",
    totalAmount: "",
    purchaseDate: "",
  });

  const [sellerSearch, setSellerSearch] = useState("");
  const [sellerDropdownOpen, setSellerDropdownOpen] = useState(false);

  const [productSearch, setProductSearch] = useState("");
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  // Auto-generate Purchase Order Number
  useEffect(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({
      ...prev,
      purchaseOrderNumber: `PO-${new Date().getFullYear()}-${randomNum}`,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "quantity" || name === "unitPrice" || name === "tax") {
        const qty = parseFloat(updated.quantity) || 0;
        const price = parseFloat(updated.unitPrice) || 0;
        const taxPct = parseFloat(updated.tax) || 0;
        const total = qty * price + (qty * price * taxPct) / 100;
        updated.totalAmount = total.toFixed(2);
      }

      return updated;
    });
  };

  const handleSellerSelect = (name) => {
    setFormData((prev) => ({ ...prev, sellerName: name }));
    setSellerSearch(name);
    setSellerDropdownOpen(false);
  };

  const handleProductSelect = (product) => {
    setFormData((prev) => ({
      ...prev,
      product: product.name,
      unitPrice: product.price,
    }));
    setProductSearch(product.name);
    setProductDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingPurchases = JSON.parse(localStorage.getItem("purchases")) || [];
    const updatedPurchases = [...existingPurchases, formData];
    localStorage.setItem("purchases", JSON.stringify(updatedPurchases));

    alert("Purchase data submitted!");
    setFormData({
      purchaseOrderNumber: "",
      sellerName: "",
      product: "",
      quantity: "",
      unitPrice: "",
      tax: "",
      totalAmount: "",
      purchaseDate: "",
    });

    // Regenerate PO number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({
      ...prev,
      purchaseOrderNumber: `PO-${new Date().getFullYear()}-${randomNum}`,
    }));
  };

  return (
    <div className="p-6 w-full max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Purchase</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full"
      >
        {/* Row 1 */}
        <div className="flex flex-wrap space-x-4 mb-4">
          {/* Auto-generated Purchase Order Number */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Purchase Order Number
            </label>
            <input
              type="text"
              name="purchaseOrderNumber"
              value={formData.purchaseOrderNumber}
              readOnly
              className="shadow appearance-none border bg-gray-100 cursor-not-allowed rounded w-full py-2 px-3 text-gray-700 leading-tight"
            />
          </div>

          {/* Seller Dropdown */}
          <div className="flex-1 min-w-[200px] relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Seller Name
            </label>
            <div className="relative">
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
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setSellerDropdownOpen((prev) => !prev)}
              >
                ▼
              </button>
            </div>
            {sellerDropdownOpen && (
              <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto">
                {sellers
                  .filter((s) =>
                    s.toLowerCase().includes(sellerSearch.toLowerCase())
                  )
                  .map((s, i) => (
                    <li
                      key={i}
                      onClick={() => handleSellerSelect(s)}
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                    >
                      {s}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-wrap space-x-4 mb-4">
          {/* Product Dropdown */}
          <div className="flex-1 min-w-[200px] relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Product
            </label>
            <div className="relative">
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
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setProductDropdownOpen((prev) => !prev)}
              >
                ▼
              </button>
            </div>
            {productDropdownOpen && (
              <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto">
                {products
                  .filter((p) =>
                    p.name.toLowerCase().includes(productSearch.toLowerCase())
                  )
                  .map((p, i) => (
                    <li
                      key={i}
                      onClick={() => handleProductSelect(p)}
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                    >
                      {p.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Quantity */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex flex-wrap space-x-4 mb-4">
          {/* Purchased Price */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Purchased Price
            </label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>

          {/* Tax */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tax (%)
            </label>
            <input
              type="number"
              name="tax"
              value={formData.tax}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Total Amount
          </label>
          <input
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            readOnly
            className="shadow appearance-none border bg-gray-100 cursor-not-allowed rounded w-full py-2 px-3 text-gray-700 leading-tight"
          />
        </div>

        {/* Purchase Date */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Purchase Date
          </label>
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
