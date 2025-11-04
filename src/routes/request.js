const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest"); // ✅ Import your model

const requestRouter = express.Router();

// ✅ Send connection request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;              // sender (logged in user)
    const toUserId = req.params.toUserId;         // receiver (other user)
    const status = req.params.status;             // status from URL (e.g., pending, accepted)

    const allowedStatus = ["ignored", "intrested"];
    if(!allowedStatus.includes(status)){
return res.status(400).send({message:"invalid status type" + status});
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        {fromUserId, toUserId},
        {fromUserId:toUserId, toUserId:fromUserId}, 
      ],
    });  
    
    
    // ✅ Create connection request document
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.status(201).json({
      message: "✅ Connection request sent successfully",
      data,
    });

  } catch (err) {
    res.status(400).send("❌ Error: " + err.message);
  }
});

module.exports = requestRouter;
