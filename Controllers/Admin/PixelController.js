const Pixel = require("../../Models/Admin/PixelModel");

// Get the latest pixel count
exports.getPixelCount = async (req, res) => {
  try {
    const pixel = await Pixel.findOne().sort({ _id: -1 }); // Get the latest entry
    if (!pixel) {
      return res.status(404).json({ message: "No pixel data found" });
    }
    res.json({
      pixelCount: pixel.pixelCount,
      totalPixelAdded: pixel.totalPixelAdded,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add pixel count by incrementing the existing value
exports.addPixelCount = async (req, res) => {
  try {
    const { pixelCount } = req.body;
    if (pixelCount < 0) {
      return res.status(400).json({ message: "Pixel count cannot be negative" });
    }

    let pixel = await Pixel.findOne().sort({ _id: -1 });

    if (!pixel) {
      // If no existing data, create a new record
      pixel = new Pixel({ pixelCount, totalPixelAdded: pixelCount });
    } else {
      // Increment the existing pixel count and totalPixelAdded
      pixel.pixelCount += pixelCount;
      pixel.totalPixelAdded += pixelCount;
    }

    await pixel.save();

    res.status(201).json({
      message: "Pixel count added",
      pixelCount: pixel.pixelCount,
      totalPixelAdded: pixel.totalPixelAdded,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Update the latest pixel count
exports.updatePixelCount = async (req, res) => {
  try {
    const { pixelCount } = req.body;
    if (pixelCount < 0) {
      return res.status(400).json({ message: "Pixel count cannot be negative" });
    }

    let pixel = await Pixel.findOne().sort({ _id: -1 });
    if (!pixel) {
      return res.status(404).json({ message: "No pixel data found to update" });
    }

    // Calculate the difference between the new and old pixelCount
    const difference = pixelCount - pixel.pixelCount;

    // Update pixelCount and totalPixelAdded
    pixel.pixelCount = pixelCount;
    pixel.totalPixelAdded += difference;

    await pixel.save();

    res.json({
      message: "Pixel count updated",
      pixelCount: pixel.pixelCount,
      totalPixelAdded: pixel.totalPixelAdded,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
