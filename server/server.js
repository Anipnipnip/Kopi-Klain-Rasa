import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import connectDB from './config/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './config/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import payRoute from './routes/payRoutes.js';

const app = express();
const port = process.env.PORT;

await connectDB();
await connectCloudinary();

// Allowed multiple origins
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174',];

// MIddleware configurations 
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}))



app.get('/', (req, res) => {
    res.send("API Working")
});
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/midtrans', payRoute);


app.listen(port, () => {
    console.log(`server running on port http://localhost:${port}`)
})