import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../database/connection';

class AdqAfectacionPresupuestal extends Model<
  InferAttributes<AdqAfectacionPresupuestal>,
  InferCreationAttributes<AdqAfectacionPresupuestal>
> {
  declare id_afectacion: CreationOptional<number>;
  declare id_solicitud: number;
  declare nombre_testigo_social: string | null;
  declare tipo_gasto: 'PAD' | 'GC' | 'MIXTO';
  declare id_fuente_financiamiento: number | null;
  declare oficio_suficiencia_path: string | null;
  declare importe_suficiencia: number | null;
  declare created_by: string;
  declare updated_by: string | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: Date | null;
}

AdqAfectacionPresupuestal.init(
  {
    id_afectacion: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    id_solicitud: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
    },
    nombre_testigo_social: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tipo_gasto: {
      type: DataTypes.ENUM('PAD', 'GC', 'MIXTO'),
      allowNull: false,
    },
    id_fuente_financiamiento: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    oficio_suficiencia_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    importe_suficiencia: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    created_by: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      defaultValue: '00000000-0000-0000-0000-000000000000',
    },
    updated_by: {
      type: DataTypes.CHAR(36),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'adq_afectacion_presupuestal',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default AdqAfectacionPresupuestal;
