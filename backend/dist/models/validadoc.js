"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class Validadoc extends sequelize_1.Model {
}
Validadoc.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    solicitudId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    cadena: {
        type: sequelize_1.DataTypes.TEXT('long'), // ✅ LONGTEXT
        allowNull: false,
    },
    folio: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    sello: {
        type: sequelize_1.DataTypes.TEXT('long'), // ✅ LONGTEXT
        allowNull: false,
    },
    createdAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Validadoc',
    tableName: 'validadocs',
    timestamps: true,
});
exports.default = Validadoc;
