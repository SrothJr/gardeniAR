// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors =require('cors');
// const app = express();
// app.use(express.json());                  // parse JSON bodies
// app.use(cors()); 

// mongoose.connect(process.env.MONGO_URI, {}).then(() => {console.log("Connected to MongoDB")})
// .catch(err => (console.error("MongoDB connection error:", err.message)));

// app.get('/', (req,res) => {
//     console.log("Backend server is running");
//     res.send("Backend server is running");
// })

// // mount the plants routes
// const plantsRouter = require('./routes/plantsRoutes.js');
// app.use('/api/plants', plantsRouter);

// // mount soil AI routes (do not overwrite other code)



// // start listening
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
require('dotenv').config();
console.log('ENV: SOIL_GEMINI_KEY present?', !!process.env.SOIL_GEMINI_KEY, 'GEMINI_API_KEY present?', !!process.env.GEMINI_API_KEY);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(cors());

// DB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Mongo error:", err.message));

app.get('/', (req, res) => {
  res.send("Backend server is running");
});

// ⭐ ADD THIS — Soil routes
const soilRouter = require('./routes/soilRoutes');
app.use('/api/soil', soilRouter);

// existing plant routes
const plantsRouter = require('./routes/plantsRoutes.js');
app.use('/api/plants', plantsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
