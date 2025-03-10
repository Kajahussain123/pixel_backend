const express = require("express");
const router = express.Router();
const cartController = require("../../Controllers/User/CartController");
const { upload } = require("../../Middlewares/multerMiddleware");
const jwtVerify = require("../../Middlewares/jwtMiddleware");

// Route to create an order and proceed to payment
router.post("/buy-now", upload.array("file", 20), jwtVerify(["user"]), cartController.buyNow);

// Route to verify Razorpay payment
router.post("/verify-payment",upload.array("file", 20), jwtVerify(["user"]), cartController.verifyPayment);

module.exports = router;
