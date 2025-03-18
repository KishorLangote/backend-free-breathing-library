const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book"
  }],
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book"
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, 
  ref: "Request" 
}],
  accepetedTerm: {
    type: Boolean,
    default: false
  },
},
{ timestamps: true }
)

const User  = mongoose.model("User", userSchema)
 
module.exports = User