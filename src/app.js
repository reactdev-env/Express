const express = require('express');
const app = express();

// Define a port
const PORT = 3000;

app.use("/user",(req,res) => {
    res.send("sequence of order matters")
});

app.get("/user",(req,res) => {
    res.send({firstName:"Pavan",lastName:"Sai"})
});

app.post("/user", (req,res)=>{
    res.send("saved data to the database");

});

app.delete("/user", (req,res)=>{
    res.send("Data has deleted successfully");

})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is successfully listening on Hello ${PORT}`);
});
