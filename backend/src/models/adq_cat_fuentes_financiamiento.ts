import { DataTypes } from 'sequelize';
import db from '../database/connection';

const AdqCatFuentesFinanciamiento = db.define('AdqCatFuentesFinanciamiento', {
  id_fuente_financiamiento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'adq_cat_fuentes_financiamiento',
  timestamps: false,

});

export default AdqCatFuentesFinanciamiento;