require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const userAuthRoutes = require('./Routes/User/AuthRoutes')
const cartRoutes=require('./Routes/User/CartRoutes')
const checkoutRoutes=require('./Routes/User/CheckoutRoutes')
const orderRoutes=require('./Routes/Admin/OrderRoutes')
const userRoutes=require('./Routes/Admin/UsersRoutes')
const notificationRoutes=require('./Routes/Admin/NotificationRoutes')
const adminAuthRoutes=require('./Routes/Admin/AuthRoutes')
const pixelRoutes=require('./Routes/Admin/PixelRoutes')
const userOrderRoutes=require('./Routes/User/OrdersRoutes')
const userNotificationRoutes=require('./Routes/User/NotificationRoutes')
const session = require("express-session");
const passport = require("passport");


const app = express();

app.use(
    cors(/* {
      origin: ["http://localhost:3000", "https://accounts.google.com","https://pixel-main.netlify.app"], // Allow Google OAuth
      credentials: true, 
    } */)
);



// Middleware
app.use(express.json());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());


// Database Connection
require('./DB/connection');

// User Routes
app.use('/api/user/auth',userAuthRoutes)
app.use('/api/user/cart',cartRoutes)
app.use('/api/user/checkout',checkoutRoutes)
app.use('/api/user/orders',userOrderRoutes)
app.use('/api/user/notifications',userNotificationRoutes)

// Admin Routes
app.use('/api/admin/orders',orderRoutes)
app.use('/api/admin/users',userRoutes)
app.use('/api/admin/notification',notificationRoutes)
app.use('/api/admin/auth',adminAuthRoutes)
app.use('/api/admin/pixel',pixelRoutes)

// Static File Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Server Configuration
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server started listening at PORT ${PORT}`);
});
