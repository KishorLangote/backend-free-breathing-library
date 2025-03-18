const express = require("express");
const router = express.Router();
const Donation = require("../models/donation.models");
const {authenticateToken} = require("./userAuth")

// submit a donation (any user)
router.post("/", async (req, res) => {
    try {
        const newDonation = new Donation(req.body);
        await newDonation.save();
        res.status(201).json({ message: "Donation submitted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get all donations (admin only)
router.get("/", authenticateToken, async (req, res) => {
  try {
      const donations = await Donation.find().populate("user", "name email");
      res.json(donations);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// approve/Reject donations (admin only)
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const updatedDonation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedDonation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete a donation (admin only)
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        await Donation.findByIdAndDelete(req.params.id);
        res.json({ message: "Donation deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
