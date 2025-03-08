const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user');

app.use(express.json());


app.post("/signup", async (req, res, next) => {

    // console.log(req.body)
    const user = new User(req.body)
    try {
        await user.save();
        res.send("Updated successfully")
    }
    catch (err) {
        res.status(400).send("Error saving the user:" + err.message)
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
        const user = await User.findByIdAndDelete({ _id : userId })
        res.send("user deleted successfully")
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})
app.get("/feed", async(req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

app.patch("/user", async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"before"})
        console.log(user)
        res.send("user updated successfully")
    } catch (error) {
        res.status(400).send("Something went wrong")
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
