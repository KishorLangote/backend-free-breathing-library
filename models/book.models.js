const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: [
    {
    type: String,
    required: true
    }
  ],
  genre: {
    type: String,
    required: true
  },
  publishedYear: {
    type: Number,
    required: true
  },
  publisher: {
    type: String,
  },
  bookType: {
    type: String,
    enum: ["hardcopy", "pdf"],
    required: true,
  },
  price: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pages: {
    type: Number,
  },
  language: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  totalCopies: {
    type: Number,
    required: true
  },
  availableCopies: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value <= this.totalCopies; // Ensure available copies are not greater than total copies
      },
      message: "Available copies cannot be more than total copies."
    }
  },
  condition: {
    type: String,
    enum: ["new", "used", "good"],
    default: "new",
  },
  section: { // shelf or section
    type: String,
  },
  coverImageUrl: {
    type: String,
    required: true
  },
  requests: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Request" 
  }],
},
{ timestamps: true }
)

const Book = mongoose.model("Book", bookSchema)

module.exports = Book