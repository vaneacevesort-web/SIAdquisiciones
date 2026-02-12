import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from '../database/connection';
import Documentos from './documentos';
import ValidadorSolicitud from './validadorsolicitud';
import User from './user';

class Solicitudes extends Model<
  InferAttributes<Solicitudes>,
  InferCreationAttributes<Solicitudes>
> {
  declare id: CreationOptional<string>;
  declare userId: ForeignKey<string>;
  declare estatusId: ForeignKey<number>;
  declare ap_paterno: string | null;
  declare ap_materno: string | null;
  declare nombres: string | null;
  declare correo: string | null;
  declare celular: string | null;
  declare curp: string | null;
  declare cedula_profesional: string | null;
  declare aviso_privacidad: boolean | null;
  declare fecha_envio: Date | null;
  declare fecha_validacion: Date | null;
  declare deletedAt: Date | null;

  // Relaciones
  declare documentos?: Documentos[];
}

Solicitudes.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    estatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ap_paterno: DataTypes.STRING,
    ap_materno: DataTypes.STRING,
    nombres: DataTypes.STRING,
    correo: DataTypes.STRING,
    celular: DataTypes.STRING,
    curp: DataTypes.STRING,
    cedula_profesional: DataTypes.STRING,
    aviso_privacidad: DataTypes.BOOLEAN,
    fecha_envio: DataTypes.DATE,
    fecha_validacion: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'solicituds',
    timestamps: true,
    paranoid: true,
  }
);

// Relaciones
Solicitudes.hasMany(Documentos, { foreignKey: 'solicitudId', as: 'documentos' });
Solicitudes.hasOne(ValidadorSolicitud, { foreignKey: 'solicitudId', as: 'validasolicitud' });
Solicitudes.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });

export default Solicitudes;