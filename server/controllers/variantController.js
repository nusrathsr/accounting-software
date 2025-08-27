// const Product = require("../models/Product");
// const ProductVariant = require("../models/ProductVariant");
// const cloudinary = require("../utils/cloudinary");

// // Helper: Generate Variant ID starting from 2100
// const generateVariantId = async () => {
//   const lastVariant = await ProductVariant.findOne().sort({ createdAt: -1 });
//   let nextNumber = 2100;
//   if (lastVariant && lastVariant.variantId) {
//     const numPart = parseInt(lastVariant.variantId.split("-")[1]);
//     if (!isNaN(numPart)) nextNumber = numPart + 1;
//   }
//   return `VAR-${nextNumber}`;
// };

// // @desc Add Product Variant
// exports.addProductVariant = async (req, res) => {
//   try {
//     const {
//       product, // the main product _id
//       variantName,
//       sizeOrWeight,
//       quantity,
//       sellingPrice,
//       purchasePrice,
//       taxInclusive,
//       taxPercentage,
//       taxType
//     } = req.body;

//     if (!product || !variantName || !sizeOrWeight || !quantity || !sellingPrice || !purchasePrice) {
//       return res.status(400).json({ message: "Required fields missing" });
//     }

//     // Check if product exists
//     const productData = await Product.findById(product);
//     if (!productData) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Upload image if provided
//     let imageUrl = null;
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "product_variants",
//       });
//       imageUrl = result.secure_url;
//     }

//     // Generate Variant ID
//     const variantId = await generateVariantId();

//     const newVariant = new ProductVariant({
//       variantId,
//       product: product,
//       variantName,
//       sizeOrWeight,
//       quantity,
//       sellingPrice,
//       purchasePrice,
//       taxInclusive: taxInclusive || false,
//       taxPercentage,
//       taxType,
//       image: imageUrl,
//     });

//     await newVariant.save();
//     res.status(201).json(newVariant);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to add product variant", error: err.message });
//   }
// };

// // @desc Get all variants of a product
// exports.getProductVariants = async (req, res) => {
//   try {
//     const { id } = req.params; // product id
//     const variants = await ProductVariant.find({ product: id });
//     res.json(variants);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch variants" });
//   }
// };

// // @desc Get latest variant ID
// exports.getLatestVariantId = async (req, res) => {
//   try {
//     const variantId = await generateVariantId();
//     res.json({ variantId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to get latest variant ID" });
//   }
// };


const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const cloudinary = require("../utils/cloudinary");

// Helper: Generate Variant ID starting from 2100
const generateVariantId = async () => {
  const lastVariant = await ProductVariant.findOne().sort({ createdAt: -1 });
  let nextNumber = 2100;
  if (lastVariant && lastVariant.variantId) {
    const numPart = parseInt(lastVariant.variantId.split("-")[1]);
    if (!isNaN(numPart)) nextNumber = numPart + 1;
  }
  return `VAR-${nextNumber}`;
};

// @desc Add Product Variant
exports.addProductVariant = async (req, res) => {
  try {
    const {
      product, // product _id
      variantName,
      sizeOrWeight,
      quantity,
      sellingPrice,
      purchasePrice,
      taxInclusive,
      taxPercentage,
      taxType
    } = req.body;

    if (!product || !variantName || !sizeOrWeight || !quantity || !sellingPrice || !purchasePrice) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Check if product exists
    const productData = await Product.findById(product);
    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Upload image if provided
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "product_variants",
      });
      imageUrl = result.secure_url;
    }

    // Generate Variant ID
    const variantId = await generateVariantId();

    const newVariant = new ProductVariant({
      variantId,
      product,
      variantName,
      sizeOrWeight,
      quantity,
      sellingPrice,
      purchasePrice,
      taxInclusive: taxInclusive || false,
      taxPercentage,
      taxType,
      image: imageUrl,
    });

    await newVariant.save();

    // Return product + all its variants (for immediate frontend update)
    const variants = await ProductVariant.find({ product }).lean();
    res.status(201).json({ product: productData, variants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product variant", error: err.message });
  }
};

// @desc Get all variants of a product (with product info)
exports.getProductVariants = async (req, res) => {
  try {
    const { id } = req.params; // product id
    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variants = await ProductVariant.find({ product: id }).lean();
    res.json({ product, variants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch variants" });
  }
};

// @desc Get latest variant ID
exports.getLatestVariantId = async (req, res) => {
  try {
    const variantId = await generateVariantId();
    res.json({ variantId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get latest variant ID" });
  }
};
