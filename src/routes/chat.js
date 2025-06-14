
const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");
const chatRouter = express.Router();
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {

    const { targetUserId } = req.params;
    const userId = req.user;
    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        }).populate({ path: "message.senderId", select: "firstName lastName" });

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId], messages: []
            })
            await chat.save();
        }
        res.json(chat)

    } catch (error) {
        console.log(error)
    }

})



module.exports = chatRouter;