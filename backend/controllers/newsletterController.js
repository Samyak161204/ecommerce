// controllers/newsletterController.js
import Subscription from "../models/subscriptionModel.js";

// Subscribe to newsletter
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email address." });
    }


    // Check if already subscribed
    const existing = await Subscription.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email is already subscribed." });
    }

    // Save new subscription
    const subscription = new Subscription({ email });
    await subscription.save();

    res.status(201).json({ success: true, message: "Successfully subscribed to the newsletter." });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ success: false, message: "There was an error subscribing. Please try again." });
  }
};

export { subscribeNewsletter };
