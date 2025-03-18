const express = require("express");
const Order = require("../models/order.models");
const User = require("../models/user.models");
const { authenticateToken } = require("./userAuth");

const router = express.Router();

// place order:
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id }); // ._id is bookId
      const orderDataFromDb = await newOrder.save();
      console.log("All Orders:", orderDataFromDb);
      // saving order in user model:
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      //clearing cart:
      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }
    return res.json({
      status: "Success",
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get order history of particular user:
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    const ordersData = userData.orders.reverse();
    return res.json({
      status: "Success",
      data: ordersData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get all orders: admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({
        path: "book",
      })
      .populate({
        path: "user",
      })
      .sort({ createAt: -1 });

    return res.json({
      status: "Success",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// update order by admin:
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Returns updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, message: "Status Updated Successfully", data: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
