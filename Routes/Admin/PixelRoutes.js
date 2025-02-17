const express = require("express");
const router = express.Router();
const { getPixelCount, addPixelCount, updatePixelCount } = require("../../Controllers/Admin/PixelController");

// Get the latest pixel count
router.get("/view", getPixelCount);

// Add a new pixel count
router.post("/add", addPixelCount);

// Update the latest pixel count
router.put("/update", updatePixelCount);

module.exports = router;
