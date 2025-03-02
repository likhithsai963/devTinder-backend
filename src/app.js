const express = require('express');
const app = express();


app.get("/user",(req,res)=>{
    res.send({firstName:"Likhith",lastName:"Matta"})
})
app.post("/user",(req,res)=>{
    res.send("Data saved Successfully")
})
app.use("/test",(req,res) =>{
    res.send("Hello from Server!")
})

app.listen(3000,()=>{
    console.log("successfully listening to port 3000")
});
