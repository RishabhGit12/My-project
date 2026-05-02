const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

//User Registration and Login Routes
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.LogoutUser)

//Food Partner Registration and Login Routes
router.post('/food-partner/register', authController.registerFoodPartner);
router.post('/food-partner/login', authController.loginFoodPartner);
router.get('/food-partner/logout', authController.LogoutFoodPartner);

module.exports = router;