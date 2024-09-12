const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mi_basedatos', 'postgres', '12345678', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false // Opcional, para desactivar los logs de SQL
});

module.exports = sequelize;
