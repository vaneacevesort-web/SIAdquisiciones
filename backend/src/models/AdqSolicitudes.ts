import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from '../database/connection';

class AdqSolicitudes extends Model<
  InferAttributes<AdqSolicitudes>,
  InferCreationAttributes<AdqSolicitudes>
> {
  declare id_solicitud: CreationOptional<number>;
  declare folio: string;
  declare fecha_ingreso: string;
  declare id_origen_recurso: number;
  declare tipo_solicitud: 'BIEN' | 'SERVICIO';
  declare created_at: CreationOptional<Date>;
  declare updated_at: Date | null;
}

AdqSolicitudes.init(
  {
    id_solicitud: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    folio: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    id_origen_recurso: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
    },
    tipo_solicitud: {
      type: DataTypes.ENUM('BIEN', 'SERVICIO'),
      allowNull: false,
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
    tableName: 'adq_solicitudes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default AdqSolicitudes;