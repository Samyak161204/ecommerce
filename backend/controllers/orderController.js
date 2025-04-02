import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Global variables
const currency = "inr"; // Defined directly instead of importing from App.jsx
const deliveryCharge = 50;

// Gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing Order using Stripe method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        if (amount < 50) {
            return res.status(400).json({ success: false, message: "Order amount must be at least ₹50." });
        }

        // Create order in the database
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "stripe",
            payment: false,
            date: Date.now(),
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Create line items for Stripe
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Ensure price calculation is correct
            },
            quantity: item.quantity,
        }));

        // Add delivery charge as a separate item
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 10 * 100, // Delivery charge in paise
            },
            quantity: 1,
        });

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${origin}/verify?orderId=${newOrder._id}&success=true&userId=${userId}`,
            cancel_url: `${origin}/verify?orderId=${newOrder._id}&success=false&userId=${userId}`,
        });
        

        res.status(201).json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
    try {
        console.log("Received Stripe verification request:", req.body);

        const { orderId, success, userId } = req.body;

        // Ensure success is a proper boolean
        const isSuccess = success === "true" || success === true;

        // Validate required fields
        if (!orderId || !userId) {
            console.log("❌ Missing orderId or userId:", req.body);
            return res.status(400).json({ success: false, message: "Missing orderId or userId" });
        }

        if (isSuccess) {
            // Update order payment status
            const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });

            if (!updatedOrder) {
                console.log(`❌ Order not found: ${orderId}`);
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            // Clear user cart
            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            console.log(`✅ Payment verified for Order ID: ${orderId}`);
            return res.status(200).json({ success: true });
        } else {
            // If payment failed, delete the order if it exists
            const order = await orderModel.findById(orderId);
            if (order) {
                await orderModel.findByIdAndDelete(orderId);
                console.log(`🗑 Order deleted due to failed payment: ${orderId}`);
            }

            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("⚠️ Error verifying payment:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



// Placing Order using COD method 
const placeOrder=async(req,res)=>{
    try {
        const {userId,items,amount,address}=req.body;
        const orderData={
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date:Date.now()
        }

        const newOrder=new orderModel(orderData)
        await newOrder.save()
        await userModel.findByIdAndUpdate(userId,{cartData:{}})
        res.json({success:true,message:"Order Placed"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// Placing Order using Razorpay method 
const placeOrderRazorpay=async(req,res)=>{
    
}

// All orders data from admin panel
const allOrders=async(req,res)=>{
    try {
        const orders=await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})   
    }
}

// User Order Data for frontend
const userOrders=async(req,res)=>{
    try {
        const {userId}=req.body
        const orders=await orderModel.find({userId})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})        
    }
}

// update order status from admin panel
const updateStatus=async(req,res)=>{
    try {
        const {orderId,status}=req.body
        await orderModel.findByIdAndUpdate(orderId,{status})
        res.json({success:true,message:'Status Updated'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})   
    }
}

export {verifyStripe,placeOrder,placeOrderRazorpay,placeOrderStripe,allOrders,userOrders,updateStatus}