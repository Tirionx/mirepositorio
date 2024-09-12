require('dotenv').config();

const { Client } = require('pg');
const axios = require('axios');

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
    }
}

async function fetchPokemonsFromDatabase(id) {
    try {
        await client.connect();
        const res = await client.query('SELECT * FROM Entrenadores WHERE id = $1', [id]);
        if (res.rows.length > 0) {
            const num_pokedex = res.rows[0].num_pokedex;
            const name_pokemon = await fetchPokemonByNumber(num_pokedex);
            console.log('Name_Entrenador:', res.rows[0].nombre_entrenador);
            console.log('Edad:', res.rows[0].edad_entrenador);
            console.log('Name_pokemon:', name_pokemon);
        } else {
            console.log('No se encontró ningún entrenador con el ID proporcionado');
        }
    } catch (error) {
        console.error('Error querying database:', error);
    } finally {
  
        await client.end();
    }
}


fetchPokemonsFromDatabase(1);
