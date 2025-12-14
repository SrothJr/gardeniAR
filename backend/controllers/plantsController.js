// backend/controllers/plantsController.js

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
// CREATE a new plant (POST)
const createPlant = async (req, res) => {
  try {
    const plant = new plants(req.body);
    const savedPlant = await plant.save();
    res.status(201).json(savedPlant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE an existing plant (PUT)
const updatePlant = async (req, res) => {
  try {
    const updatedPlant = await plants.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPlant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE a plant (DELETE)
const deletePlant = async (req, res) => {
  try {
    await plants.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//module.exports = { getPlants, getPlantsId };
module.exports = {
  getPlants,
  getPlantsId,
  createPlant,
  updatePlant,
  deletePlant
};
