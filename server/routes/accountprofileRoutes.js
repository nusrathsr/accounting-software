const express = require("express");
const {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} = require("../controllers/accountProfileController");

const router = express.Router();

// 1️⃣ Create profile
router.post("/", createProfile);

// 2️⃣ Get all profiles
router.get("/", getAllProfiles);

// 3️⃣ Get single profile
router.get("/:id", getProfileById);

// 4️⃣ Update profile
router.put("/:id", updateProfile);

// 5️⃣ Delete profile
router.delete("/:id", deleteProfile);

module.exports = router;
