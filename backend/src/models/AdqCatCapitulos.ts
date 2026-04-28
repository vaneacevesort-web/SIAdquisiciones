import { DataTypes } from 'sequelize';
import db from '../database/connection';

const AdqCatCapitulos = db.define(
  'adq_cat_capitulos',
  {
    id_capitulo: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    clave: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'adq_cat_capitulos',
    timestamps: false
  }
);

export default AdqCatCapitulos;