const express = require("express");
const router = express.Router();
const BookRequest = require("../models/bookRequest.models");
const {authenticateToken} = require("./userAuth")


// create a book request (any user)
router.post("/request-book", async (req, res) => {
    try {
    
      const { bookId, userId, title, author, genre, publication, language, reason } = req.body;
  
      if (!userId) {
        return res.status(400).json({ error: "User ID is missing" });
      }
  
      if (!title || !author || !genre || !publication || !language || !reason) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const newRequest = new BookRequest({
        user: userId,
        book: bookId,
        title,
        author,
        genre,
        publication,
        language,
        reason,
      });
  
      await newRequest.save();
      res.status(201).json({ message: "Request submitted successfully!" });
    } catch (error) {
      console.error(" Backend Error:", error);
      res.status(500).json({ error: "Failed to submit request", details: error.message });
    }
  });
  

// get all book requests (admin only)
router.get("/get-all-requests", authenticateToken, async (req, res) => {
  try {
      const requests = await BookRequest.find()
          .populate({
            path: "book",
            select: "title author genre publication"
          })
          .populate({
            path: "user",
             select: "name, email"
          })
          console.log("Requests:", requests);
      res.json(requests);
  } catch (error) {
    console.error("Error Fetching Requests:", error);
      res.status(500).json({ error: error.message });
  }
});


// approve/Reject book requests (admin only)

// router.put("/:id", authenticateToken, async (req, res) => {
//     try {
//         const updatedRequest = await BookRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(updatedRequest);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

module.exports = router