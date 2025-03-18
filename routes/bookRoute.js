const mongoose = require("mongoose");
const express = require("express")
const User = require("../models/user.models")
const Book = require("../models/book.models")
const jwt = require('jsonwebtoken')
const {authenticateToken} = require("./userAuth")

const router = express.Router()

// admin APIs:

// Add Book from Admin:
router.post("/add-book", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers; //gets id from the headers
      const user =  await User.findById(id)
      if(user.role !== "admin") {
        return res
        .status(403)
        .json({ message: "You are not having access to perform admin work" })
      }
      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        publishedYear: req.body.publishedYear,
        publisher: req.body.publisher,
        bookType: req.body.bookType,
        price: req.body.price,
        description: req.body.description,
        language: req.body.language,
        pages: req.body.pages,
        isbn: req.body.isbn,
        totalCopies: req.body.totalCopies,
        availableCopies: req.body.availableCopies,
        condition: req.body.condition,
        section: req.body.section,
        coverImageUrl: req.body.coverImageUrl
      });
      await book.save()
      res
      .status(200)
      .json({ message: "Book added successfully" })
    } catch (error) {
      console.log(error)
      res
      .status(500)
      .json({ message: "Internal server error" })
    }
})

// Update book by bookId with authentication:
router.put("/update-book/:bookId", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;

    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, { new: true });

    if (updatedBook) {
      return res.status(200).json({ message: "Book updated successfully.", book: updatedBook });
    } else {
      return res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    console.error("Update book error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Delete Book by BookId from Admin:
router.delete("/delete-book/:bookId", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    console.log(bookId)
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found." });
    }

    return res.status(200).json({ message: "Book deleted successfully", book: deletedBook });

  } catch (error) {
    console.error("Delete book error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// public APIs:

// get all books
router.get("/get-all-books", async (req, res) => {
        try {
      
          const books = await Book.find().sort({ createdAt: -1}) // -1 means descending order (newest books first).
          console.log(books)
          return res.json({books})
    } catch (error) {
      res
      .status(500)
      .json({ message: "Internal server error", error: error.message })
    }
})


// get recently added books limit 4
router.get("/get-recent-books", async (req, res) => {
    try {
      const books = await Book.find().sort({ createdAt: -1 }).limit(4)
      return res.json({
        status: "Success",
        data: books,
      })
    } catch (error) {
      res.status(500).json({ message: "Internal server error" })
    }
})

// get book by id:
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const book = await Book.findById(id)
      return res.json({
        status: "Success",
        data: book,
      })
    } catch (error) {
      res.status(500).json({ message: "Internal server error" })
    }
})


module.exports = router;