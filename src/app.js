const express = require('express');
const connectDB = require('./config/database')
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")
const http = require("http");
require('dotenv').config();
require('./utils/cronJob')

app.use(cors({
    origin:"http://localhost:5173",
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');
const paymentRouter = require('./routes/payment');
const initializeSocket = require('./utils/socket');
const chatRouter = require('./routes/chat');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",paymentRouter);
app.use("/",chatRouter)
const server = http.createServer(app)
initializeSocket(server)


connectDB().then(() => {
    console.log("Database connection Established...")
    server.listen(3000, () => {
        console.log("successfully listening to port 3000")
    });

}).catch((err) => {
    console.log("Database cannot be connected", err)
})
