
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Get the token from the request headers
    const authHeader = req.headers.authorization;

    // Check whether a token was provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Please log in."
        });
    }

    // Extract the actual token
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token using our secret key
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded user information in the request
        req.user = decoded;

        // Allow the request to continue
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please log in again."
        });
    }
};

module.exports = authMiddleware;
