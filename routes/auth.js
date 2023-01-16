const express= require("express");
const authController=require('../controllers/auth');
const mailController=require('../controllers/mail');
const router = express.Router();



router.post('/register', authController.register );

router.post('/login',authController.login);

router.get('/logout',authController.logout);

router.post('/mail',mailController.mail);

module.exports = router;
 
