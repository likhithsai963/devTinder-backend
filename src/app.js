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

// app.use("/user",[(req,res,next) =>{
//     // res.send("Response 1")
//     next();
// },(req,res)=>{
//     res.send("Response2")
// }])

app.use("/user",[(req,res,next) =>{
    // res.send("Response 1")
    next();
},(req,res,next)=>{
    // res.send("Response2")
    next();
}],(req,res,next)=>{
    res.send("Response 3")
})
app.listen(3000,()=>{
    console.log("successfully listening to port 3000")
});
