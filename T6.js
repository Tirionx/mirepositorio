require('dotenv').config();
const { Client } = require('pg');

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
        } else {
            console.log(`No se encontró ningún entrenador con el ID ${id}.`);
        }
    } catch (error) {
        console.error('Error eliminando el entrenador:', error);
    } finally {
        await client.end();
    }
}

deleteEntrenador(2);
