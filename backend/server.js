const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gardeniar')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const weedRoutes = require('./routes/weedRoutes');
app.use('/api/weeds', weedRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('GardeniAR Backend is Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
