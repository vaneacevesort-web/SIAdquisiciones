import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/connection';

class AdqProcedimientoAdquisitivo extends Model<
  InferAttributes<AdqProcedimientoAdquisitivo>,
  InferCreationAttributes<AdqProcedimientoAdquisitivo>
> {
  declare id_procedimiento: CreationOptional<number>;
  declare id_solicitud: number;
  declare modalidad: string | null;
  declare created_by: string;
  declare updated_by: string | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: Date | null;
}

AdqProcedimientoAdquisitivo.init(
  {
    id_procedimiento: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    id_solicitud:     { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, unique: true },
    modalidad:        { type: DataTypes.STRING(60), allowNull: true },
    created_by:       { type: DataTypes.CHAR(36), allowNull: false, defaultValue: '00000000-0000-0000-0000-000000000000' },
    updated_by:       { type: DataTypes.CHAR(36), allowNull: true },
    created_at:       { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at:       { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'adq_procedimiento_adquisitivo',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default AdqProcedimientoAdquisitivo;
