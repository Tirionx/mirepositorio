const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController');

// Ruta para obtener todos los entrenadores
router.get('/entrenadores', entrenadorController.getAllEntrenadores);

// Ruta para crear un nuevo entrenador
router.post('/entrenadores', entrenadorController.createEntrenador);

module.exports = router;
