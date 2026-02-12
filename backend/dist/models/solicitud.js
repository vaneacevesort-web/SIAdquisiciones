"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const documentos_1 = __importDefault(require("./documentos"));
const validadorsolicitud_1 = __importDefault(require("./validadorsolicitud"));
const user_1 = __importDefault(require("./user"));
class Solicitudes extends sequelize_1.Model {
}
Solicitudes.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    estatusId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    ap_paterno: sequelize_1.DataTypes.STRING,
    ap_materno: sequelize_1.DataTypes.STRING,
    nombres: sequelize_1.DataTypes.STRING,
    correo: sequelize_1.DataTypes.STRING,
    celular: sequelize_1.DataTypes.STRING,
    curp: sequelize_1.DataTypes.STRING,
    cedula_profesional: sequelize_1.DataTypes.STRING,
    aviso_privacidad: sequelize_1.DataTypes.BOOLEAN,
    fecha_envio: sequelize_1.DataTypes.DATE,
    fecha_validacion: sequelize_1.DataTypes.DATE,
    deletedAt: sequelize_1.DataTypes.DATE,
}, {
    sequelize: connection_1.default,
    tableName: 'solicituds',
    timestamps: true,
    paranoid: true,
});
// Relaciones
Solicitudes.hasMany(documentos_1.default, { foreignKey: 'solicitudId', as: 'documentos' });
Solicitudes.hasOne(validadorsolicitud_1.default, { foreignKey: 'solicitudId', as: 'validasolicitud' });
Solicitudes.belongsTo(user_1.default, { foreignKey: 'userId', as: 'usuario' });
exports.default = Solicitudes;
