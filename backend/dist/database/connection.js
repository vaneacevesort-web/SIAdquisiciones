"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'adquisiciones', process.env.DB_USERNAME || 'homestead', process.env.DB_PASSWORD || 'secret', {
    host: process.env.DB_HOST || '192.168.56.56',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    define: {
        freezeTableName: true // evita que Sequelize pluralice
    }
});
exports.default = sequelize;
