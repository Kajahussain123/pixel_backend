const mongoose = require('mongoose');

const CheckoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'CartItem', required: true },
      name: { type: String, required: true },
      noOfPixels: { type: Number, required: true },
      totalPrice: { type: Number, required: true }
    }
  ],
  paymentMethod: { type: String, enum: ['Online Payment'], required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Checkout', CheckoutSchema);
