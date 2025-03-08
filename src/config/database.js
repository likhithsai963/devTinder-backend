const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://likhithsai963:U3rL0sknAsz7OWwK@nodejs.we0kw.mongodb.net/devTinder");
};

module.exports = connectDB;
