const Business = require("../models/Business");
const cloudinary = require("../utils/cloudinary");

// @desc Create new business with logo upload
exports.createBusiness = async (req, res) => {
  try {
    const data = req.body;

    let logoUrl = null;

    // If logo file uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "business_logos",
      });
      logoUrl = result.secure_url;
    }

    const newBusiness = new Business({
      ...data,
      logo: logoUrl,
    });

    const saved = await newBusiness.save();
    res.status(201).json({ message: "Business created successfully", business: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create business", error: error.message });
  }
};

// @desc Get all businesses
exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });
    res.json(businesses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch businesses" });
  }
};

// @desc Get single business
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.json(business);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch business" });
  }
};

// @desc Update business info (and optionally update logo)
exports.updateBusiness = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "business_logos",
      });
      updates.logo = result.secure_url;
    }

    const updated = await Business.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Business not found" });

    res.json({ message: "Business updated successfully", business: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update business" });
  }
};

// @desc Delete business
exports.deleteBusiness = async (req, res) => {
  try {
    const deleted = await Business.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Business not found" });

    res.json({ message: "Business deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete business" });
  }
};
