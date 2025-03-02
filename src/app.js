const express = require('express');
const app = express();


app.get("/user/:userId/:name/:password",(req,res)=>{
    console.log(req.query);
    console.log(req.params)
    res.send({firstName:"Likhith",lastName:"Matta"})
})
app.post("/user",(req,res)=>{
    res.send("Data saved Successfully")
})

app.listen(3000,()=>{
    console.log("successfully listening to port 3000")
});
