const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:4,
        maxLength:50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required:true,
        lowerCase: true,
        trim: true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid Email Address")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter Strong password")
            }
        }
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum:{
            values : ["male","female","others"],
            message : `{VALUE} is not a valid gender Type`
        },
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    isPremium:{
        type : Boolean,
        default : false
    },
    memberShipType:{
        type : String
    },
    photoUrl:{
        type: String,
        default:"http://placebeard.it/250/250",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid Photo URL")
            }
        }
    },
    about:{
        type:String,
        default: "This is default about of user!"
    },
    skills:{
        type:[String]
    }

},{timestamps: true});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790",{expiresIn:"1D"});
    return token;

};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema);