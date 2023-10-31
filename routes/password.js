const express = require('express');
const router = express.Router();

const passwordController = require('../controllers/password');


router.post('/forgotPasswordMail', passwordController.forgotPasswordMail);
router.get('/createNewPassword/:uid',passwordController.createNewPassword);
router.post('/createNewPassword/:uid', passwordController.postNewPassword)



module.exports = router;
