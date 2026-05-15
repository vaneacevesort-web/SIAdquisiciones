"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class DatosUser extends sequelize_1.Model {
}
DatosUser.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    nombre: sequelize_1.DataTypes.STRING,
    apaterno: sequelize_1.DataTypes.STRING,
    amaterno: sequelize_1.DataTypes.STRING,
    direccion: sequelize_1.DataTypes.STRING,
    dependencia: sequelize_1.DataTypes.STRING,
    departamento: sequelize_1.DataTypes.STRING,
    cargo: sequelize_1.DataTypes.STRING,
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: connection_1.default,
    tableName: 'datos_users',
    timestamps: true,
});
exports.default = DatosUser;
// DatosUser.belongsTo(User, { foreignKey: 'user_id', as: 'usuario' });
