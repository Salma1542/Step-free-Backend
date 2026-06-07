const jwt=require('jsonwebtoken')
const User=require('../models/User')

const protect=async(req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        token=req.headers.authorization.split(' ')[1]
        try{
            const decoded=jwt.verify(token , process.env.JWT_SECRET)
            const currentUser=await User.findById(decoded.id)
            if(!currentUser){
                return res.status(401).json({
          success: false,
          message: "User no longer exists",
        });

            }
             if (currentUser.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Account is blocked",
        });
      }

      req.user = currentUser;
            next()
        }
        
        catch(error){
            return res.status(401).json({
                 success:false,

            message:'Not authorized'
            })
        }
    }
    if(!token){
        return res.status(401).json({
             success:false,

            message:'No token provided'
        })
    }
}
module.exports=protect