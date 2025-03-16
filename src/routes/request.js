const express = require("express")
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:touserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.touserId;
        const status = req.params.status

        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(allowedStatus)) {
            return res.status(400).json({ message: "Invalid Status type :" + status })
        }
        

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message:"User not found!"})
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if(existingConnectionRequest){
            return res.status(400).send({message: "Connection Request Already Exist"})
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save();

        res.json({ message: req.user.firstName + "is"+ status+ "in"+ toUser.firstName, data })

    } catch (error) {
        res.status(400).send("ERROR" + error.message)
    }
})

module.exports = requestRouter;