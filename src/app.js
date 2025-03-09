const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user');
const bcrypt = require("bcrypt")
const { validateSignupData } = require('./utils/validation')
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")

app.use(express.json());
app.use(cookieParser())


app.post("/signup", async (req, res, next) => {
    try {
        // validate data
        validateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body

        //password encrypt
        const passwordhash = await bcrypt.hash(password, 10)

        const user = new User({ firstName, lastName, emailId, password: passwordhash })
        await user.save();
        res.send("Updated successfully")
    }
    catch (err) {
        res.status(400).send("Error saving the user:" + err.message)
    }

})
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid = await user.validatePassword(password)
        if (!isPasswordValid) {

            const token = await user.getJWT();
            res.cookie("token",token,{expires: new Date(Date.now()+8 *3600000)})
            res.send("login Successfully")
        }
        else {
            throw new Error("Invalid Credentials")
        }
    } catch (error) {
        res.status(400).send("Error:" + error.message)
    }
})

app.get("/profile",userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    }
    catch(err){
        res.send("Error:"+ err.message)
    }
})

app.post("/sendConnectionRequest",userAuth, async(req,res) =>{

    const user = req.user;
    res.send(user.firstName + "sent you connect request")

})

connectDB().then(() => {
    console.log("Database connection Established...")
    app.listen(3000, () => {
        console.log("successfully listening to port 3000")
    });

}).catch((err) => {
    console.log("Database cannot be connected", err)
})
