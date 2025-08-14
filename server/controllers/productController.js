const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

// Helper: Generate SKU
const generateSKU = (name, category) => {
  const namePart = name.trim().slice(0, 3).toUpperCase();
  const categoryPart = category.trim().slice(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${namePart}-${categoryPart}-${randomNum}`;
};

// @desc    Add new product
exports.addProduct = async (req, res) => {
  try {
    let image = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      image = result.secure_url;
    }

    // Default size handling
    let size = req.body.sizes ? JSON.parse(req.body.sizes) : [];
    if (!size.length && req.body.quantity) {
      size = [{ size: "Default", quantity: parseInt(req.body.quantity) }];
    }

    const newProduct = new Product({
      productId: req.body.productId,
      sku: generateSKU(req.body.name, req.body.category),
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      category: req.body.category,
      subcategory: req.body.subcategory,
      supplier: req.body.supplier,
      purchasePrice: req.body.purchasePrice, // unchanged
      sellingPrice: req.body.sellingPrice,
      taxType: req.body.taxType,
      taxPercentage: req.body.taxPercentage,
      sizes: size,
      image: image,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// @desc    Edit product
exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      updateData.image = result.secure_url;
    }

    // Default size handling
    if (req.body.sizes) {
      updateData.sizes = JSON.parse(req.body.sizes);
    } else if (req.body.quantity) {
      updateData.sizes = [{ size: "Default", quantity: parseInt(req.body.quantity) }];
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// @desc    Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

// @desc    Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// @desc    Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
