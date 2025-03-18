const mongoose = require("mongoose")

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
  },
  amount: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
},
{ timestamps: true,}
)

const Donation = mongoose.model("Donation", donationSchema)

module.exports = Donation;