const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ⚠️ Use environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter a strong password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Gender data is not valid: " + value);
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // cleaner image placeholder
    },
    skills: {
      type: [String],
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// 🧩 Instance method to generate JWT token
userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign(
    { userId: user._id, emailId: user.emailId },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
};

// 🧩 Instance method to generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  // Save hashed token and expiry in DB
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes validity

  return token; // Return plain token (send this to user)
};

// 🧩 Create Model
const User = mongoose.model("User", userSchema);

module.exports = User;
