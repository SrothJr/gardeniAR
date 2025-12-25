const express = require('express');
const router = express.Router();
const Companion = require('../models/Companions');
const fs = require('fs');
const path = require('path');

// Load initial data from companion.json
router.get('/seed', async (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../companion.json');
        const rawData = fs.readFileSync(dataPath);
        const companions = JSON.parse(rawData);

        // Remove existing data and insert new
        await Companion.deleteMany({});
        await Companion.insertMany(companions);

        res.status(200).json({ message: 'Database seeded successfully', count: companions.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all plants with companion info
router.get('/', async (req, res) => {
    try {
        const plants = await Companion.find();
        res.json(plants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single plant by name
router.get('/:name', async (req, res) => {
    try {
        const plant = await Companion.findOne({ name: req.params.name });
        if (!plant) return res.status(404).json({ message: 'Plant not found' });
        res.json(plant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
