const express = require('express');
const router = express.Router();
const adminUserController = require('../../Controllers/Admin/UserController');

router.get('/view', adminUserController.getAllUsers); // Get all registered users
router.get('/users/:userId', adminUserController.getUserById); // Get single user details
router.delete('/delete/:userId', adminUserController.deleteUser); // Delete user
router.get('/total/count', adminUserController.getTotalUsersCount);

module.exports = router;
