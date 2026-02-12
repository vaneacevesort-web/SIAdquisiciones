import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../database/connection';

class TipoDocumentos extends Model<
  InferAttributes<TipoDocumentos>,
  InferCreationAttributes<TipoDocumentos>
> {
  declare id: CreationOptional<number>;
  declare valor: string | null;
  declare valor_real: string | null;
}

TipoDocumentos.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    valor: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    valor_real: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'tipodocumentos',
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

export default TipoDocumentos;
