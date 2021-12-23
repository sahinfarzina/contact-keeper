const User = require('../models/userModel')
const asyncHandler = require('../middleware/async')
const Contact = require('../models/contactModel')

exports.signup = asyncHandler(async (req,res)=>{
    console.log(req.body);
    if(!req.body.name){
        return res.send({success:false,message:"Please provide name"})
    }
    if(!req.body.email || !req.body.password){
        return res.send({success:false,message:"Please provide email & password"})
    }
    let checkEmail = await User.findOne({email:req.body.email,is_deleted:0}).select({"email":1})
    //console.log(checkEmail)
    if(checkEmail){
        return res.send({success:false,message:"Email already exist"})
    }
    let inputData = req.body
    let user = new User({
        full_name:inputData.name,
        email:inputData.email,
        password:inputData.password,
        user_type:2
    });
    await user.save();
    const token = await user.generateAuthToken()

    res.send({success:true,message:"User registered successfully",data:{token}})
})

exports.login = asyncHandler(async(req,res)=>{
    if(!req.body.email || !req.body.password){
        return res.send({success:false,message:"Please provide email & password"})
    }
    const user = await User.findByCredentials(req.body.email,req.body.password)
    if(user.is_active != 1){
        return res.send({success:false,message:"Your account has blocked by administrator"})
    }
    const token = await user.generateAuthToken()

    /*user.device_type = req.body.device_type
    user.is_online = 1
    if(req.body.device_push_key != undefined){
        user.device_push_key = req.body.device_push_key
    }
    await user.save()*/
    let userInfo = await User.findById(user._id).select({"email":1,"full_name":1})
    let userDetails = userInfo.toObject();
    userDetails.name = userInfo.full_name
    res.send({success:true,message:"Loggedin successfully",data:{token,user:userDetails}})
})

exports.viewProfile = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    let profileInfo = await User.findById(userId).select({
        "full_name":1,
        "email":1
    })
    if(!profileInfo){
        return res.send({success:false,message:"No user found"})
    }
    let details = profileInfo.toObject()
    details.name = profileInfo.full_name
    res.send({success:true,message:"Your profile information",data:{user:details}})
})

exports.updateProfile = asyncHandler(async(req,res)=>{

})

exports.getContacts = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    let contactList = await Contact.find({created_by:userId,is_active:1,is_deleted:0}).populate({
        path:'created_by',
        select:{"full_name":1,"email":1,"phone":1,"type":1}
    }).sort({created_by:-1})
    if(!contactList){
        return ({success:false,message:"No record found"})
    }
    let contacts = []
    contactList.forEach(contact => {
        contacts.push({
            id:contact._id,
            name:contact.name,
            email:contact.email,
            phone:contact.phone,
            type:contact.type,
            //created_by:contact.created_by.full_name
        })
    });
    res.send({success:true,message:"Contact list",data:{contact_list:contacts}})
})

exports.getContactDetails = asyncHandler(async(req,res)=>{

})

exports.addContact = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    let contact = new Contact({
        created_by:userId,
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        type:req.body.type
    })
    let newContact = await contact.save();
    let contactInfo = newContact.toObject()
    contactInfo.id = newContact._id
    res.send({success:true,message:"Contact created successfully",data:{created_contact:contactInfo}})
})

exports.updateContact = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const contactId = req.params.contact_id
    console.log(contactId)
    let contactInfo = await Contact.findOne({_id:contactId,created_by:userId})
    if(!contactInfo){
        return res.send({success:false,message:"Contact does not exist"})
    }
    if(req.body.name){
        contactInfo.name = req.body.name;
    }
    if(req.body.email){
        contactInfo.email = req.body.email;
    }
    if(req.body.phone){
        contactInfo.phone = req.body.phone;
    }
    await contactInfo.save()
    let updatedContactInfo = await Contact.findOne({_id:contactId}).select({
        "name":1,"email":1,"phone":1
    })
    let contact = updatedContactInfo.toObject()
    contact.id = updatedContactInfo._id
    res.send({success:true,message:"Contact updated successfully",data:{contact:contact}})
})

// @route     DELETE api/delete-contact/:id
// @desc      Delete contact
// @access    Private
exports.deleteContact = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const contactId = req.params.contact_id
    console.log(contactId) 
    let contactInfo = await Contact.findOne({_id:contactId,created_by:userId})
    if(!contactInfo){
        return res.send({success:false,message:"Contact does not exist"})
    }
    await Contact.findByIdAndRemove(contactId);
    res.send({success:true,message:"Contact updated successfully"})
})

exports.home = asyncHandler(async(req,res,next)=>{
    res.send({success:true,message:"",data:{content:"Welcome Home"}})
})

exports.logout = asyncHandler(async(req,res,next)=>{

})