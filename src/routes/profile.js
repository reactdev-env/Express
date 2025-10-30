// routes/profile.js
const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

// ✅ Protected profile route
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    // userAuth middleware should attach the user to req.user
    const user = req.user;
res.send(user);
  }
  catch(err){
    res.status(400).send("Error: " + err.message);
  }
    
});

module.exports = profileRouter;
