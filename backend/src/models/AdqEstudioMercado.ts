import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../database/connection';

class AdqEstudioMercado extends Model<
  InferAttributes<AdqEstudioMercado>,
  InferCreationAttributes<AdqEstudioMercado>
> {
  declare id_estudio:              CreationOptional<number>;
  declare id_solicitud:            number;
  declare valor_estudio_mercado:   number | null;
  declare estatus_estudio:         string | null;
  declare tipo_contratacion:       string | null;
  declare descripcion_bien_servicio: string | null;
  declare monto_sabys:             number | null;
  declare contratacion_plurianual: string | null;
  declare monto_2026:              number | null;
  declare monto_2027:              number | null;
  declare monto_2028:              number | null;
  declare monto_2029:              number | null;
  declare created_by:              CreationOptional<string>;
  declare updated_by:              string | null;
  declare created_at:              CreationOptional<Date>;
  declare updated_at:              Date | null;
}

AdqEstudioMercado.init(
  {
    id_estudio: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    id_solicitud: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
    },
    valor_estudio_mercado: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    estatus_estudio: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    tipo_contratacion: {
      type: DataTypes.ENUM('IRP', 'LPNP', 'CP'),
      allowNull: true,
    },
    descripcion_bien_servicio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    monto_sabys: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    contratacion_plurianual: {
      type: DataTypes.ENUM('SI', 'NO'),
      allowNull: true,
    },
    monto_2026: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    monto_2027: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    monto_2028: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    monto_2029: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    created_by: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      defaultValue: '00000000-0000-0000-0000-000000000000',
    },
    updated_by: { type: DataTypes.CHAR(36), allowNull: true },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'adq_estudio_mercado',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default AdqEstudioMercado;
