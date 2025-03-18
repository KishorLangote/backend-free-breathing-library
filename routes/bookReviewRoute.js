const express = require("express");
const router = express.Router();
const Review = require("../models/review.models");
const {authenticateToken} = require("./userAuth")

// submit a review (Any user)
router.post("/", async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.status(201).json({ message: "Review submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get reviews for a book (public)
router.get("/:bookId", async (req, res) => {
  try {
      const reviews = await Review.find({ book: req.params.bookId })
          .populate("user", "name email")  // Fetch reviewer details
          .populate("book", "title author");  // Fetch book details
      res.json(reviews);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// delete a review (admin only)
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
