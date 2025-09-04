// const Category = require('../models/Category'); // Make sure your Category model exists

// // Get all categories
// exports.getAllCategories = async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch categories', error });
//   }
// };

// // Get a single category by ID
// exports.getCategoryById = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);
//     if (!category) return res.status(404).json({ message: 'Category not found' });
//     res.json(category);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch category', error });
//   }
// };

// // Add a new category
// exports.addCategory = async (req, res) => {
//   try {
//     const { name, subcategories } = req.body;
//     const category = new Category({ name, subcategories });
//     await category.save();
//     res.status(201).json(category);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create category', error });
//   }
// };

// // Update a category by ID
// exports.updateCategory = async (req, res) => {
//   try {
//     const { name, subcategories } = req.body;
//     const category = await Category.findByIdAndUpdate(
//       req.params.id,
//       { name, subcategories },
//       { new: true } // returns the updated document
//     );
//     if (!category) return res.status(404).json({ message: 'Category not found' });
//     res.json(category);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update category', error });
//   }
// };

// // Delete a category by ID
// exports.deleteCategory = async (req, res) => {
//   try {
//     const category = await Category.findByIdAndDelete(req.params.id);
//     if (!category) return res.status(404).json({ message: 'Category not found' });
//     res.json({ message: 'Category deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete category', error });
//   }
// };


const Category = require("../models/Category");

// ➕ Add Category
exports.addCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const newCategory = new Category({ name, description, status });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

// 📋 Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// ✏️ Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, status },
      { new: true } // returns updated doc
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ❌ Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
