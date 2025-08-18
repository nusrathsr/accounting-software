import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../context/GlobalContext';
import axios from 'axios';


const AddProduct = () => {
  const [taxInclusive, setTaxInclusive] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [productId, setProductId] = useState("");
  const { suppliers,baseURL,loading } = useContext(GlobalContext);

  const [categories, setCategories] = useState([
    { name: 'clothing', subcategories: ['Shirts', 'T-Shirts', 'Pants', 'Kids Wear','top','dress','shawls'] },
    { name: 'grocery', subcategories: ['Fruits', 'Vegetables', 'Snacks', 'dairy products','spices',"essentials","cookware","dinnerware"] },
    { name: 'electronics', subcategories: ['Mobiles', 'Laptops', 'Chargers','speaker',"tv","washing machine","mixer grinder","refrigerator","fan","light","vacuum cleaner","headphones","oven","kettle","electric stove","intention cooker",] },
  ]);
console.log(suppliers);

  const [product, setProduct] = useState({
    name: '',
    category: '',
    subcategory: '',
    brand: '',
    sizes: [{ size: '', quantity: '' }],
    color: '',
    sellingPrice: '',
   purchasePrice: '',
    tax: '',
    expiryDate: '',
    supplier: '',
    image: null,          // store File instead of base64
    taxPercentage: "",
    taxType: "",
    productId: ""
  });

  // Generate product ID
  const generateProductId = () => {
    const prefix = "PROD";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNum}`;
  };

  useEffect(() => {
    const newId = generateProductId();
    setProductId(newId);
    setProduct(prev => ({ ...prev, productId: newId }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));

    if (name === 'category') {
      const selected = categories.find(cat => cat.name === value);
      setSubcategories(selected ? selected.subcategories : []);
      setProduct(prev => ({ ...prev, subcategory: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct(prev => ({ ...prev, image: file }));
    }
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...product.sizes];
    updated[index][field] = value;
    setProduct(prev => ({ ...prev, sizes: updated }));
  };

  const addSizeField = () => {
    setProduct(prev => ({ ...prev, sizes: [...prev.sizes, { size: '', quantity: '' }] }));
  };

  const removeSizeField = (index) => {
    const updated = product.sizes.filter((_, i) => i !== index);
    setProduct(prev => ({ ...prev, sizes: updated }));
  };

  // 🔹 Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (const key in product) {
        if (key === "sizes") {
          formData.append(key, JSON.stringify(product.sizes));
        } else if (key === "image") {
          if (product.image) formData.append("image", product.image);
        } else {
          formData.append(key, product[key]);
        }
      }

      const response = await axios.post(
        `${baseURL}/products`, // replace with your backend route
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Product added successfully!",response);
      setProduct({
        name: '',
        category: '',
        subcategory: '',
        brand: '',
        sizes: [{ size: '', quantity: '' }],
        color: '',
        sellingPrice: '',
        purchasePrice: '',
        tax: '',
        expiryDate: '',
        supplier: '',
        image: null,
        taxPercentage: "",
        taxType: "",
        productId: generateProductId()
      });
      setSubcategories([]);
      setTaxInclusive(false);

    } catch (error) {
      console.error(error);
      alert("Failed to add product. Please try again.",error);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded max-w-5xl mx-auto ">
      <h2 className="text-2xl font-bold mb-6 text-white-700">Add Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product ID */}
        <div>
          <label className="block font-medium" >Product ID</label>
          <input type="text" readOnly value={productId} className="w-full p-2 border bg-transparent rounded" />
        </div>

        {/* Product Name */}
        <div>
          <label className="block font-medium">Product Name *</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} required className="w-full p-2 border bg-transparent rounded" />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium">Category *</label>
          <select name="category" value={product.category} onChange={handleChange} required className="w-full p-2 border bg-transparent rounded">
            <option value="">Select</option>
            {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
          </select>
        </div>

        {/* Subcategory */}
        {subcategories.length > 0 && (
          <div>
            <label className="block font-medium">Subcategory *</label>
            <select name="subcategory" value={product.subcategory} onChange={handleChange} required className="w-full p-2 border bg-transparent rounded">
              <option value="">Select</option>
              {subcategories.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
            </select>
          </div>
        )}

        {/* Brand */}
        <div>
          <label className="block font-medium">Brand</label>
          <input type="text" name="brand" value={product.brand} onChange={handleChange} className="w-full p-2 border bg-transparent rounded" />
        </div>

        {/* Size-wise Stock */}
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

        {/* Color */}
        <div>
          <label className="block font-medium">Color</label>
          <input type="text" name="color" value={product.color} onChange={handleChange} className="w-full p-2 border rounded bg-transparent" />
        </div>

        {/* Selling Price */}
        <div>
          <label className="block font-medium">Selling Price *</label>
          <input type="number" name="sellingPrice" value={product.sellingPrice} onChange={handleChange} required className="w-full p-2 border rounded bg-transparent" />
        </div>

        {/*  purchasePrice*/}
        <div>
          <label className="block font-medium">purchasePrice</label>
          <input type="number" name="purchasePrice" value={product.purchasePrice} onChange={handleChange} className="w-full p-2 border rounded bg-transparent" />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block font-medium">Expiry Date</label>
          <input type="date" name="expiryDate" value={product.expiryDate} onChange={handleChange} className="w-full p-2 border rounded bg-transparent" />
        </div>

        {/* Supplier */}
        <div>
          <label className="block font-medium">Supplier *</label>
          <select name="supplier" value={product.supplier} onChange={handleChange}  className="w-full p-2 border rounded bg-transparent">
            <option value="">Select</option>
            {suppliers.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
          </select>
        </div> 

        {/* Tax Inclusive */}
        <div className="md:col-span-2">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" onChange={(e) => setTaxInclusive(e.target.checked)} />
            Tax Inclusive
          </label>
        </div>

        {taxInclusive && (
          <>
            <div>
              <label className="block font-medium">Tax Percentage</label>
              <input type="number" name="taxPercentage" value={product.taxPercentage} onChange={handleChange} className="w-full p-2 border rounded bg-transparent" />
            </div>
            <div>
              <label className="block font-medium">Tax Type</label>
              <select name="taxType" value={product.taxType} onChange={handleChange} className="w-full p-2 border rounded bg-transparent">
                <option value="">Select</option>
                <option value="GST IN">GST IN</option>
                <option value="VAT">VAT</option>
              </select>
            </div>
          </>
        )}

        {/* Product Image */}
        <div>
          <label className="block font-medium">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
          {product.image && <img src={URL.createObjectURL(product.image)} alt="Preview" className="w-32 h-32 mt-2 object-cover border rounded" />}
        </div>

        {/* Submit */}
        <div className="md:col-span-2 text-right mt-4">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
