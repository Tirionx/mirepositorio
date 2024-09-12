require('dotenv').config();
const { Client } = require('pg');

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
        } else {
            console.log(`No se encontró ningún entrenador con el ID ${id}.`);
        }
    } catch (error) {
        console.error('Error actualizando el entrenador:', error);
    } finally {
        await client.end();
    }
}

updateEntrenador(2, 'Luis Enrique', 27, 30);
