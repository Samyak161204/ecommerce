import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
        }
        // Get the token value (remove 'Bearer ' prefix)
        const token = authHeader.split(" ")[1];
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded email matches the admin email
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Invalid or Expired Token" });
    }
};

export default adminAuth;
