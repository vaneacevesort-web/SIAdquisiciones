"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const role_users_1 = __importDefault(require("./role_users"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Sequelize genera el UUID
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    email_verified_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    remember_token: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    sequelize: connection_1.default,
    tableName: 'users',
    timestamps: true,
    indexes: [
        {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
        },
    ],
});
// Relaciones
User.hasOne(role_users_1.default, { foreignKey: 'user_id', as: 'rol_users' });
role_users_1.default.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
exports.default = User;
