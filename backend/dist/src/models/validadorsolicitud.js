"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const user_1 = __importDefault(require("./user"));
class ValidadorSolicitud extends sequelize_1.Model {
}
ValidadorSolicitud.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    solicitudId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: "solicituds", key: "id" },
        field: "solicitudId",
    },
    validadorId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        field: "validadorId",
    },
}, {
    sequelize: connection_1.default,
    modelName: "ValidadorSolicitud",
    tableName: "validadorsolicituds",
    timestamps: true,
});
// Relaciones
// ValidadorSolicitud.belongsTo(Solicitud, {
//   foreignKey: "solicitudId",
//   as: "solicitud",
// });
ValidadorSolicitud.belongsTo(user_1.default, {
    foreignKey: "validadorId",
    as: "validador",
});
exports.default = ValidadorSolicitud;
