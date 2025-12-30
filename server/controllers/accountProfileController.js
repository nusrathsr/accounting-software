const AccountProfile = require("../models/AccountProfile");

// 📌 Auto generate ID
const generateAccountId = async () => {
  const count = await AccountProfile.countDocuments();
  return "AC" + String(count + 1).padStart(4, "0");
};

// ➕ Create Account Profile
exports.createProfile = async (req, res) => {
  try {
    const accountId = await generateAccountId();

    const profile = new AccountProfile({
      ...req.body,
      accountId,
    });

    await profile.save();

    res.json({ success: true, message: "Account profile created", profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 Get All Profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await AccountProfile.find({}).sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 Get Profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const profile = await AccountProfile.findById(req.params.id);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏ Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const updated = await AccountProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, message: "Updated successfully", updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete Profile
exports.deleteProfile = async (req, res) => {
  try {
    await AccountProfile.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Profile deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
