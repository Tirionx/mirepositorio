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

async function deleteEntrenador(id) {
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

app.delete('/entrenadores/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const result = await deleteEntrenador(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`API corriendo en http://localhost:${port}`);
});

//DELETE
//http://localhost:3000/entrenadores/2