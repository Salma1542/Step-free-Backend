const  User=require('../models/User')
const jwt=require('jsonwebtoken')

const generateToken=(id,role)=>{
    return jwt.sign(
        {id,role},
        process.env.JWT_SECRET,
        {
            expiresIn:'30d'
        }
    )
}

const register=async(req,res)=>{
    try{
        const{
        name,
        email,
        password,
        confirmPassword,
        city,
        phone,
        gender,
        dateOfBirth,
        role

        }=req.body
      
        if(password!== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password do not match"
            })
        }

        const allowedRoles=[
            'user',
            'driver',
            'placeOwner'
        ]
        if(!allowedRoles.includes(role)){
            return res.status(400).json({
                success:false,
                message:'Invalid Role'
            })


        }
        const userExists=await User.findOne({email})
        if(userExists){
            return res.status(400).json({
                success:false,
                message:'User already exists'
            })
        }
        const user=await User.create({
            name,
            email,
            password,
            city,
            phone,
            gender,
            dateOfBirth,
            role
        })
        res.status(201).json({
            success:true,
            token:generateToken(
                user._id,
                user.role
            ),
            data:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                city:user.city
            }
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}



const login=async(req,res)=>{
    try{
        const{email,password}=req.body
        const user=await User.findOne({email}).select('+password')
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }
        const isMatch=await user.matchPassword(password)
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:'Invalid email or password'
            })
        }
if(user.isBlocked){
    return res.status(403).json({
        success:false ,
        message:'Account is blocked'
    })
}
res.status(200).json({
    success:true,
    token:generateToken(
        user._id,
        user.role
    ),
    data:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    }
})

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })

    }
}
module.exports = {
    register,
    login
};