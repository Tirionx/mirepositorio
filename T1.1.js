const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
const PAGE_SIZE = 20;  // Tamaño de página

// Función para obtener los Pokémon según la página solicitada
async function fetchPokemons(page = 1) {
    try {
        // Calcula el offset basado en el número de página
        const offset = (page - 1) * PAGE_SIZE;
        const url = `${BASE_URL}?offset=${offset}&limit=${PAGE_SIZE}`;

        // Solicita la página específica
        const response = await axios.get(url);
        const data = response.data;

        return {
            currentPage: page,
            totalPokemons: data.count,
            totalPages: Math.ceil(data.count / PAGE_SIZE),
            pokemons: data.results
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Ruta para obtener Pokémon por página
app.get('/pokemons', async (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Toma la página de la query o usa la página 1 por defecto

    try {
        const pokemonData = await fetchPokemons(page);

        // Responde con los datos en formato JSON
        res.json(pokemonData);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los Pokémon' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

//GET
//http://localhost:3000/pokemons?page=1
