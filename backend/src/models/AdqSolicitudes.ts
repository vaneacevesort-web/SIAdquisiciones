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

  declare id_dependencia: number | null;
  declare id_opd: number | null;
  declare id_organo_desconcentrado: number | null;
  declare id_centro_costo: number | null;

  declare id_capitulo: number | null;
  declare id_subcapitulo: number | null;
  declare id_partida_generica: number | null;
  declare id_partida_especifica: number | null;

  declare user_id: string | null;
  declare estatus_id: number;
  declare estado_estudio_mercado: string | null;

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

    id_dependencia: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    id_opd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    id_organo_desconcentrado: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    id_centro_costo: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    id_capitulo: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    id_subcapitulo: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    id_partida_generica: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    id_partida_especifica: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    user_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
    },

    estatus_id: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },

    estado_estudio_mercado: {
      type: DataTypes.ENUM('CONCLUIDO', 'PROCESO', 'RECHAZADO'),
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
    tableName: 'adq_solicitudes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default AdqSolicitudes;