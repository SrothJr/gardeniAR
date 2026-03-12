const express = require('express');
const router = express.Router();
const gardenTaskController = require('../controllers/gardenTaskController');

router.post('/smart-add', gardenTaskController.smartAddTask);
router.post('/optimize', gardenTaskController.optimizeTasks);
router.post('/generate-routine', gardenTaskController.generateRoutine);
router.get('/:userId', gardenTaskController.getTasks);
router.post('/', gardenTaskController.createTask);
router.put('/:id', gardenTaskController.toggleTaskStatus);
router.delete('/:id', gardenTaskController.deleteTask);

module.exports = router;
