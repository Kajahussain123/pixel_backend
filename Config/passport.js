const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../Models/User/AuthModel");
require("dotenv").config();


passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3005/api/user/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Google Profile:", profile); // Check if Google returns data
        try {
          let user = await User.findOne({ email: profile.emails[0].value });
  
          if (!user) {
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              isVerified: true,
            });
  
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          console.error("Error in Google Authentication:", err);
          return done(err, null);
        }
      }
    )
  );
  

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
