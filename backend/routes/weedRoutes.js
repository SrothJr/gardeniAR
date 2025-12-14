const express = require("express");
const router = express.Router();
const multer = require("multer");
const weedController = require("../controllers/weedController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", weedController.getWeeds);
router.post("/identify", upload.single("image"), weedController.identifyWeed);

module.exports = router;
