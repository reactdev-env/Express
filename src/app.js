const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

const app = express();
const PORT = 3000;

// ⚠️ Use .env in real apps
const JWT_SECRET = "mySuperSecretKey";

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

/**
 * 🧩 POST /signup — Register a new user
 */
app.post("/signup", async (req, res) => {
  try {
    // 1️⃣ Validate input data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("❌ Email already registered. Try logging in.");
    }

    // 3️⃣ Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4️⃣ Create and save user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();

    res.status(201).send("✅ User registered successfully");
  } catch (err) {
    res.status(400).send("❌ Error: " + err.message);
  }
});

/**
 * 🧩 POST /login — Login existing user
 */
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send("❌ Invalid email address");
    }

    // 2️⃣ Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("❌ Incorrect password");
    }

    // 3️⃣ Generate JWT
    const token = await user.getJWT();  //offloading this to the schema methods because we dont want to generate JWT token here.
    //generating the JWt in the userschema  is the best practice so we can generate it there, cleaner code

    // 4️⃣ Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true only for HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).send("✅ Login successful — JWT set in cookie");
  } catch (err) {
    res.status(400).send("❌ Error: " + err.message);
  }
});

/**
 * 🧩 GET /profile — Protected route (uses middleware)
 */
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      message: "✅ User profile fetched successfully",
      user,
    });
  } catch (err) {
    res.status(401).send("❌ Invalid or expired token: " + err.message);
  }
});

/**
 * 🧩 POST /sendConnectionRequest — Example protected route
 */
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(`${user.firstName} is sending a connection request...`);
    res.send(`${user.firstName} sent a connection request successfully`);
  } catch (err) {
    res.status(400).send("❌ Error sending connection request: " + err.message);
  }
});

/**
 * 🧩 GET /feed — Protected route (list all users)
 */
app.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).send("❌ No users found");
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(400).send("❌ Error fetching users: " + err.message);
  }
});

/**
 * 🗑️ DELETE /user — Delete user by ID
 */
app.delete("/user", userAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send("❌ userId is required.");
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("❌ User not found. Please check the ID.");
    }

    res.status(200).send("✅ User deleted successfully");
  } catch (err) {
    res.status(400).send("❌ Error deleting user: " + err.message);
  }
});

/**
 * 🧩 PATCH /user/:userId — Update user details
 */
app.patch("/user/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;

    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send("❌ Invalid fields in update request");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send("❌ User not found");
    }

    res.status(200).json({
      message: "✅ User updated successfully",
      updatedUser,
    });
  } catch (err) {
    res.status(400).send("❌ Update failed: " + err.message);
  }
});

/**
 * 🚪 POST /logout — Clear cookie
 */
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send("✅ Logged out successfully");
});

/**
 * 🧠 Connect to DB & Start Server
 */
connectDB()
  .then(() => {
    console.log("✅ Database connection established...");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database cannot be connected:", err.message);
  });
