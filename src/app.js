const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const PORT = 3000;

// ✅ Middleware to parse incoming JSON
app.use(express.json());

// 🧩 POST: Add new user (Signup)
app.post('/signup', async (req, res) => {
   console.log(req.body); // For debugging
  const user = new User(req.body);

  try {
    await user.save(); // Save user to MongoDB
    res.status(201).send('✅ User added successfully');
  } catch (err) {
    res.status(400).send('❌ Error adding user: ' + err.message);
  }
});




// 🧩 GET: Fetch user by email ID
app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId; // Get email from request body

  try {
    const users = await User.findOne({ emailId: userEmail }); // Find single user
    if(!users){
      res.status(404).send("user not found");
    }else{
      res.send(users);
    }
    //const users = await User.find({ emailId: userEmail }); // Find all user
    if(users.length ===0){
      res.status(404).send("user not found")
    }
    res.send(users);
    }
     // Send user data as JSON
  catch (err) {
    res.status(400).send('❌ Something went wrong: ' + err.message);
  }
});





// 🧩 Feed API - GET / feed - get all the users from the database
app.get('/feed', async (req, res) => {
  try{
    const users = await User.find({});
    res.send(users);
  } catch(err){
res.status(400).send("Something went wrong");
  }
});


// 🗑️ Delete API
app.delete("/user", async (req, res) => {
  const userId = req.body.userId; // Expecting the userId in request body

  try {
    // Delete user by ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send("❌ User not found. Please check the ID.");
    }

    res.status(200).send("✅ User deleted successfully");
  } catch (err) {
    res.status(400).send("❌ Not able to delete the user. Error: " + err.message);
  }
});


//Update data of the user

// 🧩 Update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId; // ID of the user to update
  const data = req.body;          // Fields to update

try{
const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
const isUpdateAllowed = Object.keys(data).every(k => 
  ALLOWED_UPDATES.includes(k)
);
if(!isUpdateAllowed){
  throw new error("update not allowed")
}

  // ✅ Update the user by ID
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true, // Return the updated user document
      runValidators: true // Validate fields before updating
    });

    if (!updatedUser) {
      return res.status(404).send("❌ User not found, please check the ID");
    }

    res.status(200).json({
      message: "✅ User updated successfully",
      updatedUser
    });
  } catch (err) {
    res.status(400).send("❌ Update failed" + err.message);
  }
});





// 🧠 Connect DB, then start server
connectDB()
  .then(() => {
    console.log('✅ Database connection established...');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database cannot be connected:', err.message);
  });
