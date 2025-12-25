const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// GET cart
router.get("/", async (req, res) => {
  const cart = await Cart.findOne();
  res.json(cart || { items: [] });
});

// SAVE / UPDATE cart
router.post("/", async (req, res) => {
  let cart = await Cart.findOne();

  if (!cart) {
    cart = new Cart({ items: req.body.items });
  } else {
    cart.items = req.body.items;
  }

  await cart.save();
  res.json(cart);
});

// CLEAR cart
router.delete("/", async (req, res) => {
  await Cart.deleteMany();
  res.json({ message: "Cart cleared" });
});

module.exports = router;
