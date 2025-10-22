const express = require('express');
const app = express();
const PORT = 3000;

app.get("/userData",(req,res)=>{
    // Logic of DB call and get User Data
    try{
throw new Error("hedyuhe");
res.send("user data sent");
    }
    catch(err){
res.status(500).send("some Error contact support team");
    }
})

app.use("/userData", (err,req, res,next) => {
    if(err) {
        res.status(500).send("Something went wrong")
    }
  res.send("Deleted a User");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is successfully listening on port ${PORT}`);
});
