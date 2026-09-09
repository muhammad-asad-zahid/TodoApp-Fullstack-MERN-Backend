const express = require('express')
const {  userlogin, userSignup, logout } = require('../controllers/usercontroller')
const loginM = require('../middlewares/login')

const router = express.Router()



router.post('/signup', userSignup )
router.post('/login',loginM,userlogin)
router.post('/logout', logout);

module.exports = router;