const adminAuth = (req,res,next)=>{
    const token = "xyz" //req.body.token should be used
    const isAdminAuthorized = token === "xyz"
    if(!isAdminAuthorized){
        res.status(401).send("admin is unauthorized")
    }
    else{
        next();
    }
}
const userAuth = (req,res,next)=>{
    const token = "xyz" //req.body.token should be used
    const isAdminAuthorized = token === "xyz"
    if(!isAdminAuthorized){
        res.status(401).send("admin is unauthorized")
    }
    else{
        next();
    }
}

module.exports = { adminAuth,userAuth}