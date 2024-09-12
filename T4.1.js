require('dotenv').config();
const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

async function createEntrenador(nombre, edad, num_pokedex) {
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

app.post('/entrenadores', async (req, res) => {
    const { nombre, edad, num_pokedex } = req.body;

    try {
        const result = await createEntrenador(nombre, edad, num_pokedex);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`API corriendo en http://localhost:${port}`);
});

//POST
//http://localhost:3000/entrenadores

/*
{
  "nombre": "Luis Enrique",
  "edad": 27,
  "num_pokedex": 25
}
*/