const express = require('express');
const entrenadorRoutes = require('./routes/entrenadorRoutes');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para procesar JSON
app.use(bodyParser.json());

// Rutas
app.use('/', entrenadorRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
