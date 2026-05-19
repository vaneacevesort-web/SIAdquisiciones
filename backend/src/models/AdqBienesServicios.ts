import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../database/connection';

class AdqBienesServicios extends Model<
  InferAttributes<AdqBienesServicios>,
  InferCreationAttributes<AdqBienesServicios>
> {
  declare id_bs: CreationOptional<number>;
  declare id_solicitud: number;
  declare clave_verificacion: string | null;
  declare descripcion_clave_verificacion: string | null;
  declare unidad_medida: string | null;
  declare dictamen: boolean;
  declare dictamen_path: string | null;
  declare contrato_abierto: boolean;
  declare consolidado: boolean;
  declare created_by: string;
  declare updated_by: string | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: Date | null;
}

AdqBienesServicios.init(
  {
    id_bs: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    id_solicitud: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
    },
    clave_verificacion: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    descripcion_clave_verificacion: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    unidad_medida: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    dictamen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    dictamen_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    contrato_abierto: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    consolidado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'adq_bienes_servicios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default AdqBienesServicios;
