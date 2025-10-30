const validator = require("validator");

const validateSignUpData = (body) => {
  const { firstName, lastName, emailId, password } = body;

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

module.exports = { validateSignUpData };
