const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user');
const bcrypt = require("bcrypt")
const { validateSignupData } = require('./utils/validation')

app.use(express.json());


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
app.post("/login",async (req,res)=>{
    try {
        const {emailId,password} = req.body
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid = await  bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            res.send("login Successfully")
        }
        else{
            throw new Error("Invalid Credentials")
        }

    } catch (error) {
        res.status(400).send("Error:" + error.message)
    }
})

app.get("/user", async (req, res) => {
    try {
        const userEmail = req.body.emailId;
        const users = await User.find({ emailId: userEmail });
        if (users.length === 0) {
            res.status(400).send("user with email not found")
        }
        else {
            res.send(users)
        }

    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete({ _id: userId })
        res.send("user deleted successfully")
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    console.log(userId)
    const data = req.body;
    try {
        const ALLOWED_UPDATES = [
            "photoUrl", "about", "gender", "age", "skills"
        ]
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
        if (!isUpdateAllowed) {
            throw new Error("update not Allowed")
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "before", runValidators: true })
        console.log(user)
        res.send("user updated successfully")
    } catch (error) {
        res.status(400).send("update failed" + error.message)
    }
})

connectDB().then(() => {
    console.log("Database connection Established...")
    app.listen(3000, () => {
        console.log("successfully listening to port 3000")
    });

}).catch((err) => {
    console.log("Database cannot be connected", err)
})
