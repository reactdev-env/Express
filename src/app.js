const express = require('express');
const app = express();

// Define a port
const PORT = 3000;

// Middleware to handle all routes
app.use("/test",(req, res) => {
  res.send("Hello from the server");
});

app.use("/home",(req,res)=>{
res.send("Welcome to the Home Page!")
});

app.use("/Contactus",(req,res)=>{
    res.send("Welcome to the contact us page");
})

app.use("/cart",(req,res)=>{
    res.send("welcome to the cart page");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is successfully listening on Hello ${PORT}`);
});
