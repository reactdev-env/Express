// routes/profile.js
const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validations");
const {validateForgotPassword} = require("../utils/validations");
const {validateResetPassword} = require("../utils/validations");

// ✅ Protected profile route
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // userAuth middleware should attach the user to req.user
    const user = req.user;
res.send(user);
  }
  catch(err){
    res.status(400).send("Error: " + err.message);
  }
    
});

// 🧩 PATCH route for editing user profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // 1️⃣ Validate fields before updating
    if (!validateEditProfileData(req)) {
      throw new Error("❌ Invalid edit request. Some fields are not allowed to be updated.");
    }

    // 2️⃣ Get logged-in user from the request (added by userAuth middleware)
    const loggedInUser = req.user;

    // 3️⃣ Update allowed fields dynamically
    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });

    // 4️⃣ Save updated user data
    await loggedInUser.save();

    res.status(200).json({
      success: true,
      message: "✅ Profile updated successfully",
      updatedProfile: loggedInUser,
    });
  } catch (err) {
    console.error("Profile edit error:", err.message);
    res.status(400).json({
      success: false,
      message: "❌ Error: " + err.message,
    });
  }
})

module.exports = profileRouter;
