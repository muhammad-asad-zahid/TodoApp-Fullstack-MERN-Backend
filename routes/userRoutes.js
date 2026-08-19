const express = require('express')
const { userGet, userlogin } = require('../controllers/usercontroller')
const loginM = require('../middlewares/login')

const router = express.Router()



router.get('/', userGet )
router.get('/login',loginM,userlogin)

module.exports = router;