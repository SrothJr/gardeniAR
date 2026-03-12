const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Added password field
  location: {
    city: { type: String },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  createdAt: { type: Date, default: Date.now },
  isPremium: { type: Boolean, default: false },
  profilePicture: { type: String } // Base64 or URL
});

module.exports = mongoose.model('User', userSchema);