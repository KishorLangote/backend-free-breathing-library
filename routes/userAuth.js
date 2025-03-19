const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 
  
  if(token == null) {
    return res.status(401).json({ message: "Authentication token requried" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if(err){
      return res.status(403).json({ message: "Token expired. Please signIn again" })
    }
    console.log("Decoded Token:", user); // Debugging: See if user data is there
    req.user = user;   // Attach decoded user data (id, name, role) to req.user
    next()
  })
}

module.exports = { authenticateToken }




// const jwt = require("jsonwebtoken");

// const authenticateToken = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

//     if (!token) {
//         return res.status(401).json({ message: "Access Denied. No token provided!" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token
//         req.user = decoded; // Attach decoded token payload (which should include userId) to req.user
//         next();
//     } catch (error) {
//         res.status(403).json({ message: "Invalid or expired token!" });
//     }
// };

// module.exports = {authenticateToken};
