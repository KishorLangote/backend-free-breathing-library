const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 0,
  },
  commment: {
    type: String,
    required: true,
  },
},
{ timestamps: true }
)

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review;