import mongoose from "mongoose";

// Create the schema for Newsletter Subscription
const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
});

// Create the model for the schema
const subscriptionModel = mongoose.models.subscription || mongoose.model("subscription", subscriptionSchema);

export default subscriptionModel;
