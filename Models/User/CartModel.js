const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  noOfPixels: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  companyName: { type: String, required: true },
  file: { type: [String], default: [] },  
  organicLead: { type: String },
  message: { type: String },
  paymentMethod: { type: String, required: true, enum: ["Online Payment"] },  // ✅ Added this
  paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" } // ✅ Added this
}, { timestamps: true });

const CartItem = mongoose.model('CartItem', CartItemSchema);
module.exports = CartItem;
