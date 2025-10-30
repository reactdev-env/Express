const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  // 🧩 Check required fields
  if (!firstName || !lastName) {
    throw new Error("❌ First name and last name are required");
  }

  // 🧹 Trim names to remove spaces
  if (!firstName.trim() || !lastName.trim()) {
    throw new Error("❌ Name fields cannot be empty or spaces only");
  }

  // 📧 Validate Email
  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("❌ Please provide a valid email address");
  }

  // 🔐 Validate Password Strength
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error(
      "❌ Please provide a strong password (min 8 chars, uppercase, lowercase, number, symbol)"
    );
  }

  return true;
};

//Here the logoc for allowed fields to edit by the user //object keys are age,gender avi anni
// utils/validations.js

// 🧩 Function to validate which fields a user is allowed to edit
const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "about",
    "skills",
  ];

  // Check if all keys in req.body are within the allowed fields list
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

// ✅ Export the function so it can be imported elsewhere
module.exports = { validateSignUpData,validateEditProfileData };
