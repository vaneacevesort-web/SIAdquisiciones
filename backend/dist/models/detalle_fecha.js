"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const solicitud_1 = __importDefault(require("./solicitud")); // Asegúrate de tener este modelo
class DetalleFecha extends sequelize_1.Model {
}
DetalleFecha.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    fecha: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    solicitud_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize: connection_1.default,
    tableName: 'detalle_fechas',
    timestamps: true,
});
// Asociación (opcional)
DetalleFecha.belongsTo(solicitud_1.default, {
    foreignKey: 'solicitud_id',
    as: 'solicitud'
});
exports.default = DetalleFecha;
