const Order = require('../../Models/User/CartModel');


exports.getOrdersByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
      
      const orders = await Order.find({ userId }).populate('userId', 'name email phone');
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };