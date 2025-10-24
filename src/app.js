const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const PORT = 3000;

// ✅ Middleware to parse incoming JSON
app.use(express.json());

// 🧩 POST: Add new user (Signup)
app.post('/signup', async (req, res) => {
  // console.log(req.body); // For debugging
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
