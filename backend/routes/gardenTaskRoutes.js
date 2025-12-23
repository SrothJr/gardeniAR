const express = require('express');
const router = express.Router();
const gardenTaskController = require('../controllers/gardenTaskController');

router.get('/:userId', gardenTaskController.getTasks);
router.post('/', gardenTaskController.createTask);
router.put('/:id', gardenTaskController.toggleTaskStatus);
router.delete('/:id', gardenTaskController.deleteTask);

module.exports = router;
