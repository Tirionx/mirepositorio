require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const axios = require('axios');

const app = express();
const port = 3000;

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

async function fetchPokemonByNumber(number) {
    try {
        const url = `${BASE_URL}${number}/`;
        const response = await axios.get(url);
        const data = response.data;
        return data.name;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

app.get('/entrenador/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await client.connect();

        const result = await client.query('SELECT * FROM Entrenadores WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            const entrenador = result.rows[0];
            const num_pokedex = entrenador.num_pokedex;
            const pokemonName = await fetchPokemonByNumber(num_pokedex);

            res.json({
                nombre_entrenador: entrenador.nombre_entrenador,
                edad_entrenador: entrenador.edad_entrenador,
                num_pokedex: num_pokedex,
                nombre_pokemon: pokemonName
            });
        } else {
            res.status(404).json({ error: 'Entrenador no encontrado' });
        }
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        await client.end();
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

//GET
//http://localhost:3000/entrenador/1