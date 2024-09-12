require('dotenv').config();
const { Client } = require('pg');

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

//ACTIVIDAD 1 ///////////////////////////////////////////////////////////////////////
// Función para obtener los Pokémon según la página solicitada
async function fetchPokemons(page = 1) {
    const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
    const PAGE_SIZE = 20;  // Tamaño de página
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

//GET
//http://localhost:3000/pokemons?page=1
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ACTIVIDAD 2 ///////////////////////////////////////////////////////////////////////
async function fetchPokemonByNumber(number) {
    const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
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

//GET
//http://localhost:3000/pokemon/7
app.get('/pokemon/:number', async (req, res) => {
    const number = req.params.number;

    try {
        const pokemonData = await fetchPokemonByNumber(number);

        res.json(pokemonData);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos del Pokémon' });
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ACTIVIDAD 3 ///////////////////////////////////////////////////////////////////////
async function fetchPokemonNameByNumber(number) {
    const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
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

//GET
//http://localhost:3000/entrenador/1
app.get('/entrenador/:id', async (req, res) => {
    const id = req.params.id;
    const client = new Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
    });
    try {
        await client.connect();

        // Consulta en la base de datos para obtener el entrenador
        const result = await client.query('SELECT * FROM Entrenadores WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            const entrenador = result.rows[0];
            const num_pokedex = entrenador.num_pokedex;
            const pokemonName = await fetchPokemonNameByNumber(num_pokedex);

            // Respuesta JSON con los datos del entrenador y el nombre del Pokémon
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ACTIVIDAD 4 ///////////////////////////////////////////////////////////////////////
async function createEntrenador(nombre, edad, num_pokedex) {
    const client = new Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
    });
    try {
        await client.connect();

        const query = 'INSERT INTO Entrenadores (nombre_entrenador, edad_entrenador, num_pokedex) VALUES ($1, $2, $3)';
        const values = [nombre, edad, num_pokedex];

        await client.query(query, values);

        console.log(`Entrenador ${nombre} creado exitosamente.`);
        return { message: `Entrenador ${nombre} creado exitosamente.` };
    } catch (error) {
        console.error('Error creando el entrenador:', error);
        throw new Error('Error creando el entrenador');
    } finally {
        await client.end();
    }
}

//POST
//http://localhost:3000/entrenadores

/*
{
  "nombre": "Luis Enrique",
  "edad": 27,
  "num_pokedex": 25
}
*/
app.post('/entrenadores', async (req, res) => {
    const { nombre, edad, num_pokedex } = req.body;

    try {
        const result = await createEntrenador(nombre, edad, num_pokedex);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ACTIVIDAD 5 ///////////////////////////////////////////////////////////////////////
async function updateEntrenador(id, nombre, edad, num_pokedex) {
    const client = new Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
    });
    try {
        await client.connect();

        const query = `
            UPDATE Entrenadores
            SET nombre_entrenador = $1, edad_entrenador = $2, num_pokedex = $3
            WHERE id = $4
        `;
        const values = [nombre, edad, num_pokedex, id];

        const res = await client.query(query, values);

        if (res.rowCount > 0) {
            console.log(`Entrenador con ID ${id} actualizado exitosamente.`);
            return { message: `Entrenador con ID ${id} actualizado exitosamente.` };
        } else {
            console.log(`No se encontró ningún entrenador con el ID ${id}.`);
            return { message: `No se encontró ningún entrenador con el ID ${id}.` };
        }
    } catch (error) {
        console.error('Error actualizando el entrenador:', error);
        throw new Error('Error actualizando el entrenador');
    } finally {
        await client.end();
    }
}

//PUT
//http://localhost:3000/entrenadores/2

/*
{
  "nombre": "Luis Enrique",
  "edad": 27,
  "num_pokedex": 30
}
*/
app.put('/entrenadores/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { nombre, edad, num_pokedex } = req.body;

    try {
        const result = await updateEntrenador(id, nombre, edad, num_pokedex);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ACTIVIDAD 6 ///////////////////////////////////////////////////////////////////////
async function deleteEntrenador(id) {
    const client = new Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
    });
    try {
        await client.connect();

        const query = 'DELETE FROM Entrenadores WHERE id = $1';
        const values = [id];

        const res = await client.query(query, values);

        if (res.rowCount > 0) {
            console.log(`Entrenador con ID ${id} eliminado exitosamente.`);
            return { message: `Entrenador con ID ${id} eliminado exitosamente.` };
        } else {
            console.log(`No se encontró ningún entrenador con el ID ${id}.`);
            return { message: `No se encontró ningún entrenador con el ID ${id}.` };
        }
    } catch (error) {
        console.error('Error eliminando el entrenador:', error);
        throw new Error('Error eliminando el entrenador');
    } finally {
        await client.end();
    }
}

//DELETE
//http://localhost:3000/entrenadores/2
app.delete('/entrenadores/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const result = await deleteEntrenador(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});