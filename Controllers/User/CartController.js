const Pixel = require("../../Models/Admin/PixelModel");
const CartItem = require("../../Models/User/CartModel");
const razorpay = require('../../Config/RazorPay')
const crypto = require("crypto");
const axios = require("axios");

// exports.buyNow = async (req, res) => {
//   try {
//       const { userId, name, email, phone, country, noOfPixels, companyName, organicLead, message, paymentMethod } = req.body;

//       if (!userId) return res.status(400).json({ message: "User ID is required" });

//       const pixelCount = parseInt(noOfPixels);
//       if (isNaN(pixelCount) || pixelCount <= 0) {
//           return res.status(400).json({ message: "Invalid pixel count" });
//       }

//       const validPaymentMethods = ["Online Payment"];
//       if (!validPaymentMethods.includes(paymentMethod)) {
//           return res.status(400).json({ message: "Invalid payment method" });
//       }

//       const pixelData = await Pixel.findOne().sort({ _id: -1 }); 
//       if (!pixelData || pixelData.pixelCount < pixelCount) {
//           return res.status(400).json({ message: "Not enough pixels available" });
//       }

//       const pricePerPixel = 1;
//       const totalPrice = pixelCount * pricePerPixel;

//       const paymentSuccess = await processPayment(userId, totalPrice, paymentMethod);
//       if (!paymentSuccess) {
//           return res.status(400).json({ message: "Payment failed. Please try again." });
//       }

//       const filePaths = req.files ? req.files.map((file) => file.path) : [];

//       const purchase = new CartItem({
//           userId,
//           name,
//           email,
//           phone,
//           country,
//           noOfPixels: pixelCount,
//           totalPrice,
//           companyName,
//           file: filePaths,
//           organicLead,
//           message,
//           paymentMethod,   
//           paymentStatus: "completed" 
//       });

//       await purchase.save();

//       // **Reduce available pixels**
//       pixelData.pixelCount -= pixelCount;
//       await pixelData.save();

//       res.status(201).json({
//           message: "Purchase successful",
//           purchase,
//           remainingPixels: pixelData.pixelCount
//       });

//   } catch (error) {
//       res.status(500).json({ message: "Server error", error: error.message });
//   }
// };



exports.buyNow = async (req, res) => {
    try {
        const { userId, noOfPixels, paymentMethod, currencyCode, currencySymbol } = req.body;

        if (!userId) return res.status(400).json({ message: "User ID is required" });

        const pixelCount = parseInt(noOfPixels);
        if (isNaN(pixelCount) || pixelCount <= 0) {
            return res.status(400).json({ message: "Invalid pixel count" });
        }

        const pricePerPixelUSD = 1; // 1 pixel = 1 USD
        const totalPriceInUSD = pixelCount * pricePerPixelUSD; // Total cost in USD

        let totalPriceInLocalCurrency = totalPriceInUSD; // Default: USD
        const exchangeRateAPI = "https://api.exchangerate-api.com/v4/latest/USD";

        // Convert USD to local currency if it's not USD
        if (currencyCode !== "USD") {
            try {
                const response = await axios.get(exchangeRateAPI);
                const exchangeRate = response.data.rates[currencyCode];

                if (!exchangeRate) {
                    return res.status(400).json({ message: "Unsupported currency" });
                }

                totalPriceInLocalCurrency = totalPriceInUSD * exchangeRate; // Convert to local currency
            } catch (error) {
                console.error("Error fetching exchange rates:", error);
                return res.status(500).json({ message: "Failed to fetch exchange rates" });
            }
        }

        const totalPriceInPaise = Math.round(totalPriceInLocalCurrency * 100); // Convert to paise for Razorpay

        const options = {
            amount: totalPriceInPaise, // Razorpay expects amount in paise (smallest currency unit)
            currency: currencyCode,
            receipt: `order_${Date.now()}`,
            payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);

        res.status(201).json({
            message: "Order created. Proceed to payment.",
            orderId: order.id,
            amount: totalPriceInPaise,
            currency: currencyCode,
            currencySymbol: currencySymbol
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.verifyPayment = async (req, res) => {
    try {
        console.log("Received Payment Data:", req.body);
        console.log("Received Files:", req.files); // Debugging

        // ✅ Extract file paths from uploaded files
        const filePaths = req.files ? req.files.map((file) => file.path) : [];

        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            userId, 
            noOfPixels, 
            companyName, 
            email, 
            phone, 
            country, 
            organicLead, 
            message, 
            currencyCode, 
            currencySymbol 
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id) {
            return res.status(400).json({ message: "Payment details missing" });
        }

        const pixelCount = parseInt(noOfPixels);
        if (isNaN(pixelCount) || pixelCount <= 0) {
            return res.status(400).json({ message: "Invalid pixel count" });
        }

        const pixelData = await Pixel.findOne().sort({ _id: -1 });
        if (!pixelData || pixelData.pixelCount < pixelCount) {
            return res.status(400).json({ message: "Not enough pixels available" });
        }

        let cartItem = await CartItem.findOne({ razorpayOrderId: razorpay_order_id });

        if (!cartItem) {
            cartItem = new CartItem({
                userId,
                name: companyName,
                email,
                phone,
                country,
                noOfPixels: pixelCount,
                file: filePaths,  // ✅ Store file paths in DB
                totalPrice: pixelCount * 1,
                companyName,
                organicLead,
                message,
                paymentReceived: true,
                paymentStatus: "completed",
                paymentMethod: "Online Payment",
                currencyCode,
                currencySymbol,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
            });

            await cartItem.save();
            pixelData.pixelCount -= pixelCount;
            await pixelData.save();
        } else {
            cartItem.paymentReceived = true;
            cartItem.paymentStatus = "completed";
            cartItem.razorpayPaymentId = razorpay_payment_id;
            cartItem.file = filePaths; // ✅ Ensure file paths are updated
            await cartItem.save();
        }

        res.status(200).json({ message: "Payment verified and purchase saved successfully", cartItem });

    } catch (error) {
        console.error("Payment verification failed:", error);
        res.status(500).json({ message: "Payment verification failed", error: error.message });
    }
};


