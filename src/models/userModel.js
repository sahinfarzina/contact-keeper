const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse')

const userSchema = new mongoose.Schema({
    full_name:{
        type:String,
        required:[true,'Please add a name'],
        trim:true,
        maxlength:[50,'Name can not be more than 50 character']
    },
    email:{
        type:String,
        required:[true,'Please add a email'],
        trim:true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please add a valid email'
        ]
    },
    password:{
        type:String,
        required:true
    },
    user_type:{
        type:Number,
        required:true
    },
    token:{
        type:String
    },
    created_at:{
        type:Date,
        default: Date.now
    },
    updated_at:{
        type:Date,
        default: Date.now
    },
    is_active:{
        type:Number,
        default:1
    },
    is_deleted:{
        type:Number,
        default:0
    }

})

userSchema.methods.toJSON = function(){
    const  user = this
    const  userObject = user.toObject()
    delete userObject.password
    delete userObject.token
    delete userObject.created_at
    delete userObject.updated_at
    delete userObject.__v
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET,{expiresIn:360000})
    user.token = token
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email:email})
    if(!user){
        throw new ErrorResponse('Email does not exist',200)
    }
    if(user.user_type == 1){
        throw new ErrorResponse('Restricted login',200)
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new ErrorResponse('Incorrect password',200)
    }
    return user
}

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User