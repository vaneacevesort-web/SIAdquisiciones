import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from '../database/connection';
import Solicitud from './solicitud'; // Asegúrate de tener este modelo

class DetalleFecha extends Model<
  InferAttributes<DetalleFecha>,
  InferCreationAttributes<DetalleFecha>
> {
  declare id: CreationOptional<number>;
  declare fecha: Date;
  declare solicitud_id: ForeignKey<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DetalleFecha.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    solicitud_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: 'detalle_fechas',
    timestamps: true,
  }
);

// Asociación (opcional)
DetalleFecha.belongsTo(Solicitud, {
  foreignKey: 'solicitud_id',
  as: 'solicitud'
});

export default DetalleFecha;
