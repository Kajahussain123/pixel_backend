const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false ,
      validate: {
        validator: function (value) {
          // Ensure password is present if googleId is missing
          if (!this.googleId && (!value || value.length < 6)) {
            return false;
          }
          return true;
        },
        message: 'Password is required and must be at least 6 characters long unless Google login is used.',
      },
    },
    is_active: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }, 
    otp: { type: String }, 
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
