require('dotenv').config();
const { Client } = require('pg');

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
    } catch (error) {
        console.error('Error creando el entrenador:', error);
    } finally {
        await client.end();
    }
}

createEntrenador('Luis Enrique', 27, 25);
