const taskController = require('../controllers/task.controller');

const router = require('express').Router();

router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/updateposition', taskController.updatePosition);

module.exports = router;
