const mongoose = require('mongoose')


const contactSchema = new mongoose.Schema({
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    type:{
        type:String,
        default:'personal'
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

const Contact = mongoose.model('Contact',contactSchema)
module.exports = Contact