const mongoose = require("mongoose")

const requestBookSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, // store user id
    ref: "User", 
  },
  book: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "Book" 
  },
  title: {
    type: String,
    required: true 
  },
  author: {
    type: String,
    required: true 
  },
  publication: {
    type: String,
    required: true 
  },
  genre: {
    type: String,
    required: true 
  },
  language: {
    type: String,
    required: true 
 },
  reason: {
    type: String,
    required: true 
  },
  // status: {
  //   type: String,
  //   enum: ["pending", "approved", "denied",
  //   ],
  //   default: "pending",
  // },
},
{ timestamps: true }
)

const Request = mongoose.model("Request", requestBookSchema)

module.exports = Request;