const express = require('express');
const router = express.Router()
const {protect} = require('../middleware/auth')

const apiController = require('../controllers/apiController')
const {validateUser} = require('../middleware/validator');
  

router.post('/signup',validateUser,apiController.signup)
router.post('/login',apiController.login)
router.get('/home',apiController.home)
router.get('/profile',protect,apiController.viewProfile)
router.post('/profile-update',apiController.updateProfile)
router.get('/contacts',protect,apiController.getContacts)
router.get('/contact',protect,apiController.getContactDetails)
router.post('/add-contact',protect,apiController.addContact)
router.put('/update-contact/:contact_id',protect,apiController.updateContact)
router.delete('/delete-contact/:contact_id',protect,apiController.deleteContact)
router.post('/logout',apiController.logout)

module.exports = router

