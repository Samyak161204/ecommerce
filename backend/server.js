import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import connectCloudinary from './config/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import newsletterRoutes from "./routes/newsletterRoutes.js";
import nodemailer from 'nodemailer';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// middleware 
app.use(express.json());
app.use(cors());
connectDB();
connectCloudinary();

// api endpoints 
app.use('/api/user', userRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);
app.use("/api/newsletter", newsletterRoutes);

app.get('/',(req,res)=>{
    res.send("API WORKING ")
});

// Routes

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
