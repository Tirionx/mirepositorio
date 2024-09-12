const Entrenador = require('../models/Entrenador');

// Obtener todos los entrenadores
async function getAllEntrenadores(req, res) {
    try {
        const entrenadores = await Entrenador.findAll();
        res.json(entrenadores);
    } catch (error) {
        console.error('Error fetching entrenadores:', error);
        res.status(500).json({ error: 'Error al obtener los entrenadores' });
    }
}

// Crear un nuevo entrenador
async function createEntrenador(req, res) {
    const { nombre_entrenador, edad_entrenador, num_pokedex } = req.body;

    try {
        const entrenador = await Entrenador.create({
            nombre_entrenador,
            edad_entrenador,
            num_pokedex
        });

        res.status(201).json(entrenador);
    } catch (error) {
        console.error('Error creating entrenador:', error);
        res.status(500).json({ error: 'Error al crear el entrenador' });
    }
}

module.exports = {
    getAllEntrenadores,
    createEntrenador
};
