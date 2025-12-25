// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/checkout", async (req, res) => {
  const order = new Order({
    ...req.body,
    paymentStatus: req.body.paymentMethod === "cash" ? "pending" : "paid"
  });

  await order.save();
  res.json({ message: "Order placed", orderId: order._id });
});
module.exports = router;
