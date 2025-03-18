const express = require("express");
const User = require("../models/user.models");
const Book = require("../models/book.models");
const { authenticateToken } = require("./userAuth");

const router = express.Router();

//put book to cart:
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;
    const { bookId } = req.body;

    const userData = await User.findById(id);

    console.log("user ID:", id);
    console.log("book ID:", bookId);

    const isBookInCart = userData.cart.includes(bookId);
    if (isBookInCart) {
      return res.json({
        status: "Success",
        message: "Book is already in cart",
      });
    }
    await User.findByIdAndUpdate(id, {
      $push: { cart: bookId },
    });
    return res.json({
      status: "Success",
      message: "Book added to cart",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// remove from cart:
router.put("/remove-from-cart/:bookId", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { bookId } = req.params;
    console.log("user id:", id);
    console.log("book id:", bookId);
    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookId },
    });

    return res.json({
      status: "Success",
      message: "Book removed from cart",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//get cart of a partucular user by userId:
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    console.log(id)

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userData = await User.findById(id).populate("cart");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = userData.cart.reverse();
    console.log("cart:", cart)

    return res.json({
      status: "Success",
      data: cart, // this includes full book details..
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
