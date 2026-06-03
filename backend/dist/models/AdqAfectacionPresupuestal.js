"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class AdqAfectacionPresupuestal extends sequelize_1.Model {
}
AdqAfectacionPresupuestal.init({
    id_afectacion: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    id_solicitud: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
    },
    nombre_testigo_social: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    tipo_gasto: {
        type: sequelize_1.DataTypes.ENUM('PAD', 'GC', 'MIXTO'),
        allowNull: false,
    },
    id_fuente_financiamiento: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    oficio_suficiencia_path: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    importe_suficiencia: {
        type: sequelize_1.DataTypes.DECIMAL(18, 2),
        allowNull: true,
    },
    created_by: {
        type: sequelize_1.DataTypes.CHAR(36),
        allowNull: false,
        defaultValue: '00000000-0000-0000-0000-000000000000',
    },
    updated_by: {
        type: sequelize_1.DataTypes.CHAR(36),
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
    tableName: 'adq_afectacion_presupuestal',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = AdqAfectacionPresupuestal;
