const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    }
  ],
  status: {
    type: String,
    default: "Order Placed",
    enum: ["Order Placed", "Out for delivery", "Delivered", "Cancelled" ]
  },
},
{ timestamps: true }
)

const Order = mongoose.model("Order", orderSchema)

module.exports = Order