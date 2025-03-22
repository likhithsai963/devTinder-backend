const express = require("express")

const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth")

const {validateEditProfileData} = require("../utils/validation")

profileRouter.get("/profile/view",userAuth, async (req, res) => {
    try {
        const user = req.user
        res.json({data : user})
    }
    catch(err){
        res.json({message : err.message})
    }
});

profileRouter.patch("/profile/edit",userAuth,async (req,res,next)=>{
    try {
       if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request")
       }
       const logggedInUser = req.user;
       Object.keys(req.body).forEach((key) => (logggedInUser[key] = req.body[key]))

       res.json({message : `${logggedInUser.firstName} Your profile was updated Successfully`,data: logggedInUser})
       await logggedInUser.save()

        
    } catch (error) {
        res.status(400).json({message : error.message})
    }
})

module.exports = profileRouter;