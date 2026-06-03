import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../database/connection';

class AdqProcedimientoAdquisitivo extends Model<
  InferAttributes<AdqProcedimientoAdquisitivo>,
  InferCreationAttributes<AdqProcedimientoAdquisitivo>
> {
  declare id_proc:                     CreationOptional<number>;
  declare id_solicitud:                number;
  declare fecha_liberacion_mercado:    string | null;
  declare id_modalidad_procedimiento:  number | null;
  declare modalidad:                   string | null;
  declare responsable:                 string | null;
  declare no_procedimiento:            string | null;
  declare dictamen_procedencia:        boolean | null;
  declare dictamen_procedencia_path:   string | null;
  declare convocatoria_invitacion:     string | null;
  declare convocatoria_url:            string | null;
  declare id_medio_publicacion:        number | null;
  declare medio_publicacion:           string | null;
  declare fecha_junta_aclaracion:        string | null;
  declare hora_junta_aclaracion:         string | null;
  declare fecha_presentacion_apertura:   string | null;
  declare hora_presentacion_apertura:    string | null;
  declare fecha_sesion_comite_analisis:  string | null;
  declare hora_sesion_comite_analisis:   string | null;
  declare fecha_contraoferta:            string | null;
  declare hora_contraoferta:             string | null;
  declare fecha_dictaminacion_comite:    string | null;
  declare hora_dictaminacion_comite:     string | null;
  declare fecha_sesion_subcomite:        string | null;
  declare hora_sesion_subcomite:         string | null;
  declare fecha_fallo:                   string | null;
  declare hora_fallo:                    string | null;
  declare monto_total_adjudicado_iva:  number | null;
  declare proveedor_razon_social:      string | null;
  declare proveedor_rfc:               string | null;
  declare no_contrato:                 string | null;
  declare vigencia_inicio:             string | null;
  declare vigencia_termino:            string | null;
  declare url_testimonio_testigo_social:   string | null;
  declare remanente_suficiencia_presupuestal: number | null;
  declare estatus_adjudicacion:            string | null;
  declare estatus_estudio_mercado_adj:     string | null;
  declare comentarios_adjudicacion:        string | null;
  declare existe_reprogramacion:           boolean | null;
  declare created_by:                  string;
  declare updated_by:                  string | null;
  declare created_at:                  CreationOptional<Date>;
  declare updated_at:                  Date | null;
}

AdqProcedimientoAdquisitivo.init(
  {
    id_proc:                    { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    id_solicitud:               { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, unique: true },
    fecha_liberacion_mercado:   { type: DataTypes.DATEONLY, allowNull: true },
    id_modalidad_procedimiento: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: true },
    modalidad:                  { type: DataTypes.STRING(80), allowNull: true },
    responsable:                { type: DataTypes.STRING(150), allowNull: true },
    no_procedimiento:           { type: DataTypes.STRING(60), allowNull: true },
    dictamen_procedencia:       { type: DataTypes.BOOLEAN, allowNull: true },
    dictamen_procedencia_path:  { type: DataTypes.STRING(500), allowNull: true },
    convocatoria_invitacion:    { type: DataTypes.STRING(255), allowNull: true },
    convocatoria_url:           { type: DataTypes.STRING(500), allowNull: true },
    id_medio_publicacion:       { type: DataTypes.TINYINT.UNSIGNED, allowNull: true },
    medio_publicacion:          { type: DataTypes.STRING(100), allowNull: true },
    fecha_junta_aclaracion:       { type: DataTypes.DATEONLY, allowNull: true },
    hora_junta_aclaracion:        { type: DataTypes.TIME, allowNull: true },
    fecha_presentacion_apertura:  { type: DataTypes.DATEONLY, allowNull: true },
    hora_presentacion_apertura:   { type: DataTypes.TIME, allowNull: true },
    fecha_sesion_comite_analisis: { type: DataTypes.DATEONLY, allowNull: true },
    hora_sesion_comite_analisis:  { type: DataTypes.TIME, allowNull: true },
    fecha_contraoferta:           { type: DataTypes.DATEONLY, allowNull: true },
    hora_contraoferta:            { type: DataTypes.TIME, allowNull: true },
    fecha_dictaminacion_comite:   { type: DataTypes.DATEONLY, allowNull: true },
    hora_dictaminacion_comite:    { type: DataTypes.TIME, allowNull: true },
    fecha_sesion_subcomite:       { type: DataTypes.DATEONLY, allowNull: true },
    hora_sesion_subcomite:        { type: DataTypes.TIME, allowNull: true },
    fecha_fallo:                  { type: DataTypes.DATEONLY, allowNull: true },
    hora_fallo:                   { type: DataTypes.TIME, allowNull: true },
    monto_total_adjudicado_iva: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    proveedor_razon_social:     { type: DataTypes.STRING(255), allowNull: true },
    proveedor_rfc:              { type: DataTypes.STRING(255), allowNull: true },
    no_contrato:                { type: DataTypes.STRING(80), allowNull: true },
    vigencia_inicio:            { type: DataTypes.DATEONLY, allowNull: true },
    vigencia_termino:           { type: DataTypes.DATEONLY, allowNull: true },
    url_testimonio_testigo_social:      { type: DataTypes.STRING(500), allowNull: true },
    remanente_suficiencia_presupuestal: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    estatus_adjudicacion:               { type: DataTypes.STRING(60), allowNull: true },
    estatus_estudio_mercado_adj:        { type: DataTypes.STRING(30), allowNull: true },
    comentarios_adjudicacion:           { type: DataTypes.TEXT, allowNull: true },
    existe_reprogramacion:              { type: DataTypes.BOOLEAN, allowNull: true },
    created_by:  { type: DataTypes.CHAR(36), allowNull: false, defaultValue: '00000000-0000-0000-0000-000000000000' },
    updated_by:  { type: DataTypes.CHAR(36), allowNull: true },
    created_at:  { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at:  { type: DataTypes.DATE, allowNull: true },
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
