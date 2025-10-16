const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");
const multer = require("multer");

// Multer setup (temporary storage before Cloudinary upload)
const upload = multer({ dest: "uploads/" });

// Routes
router.post("/", upload.single("logo"), businessController.createBusiness);
router.get("/", businessController.getBusinesses);
router.get("/:id", businessController.getBusinessById);
router.put("/:id", upload.single("logo"), businessController.updateBusiness);
router.delete("/:id", businessController.deleteBusiness);

module.exports = router;
