const express = require('express');
const router = express.Router();
const {getPlants, getPlantsId} = require('../controllers/plantsController');


router.get('/', getPlants);
router.get('/:id', getPlantsId);

module.exports = router;