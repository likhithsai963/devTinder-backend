const mongoose = require("mongoose");
const validator = require("validator")


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
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl:{
        type: String,
        default:"https://www.shutterstock.com/image-vector/simple-gray-avatar-icons-representing-male-2473353263",
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

module.exports = mongoose.model("User",userSchema);