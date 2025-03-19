const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  console.log("Authorization Header:", authHeader); 

  const token = authHeader && authHeader.split(" ")[1]; 
  
  if(token == null) {
    return res.status(401).json({ message: "Authentication token required" })
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



