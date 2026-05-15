"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const AdqCatFuentesFinanciamiento = connection_1.default.define('AdqCatFuentesFinanciamiento', {
    id_fuente_financiamiento: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    activo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'adq_cat_fuentes_financiamiento',
    timestamps: false,
});
exports.default = AdqCatFuentesFinanciamiento;
