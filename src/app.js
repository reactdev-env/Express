const express = require('express');
const connectDB = require('./config/database');
const app = express();
const PORT = 3000;
const User = require("./models/user")
//const User = require("./models/user1")



app.post("/signup", async (req,res)=>{
//creating a new instance of the User Model
const user = new User({
  
  firstName:"Virat",
  lastName:"Kohli",
  emailID:"VK@gmail.com",
  password:"VK@456789"
});

//Best method always we need to use error handling

try{
await user.save();   //saving the user to the database
res.send("User added successfully")   //getting the response back  
}catch(err){
  res.status(400).send("Error adding user " + err.message)
}
});



// Start server
connectDB()
  .then(() => {
    console.log("✅ Database connection established...");
    app.listen(PORT, () => {
      console.log(`🚀 Server is successfully listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database cannot be connected...", err.message);
  });
