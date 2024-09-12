const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

async function fetchPokemonByNumber(number) {
    try {
        const url = `${BASE_URL}${number}/`;
        const response = await axios.get(url);
        const data = response.data;

        return {
            id: data.id,
            name: data.name,
            height: data.height,
            weight: data.weight,
            types: data.types.map(typeInfo => typeInfo.type.name),
            abilities: data.abilities.map(abilityInfo => abilityInfo.ability.name)
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

app.get('/pokemon/:number', async (req, res) => {
    const number = req.params.number;

    try {
        const pokemonData = await fetchPokemonByNumber(number);

        res.json(pokemonData);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos del Pokémon' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

//GET
//http://localhost:3000/pokemon/7
