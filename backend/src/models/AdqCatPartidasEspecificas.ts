import { DataTypes } from 'sequelize';
import db from '../database/connection';

const AdqCatPartidasEspecificas = db.define(
  'adq_cat_partidas_especificas',
  {
    id_partida_especifica: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    id_partida_generica: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
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
    tableName: 'adq_cat_partidas_especificas',
    timestamps: false
  }
);

export default AdqCatPartidasEspecificas;