const express = require("express")
const User = require("../models/user.models")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const {authenticateToken} = require("./userAuth")


const router = express.Router()

// SingUp
router.post("/sign-up", async (req, res) => {
    try {
      const { username, email, password, address } = req.body;

      // check username length is more than 4: 

      if( !username || username.length < 3) {
        return res
        .status(400)
        .json({ message: "Username length should be greater then 4"})
      }


      // check if usernam already exists..

      const existingUsername = await User.findOne({ username: username})
      if(existingUsername) {
        return res
        .status(400)
        .json({ message: "Username already exists."})
      }

       // check if email already exists..

       const existingEmail = await User.findOne({ email: email })
       if(existingEmail) {
         return res
         .status(400)
         .json({ message: "Email already exists."})
       }

        // validates password length..
        if(password.length <= 5) {
          return res
          .status(400)
          .json({ message: "Password's length should be greater than 5"})
        }

        const hasPass = await bcrypt.hash(password, 10)

        const newUser = new User({
            username: username,
            email: email,
            password: hasPass,
            address: address,
          })

          await newUser.save() // save new user in db
          return res.status(201).json({ message: "SignUp Successfully."})
    } catch (error) {
      console.error("Signup Error:", error);
      res
      .status(500)
      .json({ message: "Internal server error."})
    }
})

// SignIn
// router.post("/sign-in", async (req, res) => {
//   try {
//     const { username, password } = req.body

//     const existingUser = await User.findOne({ username })

//     if(!existingUser){
//       res
//       .status(400)
//       .json({ message: "Username does not exist" })
//     }

//     // compare the password :

//     await bcrypt.compare(password, existingUser.password, (err, data) => {
//       if(data) {
//         const authClaims = [
//           { name: existingUser.username}, { role: existingUser.role},
//         ]
//         const token = jwt.sign({authClaims}, "bookStore123", {expiresIn: "30d",
//         })
//         res
//         .status(200)
//         .json({
//           id: existingUser._id,
//           role: existingUser.role, 
//           token: token 
//         })
//       } else {
//         res.status(400).json({ message: "Invalid credentials" })
//       }
//     }) 
//   } catch(error) {
//     res.status(500).json({ message: "Internal server error" })
//   }
// })


// SignIn
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    // Check if username exists
    if (!existingUser) {
      return res.status(400).json({ message: "Username does not exist" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const authClaims = { username: existingUser.username, role: existingUser.role };
    const token = jwt.sign(authClaims, "bookStore123", { expiresIn: "30d" });

    res.status(200).json({
      id: existingUser._id,
      role: existingUser.role,
      token: token,
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

// Get-User-Information
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const {id} = req.headers;
    // const {id} = req.user.userId;
    console.log("userId:", id)
    const userInfo = await User.findById(id).select("-password"); // exclude password
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("user info:", userInfo)
    return res.status(200).json(userInfo);
  } catch (error) {
    console.error("Get User Info Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update address:
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    console.log("Received ID:", id);
    console.log("Received Address:", address);
    // Validate inputs
    if (!id) {
      return res.status(400).json({ message: "User ID is required in headers." });
    }
    if (!address) {
      return res.status(400).json({ message: "Address is required in the request body." });
    }

    // Update the user address
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { address },
      { new: true } // Ensures the updated document is returned
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Address updated successfully.",
      updatedAddress: updatedUser.address,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;