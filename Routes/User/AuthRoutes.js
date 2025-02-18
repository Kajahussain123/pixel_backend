const express = require("express");
const { registerUser, loginUser , verifyOTP } = require("../../Controllers/User/AuthController");
const passport = require("passport");
const router = express.Router();
require ('../../Config/passport')
const jwt = require("jsonwebtoken");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp",verifyOTP)
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }) // Ensure scope is included
  );
  
// Google Auth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
      try {
        if (!req.user) {
          return res.redirect("https://pixel-main.netlify.app/login?error=user_not_found");
        }
  
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
  
        // Redirect to frontend with token and user ID
        res.redirect(`https://pixel-main.netlify.app/?token=${token}&userId=${req.user._id}`);
      } catch (err) {
        console.error("Google Auth Error:", err);
        res.redirect("https://pixel-main.netlify.app/login?error=auth_failed");
      }
    }
  );

module.exports = router;