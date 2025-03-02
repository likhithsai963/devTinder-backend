const express = require('express');
const app = express();

app.use("/",(req,res) =>{
    res.send("Hello from Server!")
})

app.listen(3000,()=>{
    console.log("successfully listening to port 3000")
});
