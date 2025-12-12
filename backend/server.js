require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json()); // parse JSON bodies
app.use(cors());

const plantsRouter = require("./routes/plantsRoutes.js");
const weedRouter = require("./routes/weedRoutes.js");
const careGuideRouter = require("./routes/careGuideRoutes.js");

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.get("/", (req, res) => {
  console.log("Backend server is running");
  res.send("Backend server is running");
});

app.use("/api/plants", plantsRouter);
app.use("/api/weeds", weedRouter);
app.use("/api/care-guide", careGuideRouter);

// start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
