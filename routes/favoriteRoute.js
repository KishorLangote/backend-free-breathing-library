const express = require("express")
const User = require("../models/user.models")
const Book = require("../models/book.models")
const {authenticateToken} = require("./userAuth")

const router = express.Router()

//add book to favorite..
router.put("/add-book-to-favorite", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { bookId }= req.body;
    const userData = await User.findById(id)
    console.log("user id:", id)
    console.log("book id:", bookId)
    const isBookFavorite = userData.favorites.includes(bookId)
    if(isBookFavorite) {
      return res
      .status(200)
      .json({ message: "Book is already in favorites" })
    } 
    
    await User.findByIdAndUpdate(id, { $push: { favorites: bookId }})
    console.log(userData)
    return res
    .status(200)
    .json({ message: "Book added to favorites" })
  } catch (error) {
    res
    .status(500)
    .json({ message: "Internal server error" })
  }
})


// remove book from favorite..
router.put("/remove-book-from-favorite", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body; // read bookId from body
    // const id = req.headers.id; // fet user ID from headers
   
    const {id} = req.headers
    console.log(bookId)
    console.log(id)
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userData.favorites.includes(bookId)) {
      await User.findByIdAndUpdate(id, { $pull: { favorites: bookId } });
      return res
      .status(200)
      .json({ message: "Book removed from favorites" });
    }

    return res
    .status(400)
    .json({ message: "Book is not in favorites" });
  } catch (error) {
    res
    .status(500)
    .json({ message: "Internal server error" });
  }
});


// get favorite books of a particular user..
router.get("/get-favorite-books", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      console.log("id:", id)
      const userData = await User.findById(id).populate("favorites") // In populate gets automatically fetches full book details from the Book collection..
      const favoriteBooks = userData.favorites; // choose only favorites books from userData..
      console.log("user info:", userData)
      return res.json({
        status: "Success",
        data: favoriteBooks,
      }) 
    } catch (error) {
      console.log(error)
      res
      .status(500)
      .json({ message: "Internal server error" })
    }
})



module.exports = router;
