const mongoose=require("mongoose")
const bcrypt=require('bcrypt')
const userSchema=new mongoose.Schema(
    {
       
    firstName: {
      type: String,
      required: [true, "Please add your first name"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Please add your last name"],
      trim: true,
    },
            email:{
                type:String,
                required:[true,"Please add your email"],
                unique:true,
                lowercase:true,
                trim:true,
                match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],

            },
            password:{
                type:String,
                required:[true,"Please add password"],
                minlength:8,
                select:false,
            },
            role: {
  type: String,
  enum: ['user', 'driver', 'placeowner', 'admin'],
  default: 'user',
},
            gender:{
                type:String,
                enum:['male','female'],
            },
            dateOfBirth: {
              type: Date,
            },
            city:{
                type:String,
                required:[true,'please add your city'],
                trim:true,
            },
            phone:{
                type:String,
                trim:true,
                

            },
            nationalId: {
  type: String,
  required: function () {
    return this.role === 'driver';
  },
  trim: true,
},
            isVerified:{
                type:Boolean,
                default:false
            },
            profileImage: {
                type: String,
                default:'https://res.cloudinary.com/demo/image/upload/default-profile.png',
                        
             },
             isBlocked:{
                type:Boolean,
                default:false
             },
             otp:{
                type:String,
             },
             otpExpire:{
                type:Date,
             },
             resetPasswordOtp:{
                type:String,
             },
             resetPasswordOtpExpire:{
                type:Date,
             },
vehicleType:           { type: String },
licensePlate:          { type: String },
vehicleModel:          { type: String },
vehicleYear:           { type: Number },
accessibilityFeatures: { type: String },
availabilityFrom:      { type: String },
availabilityTo:        { type: String },
licenseNumber:         { type: String },
photoUrl:              { type: String },
licenseImageUrl:       { type: String },
vehicleImageUrl:       { type: String },
profileCompleted:      { type: Boolean, default: false },

         notificationSettings: {
  newPlace: { type: Boolean, default: true },
  newReview: { type: Boolean, default: true },
  reportedReview: { type: Boolean, default: true },
},       

        
    },
    {
        timestamps:true,
    }
)




userSchema.pre('save',async function (){
    if(!this.isModified('password')){
        return 
    }
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password, salt)
})
userSchema.methods.matchPassword=async function (enteredPass) {
    return await bcrypt.compare(enteredPass,this.password)
    
}
module.exports=mongoose.model('User',userSchema)