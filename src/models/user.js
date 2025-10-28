const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// ⚠️ Use environment variables in production instead of hardcoding
const JWT_SECRET = "mySuperSecretKey";

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
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// 🧩 Instance Method to Generate JWT Token
//These are known as userSchema methods, so we can write the passwod brcrypt also here to bcrypt the password for understanding 
//I wrote in app.js
userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign(
    { userId: user._id, emailId: user.emailId },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
};

// 🧩 Create Model
const User = mongoose.model("User", userSchema);

module.exports = User;
