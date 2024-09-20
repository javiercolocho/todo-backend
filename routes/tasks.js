const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
//const taskController = require('./controllers/taskController.js')

// Obtener todas las tareas con opcional filtrado por estado
router.get('/', tasksController.getAllTasks);

// Obtener una tarea por ID
router.get('/:id', tasksController.getTaskById);

// Crear una nueva tarea
router.post('/', tasksController.createTask);

// Actualizar una tarea existente
router.put('/:id', tasksController.updateTask);

// Eliminar una tarea
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
