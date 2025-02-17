const express = require('express');
const router = express.Router();
const cartController = require('../../Controllers/User/CartController');
const { upload } = require('../../Middlewares/multerMiddleware');

router.post('/add',upload.array('file', 5), cartController.buyNow);
// router.get('/:userId', cartController.getCartItems);
// router.delete('/remove/:cartItemId', cartController.removeFromCart);
// router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;
