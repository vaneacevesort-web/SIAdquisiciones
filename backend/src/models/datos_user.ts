import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from '../database/connection';
import User from './user';

class DatosUser extends Model<
  InferAttributes<DatosUser>,
  InferCreationAttributes<DatosUser>
> {
  declare id: CreationOptional<number>;
  declare nombre: string | null;
  declare apaterno: string | null;
  declare amaterno: string | null;
  declare direccion: string | null;
  declare dependencia: string | null;
  declare departamento: string | null;
  declare cargo: string | null;
  declare user_id: ForeignKey<string>;
}

DatosUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nombre: DataTypes.STRING,
    apaterno: DataTypes.STRING,
    amaterno: DataTypes.STRING,
    direccion: DataTypes.STRING,
    dependencia: DataTypes.STRING,
    departamento: DataTypes.STRING,
    cargo: DataTypes.STRING,
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'datos_users',
    timestamps: true,
  }
);

export default DatosUser;

// DatosUser.belongsTo(User, { foreignKey: 'user_id', as: 'usuario' });
