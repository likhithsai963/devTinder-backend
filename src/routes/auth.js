const express = require('express')

const authRouter = express.Router();
const { validateSignupData } = require('../utils/validation')
const User = require('../models/user');
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');


authRouter.post("/signup", async (req, res, next) => {
    try {
        // validate data
        validateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body

        //password encrypt
        const passwordhash = await bcrypt.hash(password, 10)

        const user = new User({ firstName, lastName, emailId, password: passwordhash })
        await user.save();
        res.send("User added successfully")
    }
    catch (err) {
        res.status(400).send("Error saving the user:" + err.message)
    }

})
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) })
            res.send("login Successfully")
        }
        else {
            throw new Error("Invalid Credentials")
        }
    } catch (error) {
        res.status(400).send("Error:" + error.message)
    }
})
authRouter.post("/logout", (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.send("loggged out sucessfully");

})


module.exports = authRouter;