import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
        console.log("DB connected");
    } catch (error) {
        console.error("DB not connected", error);
    }
};

export default connectDB;
