const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
require('dotenv/config');

const connectDB = require('./config/db');
const userRouter = require('./routes/userRoute');
const sellerRouter = require('./routes/sellerRoute');
const connectCloudinary = require('./config/cloudinary');
const productRouter = require('./routes/productRoute');
const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoute');
const { setIO } = require('./socket');

const payRoute = require('./routes/payRoutes');

// 🔥 TAMBAHAN
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT;

// 🔥 HTTP SERVER
const server = createServer(app);

// 🔥 SOCKET IO
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
  }
});

setIO(io); // 🔥 SET DISINI

// kalau butuh dipakai di file lain
module.exports.io = io;

// Database & Cloudinary
(async () => {
  await connectDB();
  await connectCloudinary();
})();

// Allowed multiple origins
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.get('/', (req, res) => {
  res.send("API Working");
});

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/midtrans', payRoute);

// 🔥 SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🔥 START SERVER
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});