const jwt = require('jsonwebtoken');
const authentication = async (req,res,next)=>{
    console.log("inside middle",req.headers.authorization?.split(" ")?.[1])
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader){
      return res.status(401).json({ message: "Authorization header missing" });
    }
    var token=req.headers.authorization||req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({message:"Authorization token missing"})
    }
    jwt.verify(token,"my-youtube",(err,decoded)=>{
         if (err) {
            console.log("err",err)
        return res.status(401).json({ message: 'Unauthorized' });
      }
      // Store the decoded user data in the request object
      req.user = decoded;
      console.log("bsdk",req.user)
      console.log("req12",decoded)
      next();
    })
}

module.exports=authentication