const Order = require('../../Models/User/CartModel');
const path = require("path");
const ExcelJS = require("exceljs");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 }); // Sorting in descending order (latest first)

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
  
      // ✅ Count orders with completed payment
      const completedOrders = await Order.countDocuments({ paymentStatus: "completed" });
  
      const remainingOrders = totalOrders - completedOrders;
  
      // ✅ Aggregate revenue correctly
      const revenueData = await Order.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" }, // Group by month
            revenue: { $sum: "$totalPrice" }, // Sum totalPrice for each month
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      // Convert months from numbers to labels
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
  

  exports.exportOrdersToExcel = async (req, res) => {
    try {
      const orders = await Order.find().populate("userId", "name email phone");
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }
  
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Orders");
  
      // Define columns
      worksheet.columns = [
        { header: "Order ID", key: "_id", width: 30 },
        { header: "User Name", key: "userName", width: 20 },
        { header: "User Email", key: "userEmail", width: 25 },
        { header: "Order Name", key: "name", width: 20 },
        { header: "Email", key: "email", width: 25 },
        { header: "Phone", key: "phone", width: 15 },
        { header: "Country", key: "country", width: 10 },
        { header: "No of Pixels", key: "noOfPixels", width: 15 },
        { header: "Total Price", key: "totalPrice", width: 15 },
        { header: "Company Name", key: "companyName", width: 20 },
        { header: "Payment Method", key: "paymentMethod", width: 20 },
        { header: "Payment Status", key: "paymentStatus", width: 15 },
        { header: "Created At", key: "createdAt", width: 25 },
        { header: "Updated At", key: "updatedAt", width: 25 },
        { header: "File URLs", key: "fileUrls", width: 50 }
      ];
  
      // Populate data
      orders.forEach((order) => {
        worksheet.addRow({
          _id: order._id.toString(),
          userName: order.userId?.name || "N/A",
          userEmail: order.userId?.email || "N/A",
          name: order.name,
          email: order.email,
          phone: order.phone,
          country: order.country,
          noOfPixels: order.noOfPixels,
          totalPrice: order.totalPrice,
          companyName: order.companyName,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          createdAt: new Date(order.createdAt).toLocaleString(),
          updatedAt: new Date(order.updatedAt).toLocaleString(),
          fileUrls: order.file ? order.file.join(", ") : "No Files",
        });
      });
  
      // Set file path
      const filePath = path.join("C:\\Users\\user\\Desktop\\Codeedex Projects\\Pixel\\Backend\\exports", "Orders.xlsx");

  
      // Save the workbook to a file
      await workbook.xlsx.writeFile(filePath);
  
      // Send file as response
      res.download(filePath, "Orders.xlsx", (err) => {
        if (err) {
          console.error("File download error:", err);
          res.status(500).json({ message: "Error downloading file" });
        }
      });
  
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };