"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class AdqSolicitudes extends sequelize_1.Model {
}
AdqSolicitudes.init({
    id_solicitud: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    folio: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    fecha_ingreso: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    id_origen_recurso: {
        type: sequelize_1.DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
    },
    tipo_solicitud: {
        type: sequelize_1.DataTypes.ENUM('BIEN', 'SERVICIO'),
        allowNull: false,
    },
    id_dependencia: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
    },
    id_opd: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
    },
    id_organo_desconcentrado: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
    },
    id_centro_costo: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
    },
    id_capitulo: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
    },
    id_subcapitulo: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
    },
    id_partida_generica: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
    },
    id_partida_especifica: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING(36),
        allowNull: true,
    },
    estatus_id: {
        type: sequelize_1.DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
    },
    estado_estudio_mercado: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: connection_1.default,
    tableName: 'adq_solicitudes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = AdqSolicitudes;
