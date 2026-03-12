// // backend/controllers/userController.js
// const User = require('../models/userModel');

// // Register a new user
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password, location } = req.body;
    
//     // Check if user already exists
//     let existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const user = new User({ name, email, password, location });
//     await user.save();
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Login user
// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check password (direct comparison)
//     if (user.password !== password) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update user profile
// exports.updateProfile = async (req, res) => {
//   try {
//     const { userId, name, location, profilePicture } = req.body;
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { name, location, profilePicture },
//       { new: true }
//     );
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Change user password
// exports.changePassword = async (req, res) => {
//   try {
//     const { userId, currentPassword, newPassword } = req.body;
    
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Verify current password
//     if (user.password !== currentPassword) {
//       return res.status(401).json({ message: 'Current password is incorrect' });
//     }

//     // Update password
//     user.password = newPassword;
//     await user.save();
    
//     res.json({ message: 'Password changed successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update premium status
// exports.updatePremiumStatus = async (req, res) => {
//   try {
//     const { userId, isPremium } = req.body;
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { isPremium },
//       { new: true }
//     );
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// backend/controllers/userController.js
const User = require('../models/userModel');
const ForumPost = require('../models/forumPostModel');

// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const user = new User({ name, email, password, location });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile (name, city, bio, profilePicture)
exports.updateProfile = async (req, res) => {
  try {
    const { userId, name, location, profilePicture, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, location, profilePicture, bio },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.password !== currentPassword) return res.status(401).json({ message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update premium status
exports.updatePremiumStatus = async (req, res) => {
  try {
    const { userId, isPremium } = req.body;
    const user = await User.findByIdAndUpdate(userId, { isPremium }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/profile/:userId — public profile with posts, comments, saved
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -notifications');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Posts by user
    const posts = await ForumPost.find({ author: req.params.userId })
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 });

    // Comments by user (scan all posts)
    const allPosts = await ForumPost.find({ 'comments.author': req.params.userId })
      .populate('comments.author', 'name profilePicture');

    const comments = [];
    allPosts.forEach(post => {
      post.comments.forEach(c => {
        if (c.author?._id?.toString() === req.params.userId) {
          comments.push({
            _id: c._id,
            text: c.text,
            postId: post._id,
            postTitle: post.title,
            upvotes: c.upvotes,
            downvotes: c.downvotes,
            createdAt: c.createdAt
          });
        }
      });
    });
    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Saved posts
    const savedPosts = await ForumPost.find({ savedBy: req.params.userId })
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json({ user, posts, comments, savedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/notifications/:userId
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('notifications');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const sorted = user.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users/notifications/read  { userId }
exports.markNotificationsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.notifications.forEach(n => n.read = true);
    await user.save();
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};