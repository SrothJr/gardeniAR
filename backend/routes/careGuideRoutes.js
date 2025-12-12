const express = require("express");
const router = express.Router();
const careGuideController = require("../controllers/careGuideController.js");

router.get("/", careGuideController.getAllGuides);
router.get("/:id", careGuideController.getGuideDetail);

module.exports = router;
