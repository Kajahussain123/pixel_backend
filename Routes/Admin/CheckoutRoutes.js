const express = require('express');
const router = express.Router();
const { adminOrder } = require("../../Controllers/Admin/CheckoutController");
const { upload } = require('../../Middlewares/multerMiddleware');


router.post("/pixel",upload.array('file', 20), adminOrder);  // ✅ Admin order route

module.exports = router;
