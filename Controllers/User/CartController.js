const Pixel = require("../../Models/Admin/PixelModel");
const CartItem = require("../../Models/User/CartModel");


exports.buyNow = async (req, res) => {
  try {
      const { userId, name, email, phone, country, noOfPixels, companyName, organicLead, message, paymentMethod } = req.body;

      if (!userId) return res.status(400).json({ message: "User ID is required" });

      const pixelCount = parseInt(noOfPixels);
      if (isNaN(pixelCount) || pixelCount <= 0) {
          return res.status(400).json({ message: "Invalid pixel count" });
      }

      const validPaymentMethods = ["Online Payment"];
      if (!validPaymentMethods.includes(paymentMethod)) {
          return res.status(400).json({ message: "Invalid payment method" });
      }

      const pixelData = await Pixel.findOne().sort({ _id: -1 }); 
      if (!pixelData || pixelData.pixelCount < pixelCount) {
          return res.status(400).json({ message: "Not enough pixels available" });
      }

      const pricePerPixel = 1;
      const totalPrice = pixelCount * pricePerPixel;

      const paymentSuccess = await processPayment(userId, totalPrice, paymentMethod);
      if (!paymentSuccess) {
          return res.status(400).json({ message: "Payment failed. Please try again." });
      }

      const filePaths = req.files ? req.files.map((file) => file.path) : [];

      const purchase = new CartItem({
          userId,
          name,
          email,
          phone,
          country,
          noOfPixels: pixelCount,
          totalPrice,
          companyName,
          file: filePaths,
          organicLead,
          message,
          paymentMethod,   
          paymentStatus: "completed" 
      });

      await purchase.save();

      // **Reduce available pixels**
      pixelData.pixelCount -= pixelCount;
      await pixelData.save();

      res.status(201).json({
          message: "Purchase successful",
          purchase,
          remainingPixels: pixelData.pixelCount
      });

  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mock Payment Processing Function (Replace with real integration)
const processPayment = async (userId, amount, method) => {
    try {
        // Simulate payment success (Replace with actual payment API call)
        console.log(`Processing payment of $${amount} via ${method} for user ${userId}`);
        return true; // Simulating success
    } catch (error) {
        console.error("Payment processing error:", error);
        return false;
    }
};
