const CustomerCategory = require("../models/CustomerCategory");

// Add new customer category
exports.addCustomerCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if already exists
    const existing = await CustomerCategory.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new CustomerCategory({
      name,
      description,
    });

    await newCategory.save();
    res.status(201).json({ message: "Customer category added successfully", category: newCategory });
  } catch (error) {
    console.error("Error adding customer category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all customer categories
exports.getCustomerCategories = async (req, res) => {
  try {
    const categories = await CustomerCategory.find().sort({ name: 1 }); // sorted alphabetically
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching customer categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
