const Weed = require('../models/weedModel');
const geminiService = require('../services/geminiService');

// @desc    Get all reference weeds for Manual AR
// @route   GET /api/weeds
// @access  Public
exports.getWeeds = async (req, res) => {
  try {
    const weeds = await Weed.find();
    res.json(weeds);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Identify weed using AI
// @route   POST /api/weeds/identify
// @access  Public
exports.identifyWeed = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const result = await geminiService.identifyWeed(req.file.buffer, req.file.mimetype);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'AI Identification Failed', error: error.message });
  }
};
