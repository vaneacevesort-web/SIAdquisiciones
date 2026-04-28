"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const AdqCatPartidasGenericas = connection_1.default.define('adq_cat_partidas_genericas', {
    id_partida_generica: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    id_subcapitulo: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    codigo: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    clave: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'adq_cat_partidas_genericas',
    timestamps: false
});
exports.default = AdqCatPartidasGenericas;
