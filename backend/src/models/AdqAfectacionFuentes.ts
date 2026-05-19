import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../database/connection';

class AdqAfectacionFuentes extends Model<
  InferAttributes<AdqAfectacionFuentes>,
  InferCreationAttributes<AdqAfectacionFuentes>
> {
  declare id: CreationOptional<number>;
  declare id_afectacion: number;
  declare id_fuente_financiamiento: number;
  declare created_at: CreationOptional<Date>;
}

AdqAfectacionFuentes.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    id_afectacion: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    id_fuente_financiamiento: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'adq_afectacion_fuentes',
    timestamps: false,
  }
);

export default AdqAfectacionFuentes;
