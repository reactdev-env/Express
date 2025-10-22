const express = require('express');
const app = express();
const PORT = 3000;

const {adminAuth, userAuth} = require("./middlewares/auth")

// Middleware for /admin routes
app.use("/admin", adminAuth);


// Routes protected by middleware
app.get("/admin/getAllData", (req, res) => {
  res.send("All Data Sent Successfully");
});

app.get("/user/data",userAuth,(req,res)=>{
    res.send("user data send")
})
app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted a User");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is successfully listening on port ${PORT}`);
});
