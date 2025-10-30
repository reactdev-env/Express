const express = require('express');
const {userAuth} = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    const user = req.user;

    //sending the connection request 
    console.log("sending the conenction request");
    res.send(user.firstname + "send teh connection request");

});


module.exports = requestRouter;