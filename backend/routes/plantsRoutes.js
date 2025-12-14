// backend/routes/plantsRoutes.js
const express = require('express');
const router = express.Router();
//const {getPlants, getPlantsId} = require('../controllers/plantsController');

//for assignment purposes
const {
  getPlants,
  getPlantsId,
  createPlant,
  updatePlant,
  deletePlant
} = require('../controllers/plantsController');



router.get('/', getPlants);
router.get('/:id', getPlantsId);
 //for assignment purposes
 // ADD THESE:
router.post('/', createPlant);          // POST
router.put('/:id', updatePlant);        // PUT
router.delete('/:id', deletePlant); 

module.exports = router;