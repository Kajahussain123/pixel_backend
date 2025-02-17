const Order = require('../../Models/User/CartModel');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email phone'); // Fetch orders with user details
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Total Orders Count
exports.getTotalOrdersCount = async (req, res) => {
    try {
      const count = await Order.countDocuments();
      res.status(200).json({ totalOrders: count });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Get Total Pixel Count from All Orders
  exports.getTotalPixelCount = async (req, res) => {
    try {
      const orders = await Order.find();
      const totalPixels = orders.reduce((sum, order) => {
        return sum + order.cartItems.reduce((itemSum, item) => itemSum + (item.noOfPixels || 0), 0);
      }, 0);
  
      res.status(200).json({ totalPixels });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  exports.getGraphData = async (req, res) => {
    try {
      // Total orders count
      const totalOrders = await Order.countDocuments();
  
      // Orders increment logic (Completed vs Remaining)
      const completedOrders = await Order.countDocuments({ status: "Delivered" });
      const remainingOrders = totalOrders - completedOrders;
  
      // Revenue data grouped by month
      const revenueData = await Order.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" }, // Group by month
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      // Convert months from numbers to labels
      const monthNames = [
        "jan", "feb", "mar", "apr", "may", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec",
      ];
      const formattedRevenueData = revenueData.map((entry) => ({
        month: monthNames[entry._id - 1],
        revenue: entry.revenue,
      }));
  
      res.status(200).json({
        totalOrders,
        pieData: [
          { name: "Completed", value: completedOrders },
          { name: "Remaining", value: remainingOrders },
        ],
        revenueData: formattedRevenueData,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

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
  