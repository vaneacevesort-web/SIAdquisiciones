'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class AdqCatFuentesFinanciamiento extends Model {

    static associate(models) {

    }

  }

  AdqCatFuentesFinanciamiento.init({

      id_fuente_financiamiento: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
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
      defaultValue: true
    }

  }, {

    sequelize,
    modelName: 'AdqCatFuentesFinanciamiento',
    tableName: 'adq_cat_fuentes_financiamiento',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'

  });

  return AdqCatFuentesFinanciamiento;

};