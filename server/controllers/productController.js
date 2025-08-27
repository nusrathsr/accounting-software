const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");

// @desc    Add new product
exports.addProduct = async (req, res) => {
  try {
    const { productId, name, brand, category, stockStatus, variants } = req.body;

    if (!productId || !name || !category) {
      return res.status(400).json({ message: "Product ID, Name, and Category are required" });
    }

    const newProduct = new Product({
      productId,
      name,
      brand,
      category,
      stockStatus: stockStatus || "Active",
    });

    await newProduct.save();

    if (variants && variants.length > 0) {
      const variantIds = [];
      for (const v of variants) {
        const variant = new ProductVariant({
          ...v,
          product: newProduct._id
        });
        await variant.save();
        variantIds.push(variant._id);
      }
      newProduct.variants = variantIds;
      await newProduct.save();
    }

    const productWithVariants = await Product.findById(newProduct._id).populate('variants');
    res.status(201).json(productWithVariants);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
};
// @desc    Edit product
exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

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

// @desc    Get all products with their variants
exports.getAllProducts = async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find();

    // Fetch variants for each product
    const productsWithVariants = await Promise.all(
      products.map(async (prod) => {
        const variants = await ProductVariant.find({ product: prod._id });
        return { ...prod.toObject(), variants };
      })
    );

    res.json(productsWithVariants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
