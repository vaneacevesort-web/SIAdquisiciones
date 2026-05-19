"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class AdqProcedimientoAdquisitivo extends sequelize_1.Model {
}
AdqProcedimientoAdquisitivo.init({
    id_procedimiento: { type: sequelize_1.DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    id_solicitud: { type: sequelize_1.DataTypes.BIGINT.UNSIGNED, allowNull: false, unique: true },
    modalidad: { type: sequelize_1.DataTypes.STRING(60), allowNull: true },
    created_by: { type: sequelize_1.DataTypes.CHAR(36), allowNull: false, defaultValue: '00000000-0000-0000-0000-000000000000' },
    updated_by: { type: sequelize_1.DataTypes.CHAR(36), allowNull: true },
    created_at: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    updated_at: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, {
    sequelize: connection_1.default,
    tableName: 'adq_procedimiento_adquisitivo',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = AdqProcedimientoAdquisitivo;
