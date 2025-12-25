require("dotenv").config();
console.log(
  "ENV: SOIL_GEMINI_KEY present?",
  !!process.env.SOIL_GEMINI_KEY,
  "GEMINI_API_KEY present?",
  !!process.env.GEMINI_API_KEY
);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(cors());

// Cart
app.use("/api/cart", require("./routes/cartRoutes"));

// Orders
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/order", orderRoutes);

// Route imports
const plantsRouter = require("./routes/plantsRoutes.js");
const weedRouter = require("./routes/weedRoutes.js");
const careGuideRouter = require("./routes/careGuideRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const forumRouter = require("./routes/forumRoutes.js");
const gardenTaskRouter = require("./routes/gardenTaskRoutes.js");
const soilRouter = require("./routes/soilRoutes");
const weatherRoutes = require("./routes/weatherRoutes");



// DB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo error:", err.message));

app.get("/", (req, res) => {
  res.send("Backend server is running");
});


app.use('/api/soil', soilRouter);

// existing plant routes

app.use('/api/plants', plantsRouter);

const captionRoutes = require("./routes/captionRoutes");
app.use("/api/caption", captionRoutes);

app.use("/api/plants", plantsRouter);
app.use("/api/weeds", weedRouter);
app.use("/api/care-guide", careGuideRouter);
app.use("/api/users", userRouter);
app.use("/api/forum", forumRouter);
app.use("/api/tasks", gardenTaskRouter);
app.use("/api/weather", weatherRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
