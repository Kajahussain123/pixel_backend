const mongoose = require("mongoose");

const PixelSchema = new mongoose.Schema({
  pixelCount: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPixelAdded: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model("Pixel", PixelSchema);