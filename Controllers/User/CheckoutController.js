const Checkout = require('../../Models/User/CheckoutModel'); 
const CartItem = require('../../Models/User/CartModel'); 

exports.checkout = async (req, res) => {
  try {
    const { userId } = req.body;  // No need for paymentMethod input since it's always 'Online Payment'

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch cart items for the user
    const cartItems = await CartItem.find({ userId });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // ✅ Filter out items without totalPrice
    const validCartItems = cartItems.filter(item => item.totalPrice !== undefined);

    if (validCartItems.length === 0) {
      return res.status(400).json({ message: 'No valid items in cart for checkout' });
    }

    // ✅ Calculate total amount
    const totalAmount = validCartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // ✅ Create checkout entry
    const checkout = new Checkout({
      userId,
      cartItems: validCartItems.map(item => ({
        productId: item._id,
        name: item.name,
        noOfPixels: item.noOfPixels,
        totalPrice: item.totalPrice
      })),
      paymentMethod: 'Online Payment',  // Always Online Payment
      totalAmount,
      paymentStatus: 'Pending' // Always start as Pending for Online Payments
    });

    await checkout.save();

    // ✅ Clear only successfully checked-out items from cart
    await CartItem.deleteMany({ _id: { $in: validCartItems.map(item => item._id) } });

    res.status(201).json({ message: 'Checkout successful', checkout });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
