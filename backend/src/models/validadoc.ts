import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from '../database/connection';

class Validadoc extends Model<
  InferAttributes<Validadoc>,
  InferCreationAttributes<Validadoc>
> {
  declare id: CreationOptional<number>;
  declare solicitudId: ForeignKey<string>;  // UUID como string
  declare cadena: string;
  declare folio: string;
  declare sello: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare tipo?: {
    valor: string;
  };
}

Validadoc.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    solicitudId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    cadena: {
      type: DataTypes.TEXT('long'), // ✅ LONGTEXT
      allowNull: false,
    },
    folio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sello: {
      type: DataTypes.TEXT('long'), // ✅ LONGTEXT
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Validadoc',
    tableName: 'validadocs',
    timestamps: true,
  }
);

export default Validadoc;
