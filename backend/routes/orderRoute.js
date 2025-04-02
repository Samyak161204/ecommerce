import express from 'express';
import { placeOrder,placeOrderRazorpay,placeOrderStripe,allOrders,userOrders,updateStatus, verifyStripe } from '../controllers/orderController.js';
import authUser from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'
import userModel from "../models/userModel.js"; 

const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

// User Feature
orderRouter.post('/userOrders',authUser,userOrders)

// verify payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)

export default orderRouter;