const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Entrenador extends Model {}

Entrenador.init({
    nombre_entrenador: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    edad_entrenador: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    num_pokedex: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Entrenador',
    tableName: 'entrenadores',
    timestamps: true,
    paranoid: true
});

module.exports = Entrenador;
