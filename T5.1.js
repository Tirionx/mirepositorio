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

async function updateEntrenador(id, nombre, edad, num_pokedex) {
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

app.listen(port, () => {
    console.log(`API corriendo en http://localhost:${port}`);
});

//PUT
//http://localhost:3000/entrenadores/2

/*
{
  "nombre": "Luis Enrique",
  "edad": 27,
  "num_pokedex": 30
}
*/