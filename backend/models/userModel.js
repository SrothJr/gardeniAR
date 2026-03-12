
// // backend/models/userModel.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }, // Added password field
//   location: {
//     city: { type: String },
//     coordinates: {
//       lat: Number,
//       lng: Number
//     }
//   },
//   createdAt: { type: Date, default: Date.now },
//   isPremium: { type: Boolean, default: false },
//   profilePicture: { type: String } // Base64 or URL
// });

// module.exports = mongoose.model('User', userSchema);

// backend/models/userModel.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['reply_post', 'reply_comment', 'upvote_post', 'upvote_comment'], required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost' },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  location: {
    city: { type: String },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  karma: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isPremium: { type: Boolean, default: false },
  profilePicture: { type: String },
  notifications: [notificationSchema]
});

module.exports = mongoose.model('User', userSchema);