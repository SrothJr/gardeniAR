// backend/controllers/plantsController.js

const express = require('express');
const router = express.Router();
const plants = require('../models/plants');
const geminiService = require('../services/geminiService');


const getPlants = async (req, res) => {
  try {
    const {search, lang } = req.query;
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
        const { lang } = req.query;
        const Plant = await plants.findById(req.params.id);
        if (!Plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }

        const plantObj = Plant.toObject();

        if (lang && lang !== 'en' && plantObj.careTips && plantObj.careTips.length > 0) {
          try {
            plantObj.careTips = await geminiService.translateCareTips(plantObj.careTips, lang);
          } catch (e) {
            console.error("Care tips translation failed:", e);
          }
        }

        res.json(plantObj);
    } catch (err) {
        res.status(500).json({ message: err.message });

    }

};







module.exports = { getPlants, getPlantsId };

