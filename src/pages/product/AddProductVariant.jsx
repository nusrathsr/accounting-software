import React, { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaBarcode, FaDollarSign, FaPercent, FaSave, FaArrowLeft, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { GlobalContext } from '../../context/GlobalContext';

const AddProductVariant = () => {
    const navigate = useNavigate();
    const { baseURL } = useContext(GlobalContext);

    const [products, setProducts] = useState([]);
    const [variantId, setVariantId] = useState('2100');
    const [productVariant, setProductVariant] = useState({
        product: '',
        variantName: '',
        size: '',
        quantity: '',
        sellingPrice: '',
        purchasePrice: '',
        taxInclusive: false,
        taxPercentage: '',
        taxType: '',
        gstNumber: '',
        image: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${baseURL}/products`);
                setProducts(res.data);
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Failed to fetch products from server', 'error');
            }
        };
        fetchProducts();
    }, [baseURL]);

    // Generate Variant ID
    useEffect(() => {
        const fetchLatestVariant = async () => {
            try {
                const res = await axios.get(`${baseURL}/variants/latest`);
                const lastId = res.data?.variantId || 2099;
                setVariantId((lastId + 1).toString());
            } catch {
                setVariantId('2100');
            }
        };
        fetchLatestVariant();
    }, [baseURL]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setProductVariant(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            setProductVariant(prev => ({ ...prev, image: files[0] }));
        } else {
            setProductVariant(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Required fields validation
        if (
            !productVariant.product ||
            !productVariant.variantName ||
            !productVariant.size ||
            !productVariant.quantity ||
            !productVariant.sellingPrice
        ) {
            Swal.fire('Error', 'Please fill all required fields', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // Map frontend field names to backend expected names
            formData.append('product', productVariant.product);
            formData.append('variantName', productVariant.variantName);
            formData.append('sizeOrWeight', productVariant.size); // <-- Must match backend
            formData.append('quantity', Number(productVariant.quantity));
            formData.append('sellingPrice', Number(productVariant.sellingPrice));
            formData.append('purchasePrice', Number(productVariant.purchasePrice || 0));
            formData.append('taxInclusive', productVariant.taxInclusive);
            if (productVariant.taxInclusive) {
                formData.append('taxPercentage', Number(productVariant.taxPercentage || 0));
                formData.append('taxType', productVariant.taxType);
                if (productVariant.gstNumber) {
                    formData.append('gstNumber', productVariant.gstNumber); // optional
                }
            }

            if (productVariant.image) {
                formData.append('image', productVariant.image);
            }

            await axios.post(`${baseURL}/variants`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Swal.fire('Success', 'Variant added successfully', 'success');

            // Reset form
            setProductVariant({
                product: '',
                variantName: '',
                size: '',
                quantity: '',
                sellingPrice: '',
                purchasePrice: '',
                taxInclusive: false,
                taxPercentage: '',
                taxType: '',
                gstNumber: '',
                image: null,
            });
        } catch (err) {
            console.error(err);
            Swal.fire('Error', err.response?.data?.message || 'Failed to add variant', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleCancel = () => navigate('/listProductVariant');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6 flex items-center gap-4">
                        <button
                            onClick={handleCancel}
                            className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            <FaBox className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">Add Product Variant</h1>
                            <p className="text-blue-100 text-sm">Add variant for your existing products</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Variant ID */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Variant ID</label>
                                <div className="relative">
                                    <FaBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        readOnly
                                        value={variantId}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 font-mono"
                                    />
                                </div>
                            </div>

                            {/* Product Dropdown */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Product <span className="text-red-500">*</span></label>
                                <select
                                    name="product"
                                    value={productVariant.product}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-white"
                                >
                                    <option value="">Select Product</option>
                                    {products.length === 0 ? (
                                        <option disabled>No products available</option>
                                    ) : (
                                        products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)
                                    )}
                                </select>
                            </div>

                            {/* Variant Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Variant Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="variantName"
                                    value={productVariant.variantName}
                                    onChange={handleChange}
                                    placeholder="e.g., Maggie 300gm"
                                    required
                                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-white transition-all duration-200"
                                />
                            </div>

                            {/* Size/Weight */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Size/Weight <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="size"
                                    value={productVariant.size}
                                    onChange={handleChange}
                                    placeholder="e.g., 300gm"
                                    required
                                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-white transition-all duration-200"
                                />
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Quantity <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={productVariant.quantity}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-white transition-all duration-200"
                                />
                            </div>

                            {/* Selling Price */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Selling Price <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="number"
                                        name="sellingPrice"
                                        value={productVariant.sellingPrice}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-white transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Purchase Price */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
                                <div className="relative">
                                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="number"
                                        name="purchasePrice"
                                        value={productVariant.purchasePrice}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-white transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Tax */}
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    name="taxInclusive"
                                    checked={productVariant.taxInclusive}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                />
                                <label className="text-sm font-medium text-gray-700">Tax Inclusive</label>
                            </div>

                            {productVariant.taxInclusive && (
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        name="taxPercentage"
                                        value={productVariant.taxPercentage}
                                        onChange={handleChange}
                                        placeholder="Tax %"
                                        className="pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-white transition-all duration-200"
                                    />
                                    <select
                                        name="taxType"
                                        value={productVariant.taxType}
                                        onChange={handleChange}
                                        className="pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-white transition-all duration-200"
                                    >
                                        <option value="">Select Tax Type</option>
                                        <option value="GST">GST</option>
                                        <option value="VAT">VAT</option>
                                    </select>
                                    {/* GST IN Number (Optional) */}
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        value={productVariant.gstNumber}
                                        onChange={handleChange}
                                        placeholder="GST IN Number (Optional)"
                                        className="col-span-2 pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-white transition-all duration-200"
                                    />
                                </div>
                            )}

                            {/* Product Image */}
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Product Image (Optional)</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {productVariant.image && (
                                        <img
                                            src={URL.createObjectURL(productVariant.image)}
                                            alt="Preview"
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 justify-center"
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : <><FaSave /> Add Variant</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductVariant;
