const express = require('express');
const router = express.Router();
const plants = require('../models/plants');


const getPlants = async (req, res) => {
  try {
    const {search } = req.query;
    const query = {};
    if (search) {
        query.name = { $regex: search, $options: 'i' }; 

    }
    const Plants = await plants.find(query);
    res.json(Plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPlantsId = async (req,res) => {

    try {
        const Plant = await plants.findById(req.params.id);
        if (!Plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }
        res.json(Plant);
    } catch (err) {
        res.status(500).json({ message: err.message });

    }

};

module.exports = { getPlants, getPlantsId };
