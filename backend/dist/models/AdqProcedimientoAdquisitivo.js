"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class AdqProcedimientoAdquisitivo extends sequelize_1.Model {
}
AdqProcedimientoAdquisitivo.init({
    id_proc: { type: sequelize_1.DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    id_solicitud: { type: sequelize_1.DataTypes.BIGINT.UNSIGNED, allowNull: false, unique: true },
    fecha_liberacion_mercado: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
    id_modalidad_procedimiento: { type: sequelize_1.DataTypes.SMALLINT.UNSIGNED, allowNull: true },
    modalidad: { type: sequelize_1.DataTypes.STRING(80), allowNull: true },
    responsable: { type: sequelize_1.DataTypes.STRING(150), allowNull: true },
    no_procedimiento: { type: sequelize_1.DataTypes.STRING(60), allowNull: true },
    dictamen_procedencia: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true },
    dictamen_procedencia_path: { type: sequelize_1.DataTypes.STRING(500), allowNull: true },
    convocatoria_invitacion: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
    convocatoria_url: { type: sequelize_1.DataTypes.STRING(500), allowNull: true },
    id_medio_publicacion: { type: sequelize_1.DataTypes.TINYINT.UNSIGNED, allowNull: true },
    medio_publicacion: { type: sequelize_1.DataTypes.STRING(100), allowNull: true },
    fecha_junta_aclaracion: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
    hora_junta_aclaracion: { type: sequelize_1.DataTypes.TIME, allowNull: true },
    fecha_presentacion_apertura: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
    hora_presentacion_apertura: { type: sequelize_1.DataTypes.TIME, allowNull: true },
    fecha_sesion_comite_analisis: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
    hora_sesion_comite_analisis: { type: sequelize_1.DataTypes.TIME, allowNull: true },
    fecha_contraoferta: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
    hora_contraoferta: { type: sequelize_1.DataTypes.TIME, allowNull: true },
    fecha_dictaminacion_comite: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
    hora_dictaminacion_comite: { type: sequelize_1.DataTypes.TIME, allowNull: true },
    fecha_sesion_subcomite: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
    hora_sesion_subcomite: { type: sequelize_1.DataTypes.TIME, allowNull: true },
    fecha_fallo: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
    hora_fallo: { type: sequelize_1.DataTypes.TIME, allowNull: true },
    monto_total_adjudicado_iva: { type: sequelize_1.DataTypes.DECIMAL(18, 2), allowNull: true },
    proveedor_razon_social: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
    proveedor_rfc: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
    no_contrato: { type: sequelize_1.DataTypes.STRING(80), allowNull: true },
    vigencia_inicio: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
    vigencia_termino: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
    url_testimonio_testigo_social: { type: sequelize_1.DataTypes.STRING(500), allowNull: true },
    remanente_suficiencia_presupuestal: { type: sequelize_1.DataTypes.DECIMAL(18, 2), allowNull: true },
    estatus_adjudicacion: { type: sequelize_1.DataTypes.STRING(60), allowNull: true },
    estatus_estudio_mercado_adj: { type: sequelize_1.DataTypes.STRING(30), allowNull: true },
    comentarios_adjudicacion: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    existe_reprogramacion: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true },
    created_by: { type: sequelize_1.DataTypes.CHAR(36), allowNull: false, defaultValue: '00000000-0000-0000-0000-000000000000' },
    updated_by: { type: sequelize_1.DataTypes.CHAR(36), allowNull: true },
    created_at: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    updated_at: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, {
    sequelize: connection_1.default,
    tableName: 'adq_procedimiento_adquisitivo',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = AdqProcedimientoAdquisitivo;
