const User = require("../../Models/User/AuthModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({ name, email, password, otp, otpExpires });
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(201).json({ message: "OTP sent to email. Verify to activate account.", otp });
  } catch (error) {
    console.error("Registration Error:", error); // Log error for debugging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Function to send OTP via email
const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email - OTP",
      text: `Your OTP for verification is: ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check if OTP matches (convert to string)
    if (user.otp.toString() !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check OTP expiration (convert to Date)
    if (new Date(user.otpExpires) < new Date()) {
      return res.status(400).json({ message: "Expired OTP" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null; // Clear OTP
    user.otpExpires = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: "user",
      },
      process.env.JWT_SECRET,
      // { expiresIn: "7d" }
    );

    res.json({
      message: "Email verified successfully. You can now log in.",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("OTP Verification Error:", error); // Log error for debugging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Email not verified. Check your email for OTP." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = { registerUser, verifyOTP, loginUser };