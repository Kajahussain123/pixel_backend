const Pixel = require("../../Models/Admin/PixelModel");
const CartItem = require("../../Models/User/CartModel");

exports.adminOrder = async (req, res) => {
    try {
        const { 
            userId, name, email, phone, country, noOfPixels, companyName, organicLead, message, paymentReceived, currencyCode, currencySymbol 
        } = req.body;

        if (!userId) return res.status(400).json({ message: "User ID is required" });

        if (!currencyCode || !currencySymbol) {
            return res.status(400).json({ message: "Currency details are required" });
        }

        const pixelCount = parseInt(noOfPixels);
        if (isNaN(pixelCount) || pixelCount <= 0) {
            return res.status(400).json({ message: "Invalid pixel count" });
        }

        const pixelData = await Pixel.findOne().sort({ _id: -1 });
        if (!pixelData || pixelData.pixelCount < pixelCount) {
            return res.status(400).json({ message: "Not enough pixels available" });
        }

        const pricePerPixel = 1;
        const totalPrice = pixelCount * pricePerPixel;

        const filePaths = req.files ? req.files.map((file) => file.path) : [];

        const order = new CartItem({
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
            isAdminOrder: true,
            paymentReceived: paymentReceived || false,
            paymentStatus: paymentReceived ? "completed" : "pending",
            currencyCode,   // ✅ Ensure currency details are saved
            currencySymbol  // ✅ Ensure currency details are saved
        });

        await order.save();

        // **Reduce available pixels**
        pixelData.pixelCount -= pixelCount;
        await pixelData.save();

        res.status(201).json({
            message: "Admin order created successfully",
            order,
            remainingPixels: pixelData.pixelCount
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

