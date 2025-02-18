const express = require("express");
const router = express.Router();
const { getPixelCount, addPixelCount, updatePixelCount } = require("../../Controllers/Admin/PixelController");
const jwtVerify = require('../../Middlewares/jwtMiddleware')


// Get the latest pixel count
router.get("/view",jwtVerify(['admin']), getPixelCount);

// Add a new pixel count
router.post("/add",jwtVerify(['admin']), addPixelCount);

// Update the latest pixel count
router.put("/update",jwtVerify(['admin']), updatePixelCount);

module.exports = router;
