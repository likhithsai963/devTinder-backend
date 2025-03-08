const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user')


app.post("/signup", async (req,res,next)=>{
    const user = new User({
        firstName:"Likhith",
        lastName:"Matta",
        emailId:"likhithsai963@gmail.com",
        password:"Arjunreddy@9"
    })
    try{
        await user.save();
        res.send("Updated successfully")
    }
    catch(err){
        res.status(400).send("Error saving the user:"+ err.message)
    }

})

connectDB().then(()=>{
    console.log("Database connection Established...")
    app.listen(3000,()=>{
        console.log("successfully listening to port 3000")
    });
    
}).catch((err)=>{
    console.log("Database cannot be connected",err)
})
