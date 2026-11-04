
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {

        // Check whether the user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please log in first."
            });
        }

        // Check whether the user has the required role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not authorized."
            });
        }

        // Allow access
        next();
    };
};

module.exports = authorizeRole;
