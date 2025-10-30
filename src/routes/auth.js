const express = require("express");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validations");
const User = require("../models/user");

// 🟩 SIGNUP ROUTE
authRouter.post("/signup", async (req, res) => {
  try {
    console.log("Incoming body:", req.body); // 👀 Debug log

    // Check if body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "❌ No request body received. Ensure Content-Type is application/json.",
      });
    }

    // 1️⃣ Validate input
    validateSignUpData(req.body);
    const { firstName, lastName, emailId, password } = req.body;

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "❌ Email already registered. Try logging in.",
      });
    }

    // 3️⃣ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4️⃣ Save user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: "✅ User registered successfully",
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(400).json({
      success: false,
      message: "❌ Error: " + err.message,
    });
  }
});


// 🟨 LOGIN ROUTE
authRouter.post("/login", async (req, res) => {
  try {
    console.log("Login body:", req.body);

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "❌ Missing request body. Send JSON with emailId and password.",
      });
    }

    const { emailId, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "❌ Invalid email address",
      });
    }

    // 2️⃣ Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "❌ Incorrect password",
      });
    }

    // 3️⃣ Generate JWT (method from user schema)
    const token = await user.getJWT();

    // 4️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true for HTTPS in prod
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      success: true,
      message: "✅ Login successful — JWT set in cookie",
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(400).json({
      success: false,
      message: "❌ Error: " + err.message,
    });
  }
});

// LOGOUT ROUTE
authRouter.post("/logout",async(req,res)=>{
  res.cookie("token",null,{
    expires:new Date(Date.now()),
  });
  res.send("logout successfull");
})

module.exports = authRouter;
