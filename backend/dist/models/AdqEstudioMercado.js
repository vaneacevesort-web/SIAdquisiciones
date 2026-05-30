"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class AdqEstudioMercado extends sequelize_1.Model {
}
AdqEstudioMercado.init({
    id_estudio: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    id_solicitud: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
    },
    valor_estudio_mercado: {
        type: sequelize_1.DataTypes.DECIMAL(18, 2),
        allowNull: true,
    },
    estatus_estudio: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    tipo_solicitud: {
        type: sequelize_1.DataTypes.ENUM('BIEN', 'SERVICIO'),
        allowNull: true,
    },
    tipo_contratacion: {
        type: sequelize_1.DataTypes.ENUM('IRP', 'LPNP', 'CP'),
        allowNull: true,
    },
    descripcion_bien_servicio: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    monto_sabys: {
        type: sequelize_1.DataTypes.DECIMAL(18, 2),
        allowNull: true,
    },
    contratacion_plurianual: {
        type: sequelize_1.DataTypes.ENUM('SI', 'NO'),
        allowNull: true,
    },
    monto_2026: { type: sequelize_1.DataTypes.DECIMAL(18, 2), allowNull: true },
    monto_2027: { type: sequelize_1.DataTypes.DECIMAL(18, 2), allowNull: true },
    monto_2028: { type: sequelize_1.DataTypes.DECIMAL(18, 2), allowNull: true },
    monto_2029: { type: sequelize_1.DataTypes.DECIMAL(18, 2), allowNull: true },
    created_by: {
        type: sequelize_1.DataTypes.CHAR(36),
        allowNull: false,
        defaultValue: '00000000-0000-0000-0000-000000000000',
    },
    updated_by: { type: sequelize_1.DataTypes.CHAR(36), allowNull: true },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, {
    sequelize: connection_1.default,
    tableName: 'adq_estudio_mercado',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = AdqEstudioMercado;
