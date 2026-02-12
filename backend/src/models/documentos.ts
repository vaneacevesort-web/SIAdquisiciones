import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from '../database/connection';
import Solicitudes from './solicitud';
import TipoDocumentos from './tipodocumentos';

class Documentos extends Model<
  InferAttributes<Documentos>,
  InferCreationAttributes<Documentos>
> {
  declare id: CreationOptional<number>;
  declare solicitudId: ForeignKey<string>;  // UUID como string
  declare tipoDocumento: number;
  declare path: string;
  declare estatus: number | null;
  declare observaciones: string | null;

  // Relación tipo, que es opcional
  declare tipo?: {
    valor: string;
  };
}

Documentos.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    solicitudId: {
      type: DataTypes.UUID,  
      allowNull: false,
      references: {
        model: 'solicituds',
        key: 'id',
      },
    },
    tipoDocumento: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estatus: {
      type: DataTypes.NUMBER, 
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'documentos',
    timestamps: true,
  }
);

// Relaciones
// Documentos.belongsTo(Solicitudes, { foreignKey: 'solicitudId', as: 'solicitud' });
Documentos.belongsTo(TipoDocumentos, { foreignKey: 'tipoDocumento', as: 'tipo' });

export default Documentos;
