import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom'; // assuming you're using React Router

const EditProduct = () => {
  const { id } = useParams(); // to get product ID from URL if needed
    const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'ABC Distributors' },
    { id: 2, name: 'Global Suppliers Co.' },
    { id: 3, name: 'FreshMart Wholesale' },
    { id: 4, name: 'TechZone Inc.' },
  ]);

  const [categories, setCategories] = useState([

    {
      name: 'clothing',
      subcategories: ['Shirts', 'T-Shirts', 'Pants', 'Kids Wear'],
    },
    {
      name: 'grocery',

      subcategories: ['Fruits', 'Vegetables', 'Snacks', 'dairy products'],

    },
    {
      name: 'electronics',
      subcategories: ['Mobiles', 'Laptops', 'Chargers'],
    },

  ]);

  const [subcategories, setSubcategories] = useState([]);

  // Simulate product load
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // TODO: Fetch product by `id` from API or mock
    const fetchedProduct = {
      name: 'iPhone 14',
      category: 'electronics',
      subcategory: 'Mobiles',
      brand: 'Apple',
      sizes: [], // electronics might not need sizes
      color: 'Black',
      sellingPrice: '999',
      costPrice: '850',
      tax: '18',
      expiryDate: '',
      supplier: 'TechZone Inc.',
      image: '',
    };

    setProduct(fetchedProduct);

    // Set subcategories

    const selected = categories.find((cat) => cat.name === fetchedProduct.category);
    setSubcategories(selected ? selected.subcategories : []);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));

    if (name === 'category') {
      const selected = categories.find((cat) => cat.name === value);
      setSubcategories(selected ? selected.subcategories : []);
      setProduct((prev) => ({ ...prev, subcategory: '' }));
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };


  const handleSizeChange = (index, field, value) => {
    const updated = [...product.sizes];
    updated[index][field] = value;
    setProduct((prev) => ({ ...prev, sizes: updated }));
  };

  const addSizeField = () => {

    setProduct((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', quantity: '' }],
    }));

  };

  const removeSizeField = (index) => {
    const updated = product.sizes.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, sizes: updated }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Product:', product);

    // TODO: send update request to backend
  };

  if (!product) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="p-6 shadow rounded max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white-700">Edit Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Product Name *</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} required className="w-full p-2 border bg-transparent rounded" />
        </div>

        <div>
          <label className="block font-medium">Category *</label>
          <select name="category" value={product.category} onChange={handleChange} required className="w-full p-2 border bg-transparent rounded">
            <option value="">Select</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {subcategories.length > 0 && (
          <div>
            <label className="block font-medium">Subcategory *</label>
            <select name="subcategory" value={product.subcategory} onChange={handleChange} required className="w-full p-2 border bg-transparent rounded">
              <option value="">Select</option>
              {subcategories.map((sub, i) => (
                <option key={i} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block font-medium">Brand</label>
          <input type="text" name="brand" value={product.brand} onChange={handleChange} className="w-full p-2 border bg-transparent rounded" />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Size-wise Stock</label>
          {product.sizes.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 mb-2">
              <input type="text" placeholder="Size" value={item.size} onChange={(e) => handleSizeChange(index, 'size', e.target.value)} className="p-2 border rounded bg-transparent w-full md:w-1/2" />
              <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleSizeChange(index, 'quantity', e.target.value)} className="p-2 border rounded bg-transparent w-full md:w-1/2" />
              <button type="button" onClick={() => removeSizeField(index)} className="text-red-600">✕</button>
            </div>
          ))}
          <button type="button" onClick={addSizeField} className="text-blue-600 mt-1 underline">+ Add Size</button>
        </div>

        <div>
          <label className="block font-medium">Color</label>
          <input type="text" name="color" value={product.color} onChange={handleChange} className="w-full p-2 border rounded bg-transparent" />
        </div>

        <div>
          <label className="block font-medium">Selling Price *</label>
          <input type="number" name="sellingPrice" value={product.sellingPrice} onChange={handleChange} required className="w-full p-2 border rounded bg-transparent" />
        </div>

        <div>
          <label className="block font-medium">Cost Price</label>
          <input type="number" name="costPrice" value={product.costPrice} onChange={handleChange} className="w-full p-2 border rounded bg-transparent" />
        </div>

        <div>
          <label className="block font-medium">Tax (%)</label>
          <input type="number" name="tax" value={product.tax} onChange={handleChange} className="w-full p-2 border rounded bg-transparent" />
        </div>

        <div>
          <label className="block font-medium">Expiry Date</label>
          <input type="date" name="expiryDate" value={product.expiryDate} onChange={handleChange} className="w-full p-2 border rounded bg-transparent" />
        </div>

         <div>
          <label className="block font-medium">Supplier</label>
          <select
            name="supplier"
            value={product.supplier}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-transparent"
          >
            <option value="">Select</option>
            {suppliers.map((supplier) => (
              <option key={supplier.name} value={supplier.name}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
          {product.image && <img src={product.image} alt="Preview" className="w-32 h-32 mt-2 object-cover border rounded bg-transparent" />}
        </div>

        <div className="md:col-span-2 text-right mt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update</button>
        </div>
      </form>

    </div>
  );
};

export default EditProduct;
