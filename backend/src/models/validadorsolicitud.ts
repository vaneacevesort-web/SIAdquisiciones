import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "../database/connection";
import Solicitud from "./solicitud";
import User from "./user";

class ValidadorSolicitud extends Model<
  InferAttributes<ValidadorSolicitud>,
  InferCreationAttributes<ValidadorSolicitud>
> {
  declare id: CreationOptional<number>;
  declare solicitudId: ForeignKey<string>; // UUID como string
  declare validadorId: ForeignKey<string>; // UUID como string

  // Relaciones opcionales
  declare solicitud?: Solicitud;
  declare validador?: User;
}

ValidadorSolicitud.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    solicitudId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "solicituds", key: "id" },
      field: "solicitudId",
    },
    validadorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      field: "validadorId",
    },
  },
  {
    sequelize,
    modelName: "ValidadorSolicitud",
    tableName: "validadorsolicituds",
    timestamps: true,
  }
);

// Relaciones
// ValidadorSolicitud.belongsTo(Solicitud, {
//   foreignKey: "solicitudId",
//   as: "solicitud",
// });
ValidadorSolicitud.belongsTo(User, {
  foreignKey: "validadorId",
  as: "validador",
});

export default ValidadorSolicitud;
