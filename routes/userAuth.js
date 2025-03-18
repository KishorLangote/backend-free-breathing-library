const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token
        req.user = decoded; // Attach decoded token payload (which should include userId) to req.user
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token!" });
    }
};

module.exports = {authenticateToken};
