import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../database/connection';
import RolUsers from './role_users'; 
import { v4 as uuidv4 } from 'uuid';
import DatosUser from './datos_user';
import Solicitudes from './solicitud';

class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
  
> {
  declare id: CreationOptional<string>; // UUID como string
  declare name: string | null;
  declare email: string | null;
  declare email_verified_at: Date | null;
  declare password: string | null;
  declare remember_token: string | null;
  declare rol_users?: { role_id: number };
  declare datos_user?: DatosUser;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Sequelize genera el UUID
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    remember_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
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
  }
);

// Relaciones
User.hasOne(RolUsers, { foreignKey: 'user_id', as: 'rol_users' });
User.hasOne(DatosUser, { foreignKey: 'user_id', as: 'datos_user' });
RolUsers.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default User;
