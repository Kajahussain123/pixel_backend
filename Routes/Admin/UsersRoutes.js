const express = require('express');
const router = express.Router();
const adminUserController = require('../../Controllers/Admin/UserController');
const jwtVerify = require('../../Middlewares/jwtMiddleware')


router.get('/view',jwtVerify(['admin']), adminUserController.getAllUsers); // Get all registered users
router.get('/users/:userId',jwtVerify(['admin']), adminUserController.getUserById); // Get single user details
router.delete('/delete/:userId',jwtVerify(['admin']), adminUserController.deleteUser); // Delete user
router.get('/total/count',jwtVerify(['admin']), adminUserController.getTotalUsersCount);

module.exports = router;
