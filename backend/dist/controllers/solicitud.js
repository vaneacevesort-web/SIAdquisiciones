"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolicitudesAfectacion = exports.getSolicitudesCola = exports.getKpis = exports.saveProcedimientoAdquisitivo = exports.getProcedimientoById = exports.saveAfectacionPresupuestal = exports.getAfectacionById = exports.createEstudioMercado = exports.getestatus = exports.getSolicitudes = exports.putRegistro = exports.saveRegistro = exports.deleteRegistro = exports.getRegistro = exports.getRegistros = void 0;
const AdqDependencias_1 = __importDefault(require("../models/AdqDependencias"));
const AdqCentrosCosto_1 = __importDefault(require("../models/AdqCentrosCosto"));
const AdqOrganismosOPDS_1 = __importDefault(require("../models/AdqOrganismosOPDS"));
const AdqCatCapitulos_1 = __importDefault(require("../models/AdqCatCapitulos"));
const AdqCatPartidasGenericas_1 = __importDefault(require("../models/AdqCatPartidasGenericas"));
const AdqCatPartidasEspecificas_1 = __importDefault(require("../models/AdqCatPartidasEspecificas"));
const sequelize_1 = require("sequelize");
const solicitud_1 = __importDefault(require("../models/solicitud"));
const user_1 = __importDefault(require("../models/user"));
const role_users_1 = __importDefault(require("../models/role_users"));
const validadorsolicitud_1 = __importDefault(require("../models/validadorsolicitud"));
const dotenv_1 = __importDefault(require("dotenv"));
const AdqSolicitudes_1 = __importDefault(require("../models/AdqSolicitudes"));
const AdqAfectacionPresupuestal_1 = __importDefault(require("../models/AdqAfectacionPresupuestal"));
const AdqBienesServicios_1 = __importDefault(require("../models/AdqBienesServicios"));
const AdqAfectacionFuentes_1 = __importDefault(require("../models/AdqAfectacionFuentes"));
const AdqProcedimientoAdquisitivo_1 = __importDefault(require("../models/AdqProcedimientoAdquisitivo"));
dotenv_1.default.config();
const getRegistros = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listSolicitudes = yield AdqSolicitudes_1.default.findAll({
            order: [['id_solicitud', 'ASC']]
        });
        const data = yield Promise.all(listSolicitudes.map((solicitud) => __awaiter(void 0, void 0, void 0, function* () {
            const item = solicitud.toJSON();
            const dependencia = item.id_dependencia
                ? yield AdqDependencias_1.default.findByPk(item.id_dependencia)
                : null;
            const centroCosto = item.id_centro_costo
                ? yield AdqCentrosCosto_1.default.findByPk(item.id_centro_costo)
                : null;
            const opd = item.id_opd
                ? yield AdqOrganismosOPDS_1.default.findByPk(item.id_opd)
                : null;
            const capitulo = item.id_capitulo
                ? yield AdqCatCapitulos_1.default.findByPk(item.id_capitulo)
                : null;
            const partidaGenerica = item.id_partida_generica
                ? yield AdqCatPartidasGenericas_1.default.findByPk(item.id_partida_generica)
                : null;
            const partidaEspecifica = item.id_partida_especifica
                ? yield AdqCatPartidasEspecificas_1.default.findByPk(item.id_partida_especifica)
                : null;
            return Object.assign(Object.assign({}, item), { origen_recurso_nombre: getOrigenRecursoNombre(item.id_origen_recurso), dependencia_nombre: (dependencia === null || dependencia === void 0 ? void 0 : dependencia.getDataValue('nombre')) || '', centro_costo_nombre: centroCosto
                    ? `${centroCosto.getDataValue('codigo')} - ${centroCosto.getDataValue('nombre')}`
                    : '', opd_nombre: opd
                    ? `${opd.getDataValue('codigo')} - ${opd.getDataValue('nombre')}`
                    : '', capitulo_nombre: capitulo
                    ? `${capitulo.getDataValue('codigo')} - ${capitulo.getDataValue('nombre')}`
                    : '', partida_generica_nombre: partidaGenerica
                    ? `${partidaGenerica.getDataValue('codigo')} - ${partidaGenerica.getDataValue('nombre')}`
                    : '', partida_especifica_nombre: partidaEspecifica
                    ? `${partidaEspecifica.getDataValue('codigo')} - ${partidaEspecifica.getDataValue('nombre')}`
                    : '' });
        })));
        return res.json({
            msg: 'Lista obtenida exitosamente',
            data
        });
    }
    catch (error) {
        console.error('ERROR REAL AL CREAR SOLICITUD =>', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: 'El folio ya existe. Captura un folio diferente.'
            });
        }
        return res.status(500).json({
            msg: 'Error al crear la solicitud',
            error: error.message
        });
    }
});
exports.getRegistros = getRegistros;
const getRegistro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const solicitud = yield AdqSolicitudes_1.default.findByPk(id);
    if (solicitud) {
        return res.json(solicitud);
    }
    return res.status(404).json({
        msg: `No existe el id ${id}`,
    });
});
exports.getRegistro = getRegistro;
const deleteRegistro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const solicitud = yield AdqSolicitudes_1.default.findByPk(id);
    if (solicitud) {
        yield solicitud.destroy();
        return res.json({
            msg: 'Eliminado con éxito',
        });
    }
    return res.status(404).json({
        msg: `No existe el id ${id}`,
    });
});
exports.deleteRegistro = deleteRegistro;
function getOrigenRecursoNombre(id) {
    switch (Number(id)) {
        case 1: return 'Estatal';
        case 2: return 'Federal';
        case 3: return 'Fideicomiso';
        case 4: return 'Concurrente o Propio';
        default: return '';
    }
}
const saveRegistro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    console.log('BODY RECIBIDO:', body);
    try {
        const folio = body.folio || body.folioInterno;
        const fechaIngreso = body.fecha_ingreso || body.fechaIngreso;
        const origenRecurso = body.id_origen_recurso || body.origenRecurso;
        if (!folio || !fechaIngreso || !origenRecurso) {
            return res.status(400).json({
                msg: 'Faltan campos obligatorios',
                body
            });
        }
        const solicitud = yield AdqSolicitudes_1.default.create({
            folio: folio,
            fecha_ingreso: fechaIngreso,
            id_origen_recurso: Number(origenRecurso),
            tipo_solicitud: body.tipo_solicitud || 'BIEN',
            id_dependencia: body.id_dependencia ? Number(body.id_dependencia) : null,
            id_opd: body.id_opd ? Number(body.id_opd) : null,
            id_organo_desconcentrado: body.id_organo_desconcentrado ? Number(body.id_organo_desconcentrado) : null,
            id_centro_costo: body.id_centro_costo ? Number(body.id_centro_costo) : null,
            id_capitulo: body.id_capitulo ? Number(body.id_capitulo) : null,
            id_subcapitulo: body.id_subcapitulo ? Number(body.id_subcapitulo) : null,
            id_partida_generica: body.id_partida_generica ? Number(body.id_partida_generica) : null,
            id_partida_especifica: body.id_partida_especifica ? Number(body.id_partida_especifica) : null,
            user_id: body.userId || body.user_id || null,
            estatus_id: 1,
        });
        return res.status(201).json({
            ok: true,
            msg: 'Solicitud registrada correctamente',
            data: {
                id_solicitud: solicitud.id_solicitud,
                folio: solicitud.folio
            }
        });
    }
    catch (error) {
        console.log('ERROR EN saveRegistro:', error);
        return res.status(500).json({
            msg: 'Ocurrió un error al cargar',
            error
        });
    }
});
exports.saveRegistro = saveRegistro;
const putRegistro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(404).json({
        msg: 'put',
    });
});
exports.putRegistro = putRegistro;
const getSolicitudes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, usuario } = req.body;
    const user = yield user_1.default.findOne({
        where: { id: usuario },
        include: [
            {
                model: role_users_1.default,
                as: 'rol_users',
            }
        ]
    });
    const roleId = (_a = user === null || user === void 0 ? void 0 : user.rol_users) === null || _a === void 0 ? void 0 : _a.role_id;
    let listSolicitudes = [];
    if (user && roleId == 1) {
        if (id == 5) {
            listSolicitudes = yield solicitud_1.default.findAll({
                where: {
                    estatusId: [1, 2]
                }
            });
        }
        else {
            listSolicitudes = yield solicitud_1.default.findAll({
                where: {
                    estatusId: id
                }
            });
        }
    }
    else {
        listSolicitudes = yield solicitud_1.default.findAll({
            where: {
                estatusId: id,
            },
            include: [
                {
                    model: validadorsolicitud_1.default,
                    as: 'validasolicitud',
                    where: {
                        validadorId: usuario,
                    },
                },
            ],
        });
    }
    return res.json({
        msg: 'Lista obtenida exitosamente',
        data: listSolicitudes
    });
});
exports.getSolicitudes = getSolicitudes;
const getestatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const solicitud = yield solicitud_1.default.findOne({
        where: {
            userId: id
        }
    });
    console.log(id, solicitud);
    if (solicitud) {
        return res.json({
            msg: 'Estatus obtenido exitosamente',
            data: solicitud.estatusId
        });
    }
    return res.status(404).json({
        msg: `No existe el id ${id}`,
    });
});
exports.getestatus = getestatus;
const createEstudioMercado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('BODY ESTUDIO MERCADO =>', req.body);
        const { id_solicitud } = req.body;
        if (!id_solicitud) {
            return res.status(400).json({
                ok: false,
                msg: 'Falta id_solicitud'
            });
        }
        yield AdqSolicitudes_1.default.update({
            estatus_id: 2
        }, {
            where: {
                id_solicitud: id_solicitud
            }
        });
        const actualizada = yield AdqSolicitudes_1.default.findByPk(id_solicitud);
        console.log('SOLICITUD ACTUALIZADA =>', actualizada === null || actualizada === void 0 ? void 0 : actualizada.toJSON());
        return res.status(200).json({
            ok: true,
            msg: 'Estudio de mercado guardado correctamente',
            data: req.body
        });
    }
    catch (error) {
        console.error('ERROR ESTUDIO MERCADO =>', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al guardar estudio de mercado'
        });
    }
});
exports.createEstudioMercado = createEstudioMercado;
const getAfectacionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [afectacion, bienesServicios] = yield Promise.all([
            AdqAfectacionPresupuestal_1.default.findOne({ where: { id_solicitud: id } }),
            AdqBienesServicios_1.default.findOne({ where: { id_solicitud: id } }),
        ]);
        let fuentes_financiamiento = [];
        if (afectacion) {
            const filas = yield AdqAfectacionFuentes_1.default.findAll({
                where: { id_afectacion: afectacion.id_afectacion },
            });
            fuentes_financiamiento = filas.map(f => f.id_fuente_financiamiento);
        }
        return res.json({
            ok: true,
            data: {
                afectacion: afectacion ? Object.assign(Object.assign({}, afectacion.toJSON()), { fuentes_financiamiento }) : null,
                bienesServicios: bienesServicios !== null && bienesServicios !== void 0 ? bienesServicios : null,
            },
        });
    }
    catch (error) {
        console.error('ERROR getAfectacionById =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener datos de afectación' });
    }
});
exports.getAfectacionById = getAfectacionById;
const saveAfectacionPresupuestal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    try {
        const { id } = req.params;
        const { afectacion, bienesServicios } = req.body;
        const idSolicitud = Number(id);
        const existeAfectacion = yield AdqAfectacionPresupuestal_1.default.findOne({ where: { id_solicitud: idSolicitud } });
        const fuentes = (_a = afectacion.fuentes_financiamiento) !== null && _a !== void 0 ? _a : [];
        let registroAfectacion;
        if (existeAfectacion) {
            yield existeAfectacion.update({
                nombre_testigo_social: (_b = afectacion.nombre_testigo_social) !== null && _b !== void 0 ? _b : null,
                tipo_gasto: afectacion.tipo_gasto,
                importe_suficiencia: (_c = afectacion.importe_suficiencia) !== null && _c !== void 0 ? _c : null,
                updated_by: (_d = afectacion.user_id) !== null && _d !== void 0 ? _d : null,
            });
            registroAfectacion = existeAfectacion;
        }
        else {
            registroAfectacion = yield AdqAfectacionPresupuestal_1.default.create({
                id_solicitud: idSolicitud,
                nombre_testigo_social: (_e = afectacion.nombre_testigo_social) !== null && _e !== void 0 ? _e : null,
                tipo_gasto: afectacion.tipo_gasto,
                importe_suficiencia: (_f = afectacion.importe_suficiencia) !== null && _f !== void 0 ? _f : null,
                created_by: (_g = afectacion.user_id) !== null && _g !== void 0 ? _g : '00000000-0000-0000-0000-000000000000',
            });
        }
        // Reemplaza todas las fuentes: borra las anteriores e inserta las nuevas
        yield AdqAfectacionFuentes_1.default.destroy({ where: { id_afectacion: registroAfectacion.id_afectacion } });
        if (fuentes.length > 0) {
            yield AdqAfectacionFuentes_1.default.bulkCreate(fuentes.map(id_fuente => ({
                id_afectacion: registroAfectacion.id_afectacion,
                id_fuente_financiamiento: id_fuente,
            })));
        }
        if (bienesServicios) {
            const existeBS = yield AdqBienesServicios_1.default.findOne({ where: { id_solicitud: idSolicitud } });
            if (existeBS) {
                yield existeBS.update({
                    clave_verificacion: (_h = bienesServicios.clave_verificacion) !== null && _h !== void 0 ? _h : null,
                    descripcion_clave_verificacion: (_j = bienesServicios.descripcion_clave_verificacion) !== null && _j !== void 0 ? _j : null,
                    unidad_medida: (_k = bienesServicios.unidad_medida) !== null && _k !== void 0 ? _k : null,
                    dictamen: bienesServicios.dictamen === 'SI',
                    contrato_abierto: bienesServicios.contrato_abierto === 'SI',
                    consolidado: bienesServicios.consolidado === 'SI',
                    updated_by: (_l = afectacion.user_id) !== null && _l !== void 0 ? _l : null,
                });
            }
            else {
                yield AdqBienesServicios_1.default.create({
                    id_solicitud: idSolicitud,
                    clave_verificacion: (_m = bienesServicios.clave_verificacion) !== null && _m !== void 0 ? _m : null,
                    descripcion_clave_verificacion: (_o = bienesServicios.descripcion_clave_verificacion) !== null && _o !== void 0 ? _o : null,
                    unidad_medida: (_p = bienesServicios.unidad_medida) !== null && _p !== void 0 ? _p : null,
                    dictamen: bienesServicios.dictamen === 'SI',
                    contrato_abierto: bienesServicios.contrato_abierto === 'SI',
                    consolidado: bienesServicios.consolidado === 'SI',
                    created_by: (_q = afectacion.user_id) !== null && _q !== void 0 ? _q : '00000000-0000-0000-0000-000000000000',
                });
            }
        }
        yield AdqSolicitudes_1.default.update({ estatus_id: 3 }, { where: { id_solicitud: idSolicitud } });
        return res.json({ ok: true, msg: 'Afectación presupuestal guardada correctamente' });
    }
    catch (error) {
        console.error('ERROR saveAfectacionPresupuestal =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al guardar afectación presupuestal' });
    }
});
exports.saveAfectacionPresupuestal = saveAfectacionPresupuestal;
const getProcedimientoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [solicitud, proc] = yield Promise.all([
            AdqSolicitudes_1.default.findByPk(id),
            AdqProcedimientoAdquisitivo_1.default.findOne({ where: { id_solicitud: id } }),
        ]);
        // Mapeo inverso: columnas BD → nombres del form
        const procedimiento = proc ? Object.assign(Object.assign({}, proc.toJSON()), { fecha_sesion_comite: proc.fecha_sesion_comite_analisis, hora_sesion_comite: proc.hora_sesion_comite_analisis, fecha_contra_oferta: proc.fecha_contraoferta, hora_contra_oferta: proc.hora_contraoferta, fecha_dictaminacion: proc.fecha_dictaminacion_comite, hora_dictaminacion: proc.hora_dictaminacion_comite, dictamen_procedencia: proc.dictamen_procedencia === true ? 'SI' : (proc.dictamen_procedencia === false ? 'NO' : null) }) : null;
        return res.json({ ok: true, data: { solicitud, procedimiento } });
    }
    catch (error) {
        console.error('ERROR getProcedimientoById =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener procedimiento' });
    }
});
exports.getProcedimientoById = getProcedimientoById;
const saveProcedimientoAdquisitivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    try {
        const { id } = req.params;
        const _v = req.body, { user_id } = _v, c = __rest(_v, ["user_id"]);
        const idSolicitud = Number(id);
        // Mapeo: nombres del form → nombres reales de columna en la BD
        const camposGuardar = {
            modalidad: (_a = c.modalidad) !== null && _a !== void 0 ? _a : null,
            responsable: (_b = c.responsable) !== null && _b !== void 0 ? _b : null,
            no_procedimiento: (_c = c.no_procedimiento) !== null && _c !== void 0 ? _c : null,
            dictamen_procedencia: c.dictamen_procedencia === 'SI' ? true : (c.dictamen_procedencia === 'NO' ? false : null),
            convocatoria_url: (_d = c.convocatoria_url) !== null && _d !== void 0 ? _d : null,
            medio_publicacion: (_e = c.medio_publicacion) !== null && _e !== void 0 ? _e : null,
            fecha_junta_aclaracion: (_f = c.fecha_junta_aclaracion) !== null && _f !== void 0 ? _f : null,
            hora_junta_aclaracion: (_g = c.hora_junta_aclaracion) !== null && _g !== void 0 ? _g : null,
            fecha_presentacion_apertura: (_h = c.fecha_presentacion_apertura) !== null && _h !== void 0 ? _h : null,
            hora_presentacion_apertura: (_j = c.hora_presentacion_apertura) !== null && _j !== void 0 ? _j : null,
            fecha_sesion_comite_analisis: (_k = c.fecha_sesion_comite) !== null && _k !== void 0 ? _k : null, // form → BD
            hora_sesion_comite_analisis: (_l = c.hora_sesion_comite) !== null && _l !== void 0 ? _l : null,
            fecha_contraoferta: (_m = c.fecha_contra_oferta) !== null && _m !== void 0 ? _m : null, // form → BD
            hora_contraoferta: (_o = c.hora_contra_oferta) !== null && _o !== void 0 ? _o : null,
            fecha_dictaminacion_comite: (_p = c.fecha_dictaminacion) !== null && _p !== void 0 ? _p : null, // form → BD
            hora_dictaminacion_comite: (_q = c.hora_dictaminacion) !== null && _q !== void 0 ? _q : null,
            fecha_sesion_subcomite: (_r = c.fecha_sesion_subcomite) !== null && _r !== void 0 ? _r : null,
            hora_sesion_subcomite: (_s = c.hora_sesion_subcomite) !== null && _s !== void 0 ? _s : null,
            fecha_fallo: (_t = c.fecha_fallo) !== null && _t !== void 0 ? _t : null,
            hora_fallo: (_u = c.hora_fallo) !== null && _u !== void 0 ? _u : null,
        };
        const existe = yield AdqProcedimientoAdquisitivo_1.default.findOne({ where: { id_solicitud: idSolicitud } });
        if (existe) {
            yield existe.update(Object.assign(Object.assign({}, camposGuardar), { updated_by: user_id !== null && user_id !== void 0 ? user_id : null }));
        }
        else {
            yield AdqProcedimientoAdquisitivo_1.default.create(Object.assign(Object.assign({ id_solicitud: idSolicitud }, camposGuardar), { created_by: user_id !== null && user_id !== void 0 ? user_id : '00000000-0000-0000-0000-000000000000' }));
        }
        // Avanzar a estatus 4 (Adquisición o Contratación)
        yield AdqSolicitudes_1.default.update({ estatus_id: 4 }, { where: { id_solicitud: idSolicitud } });
        return res.json({ ok: true, msg: 'Procedimiento adquisitivo guardado correctamente' });
    }
    catch (error) {
        console.error('ERROR saveProcedimientoAdquisitivo =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al guardar procedimiento adquisitivo' });
    }
});
exports.saveProcedimientoAdquisitivo = saveProcedimientoAdquisitivo;
const getKpis = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filas = yield AdqSolicitudes_1.default.findAll({
            attributes: ['estatus_id', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id_solicitud')), 'total']],
            group: ['estatus_id'],
            raw: true,
        });
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        filas.forEach((f) => { counts[Number(f.estatus_id)] = Number(f.total); });
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        return res.json({
            ok: true,
            data: {
                total,
                registradas: counts[1],
                estudio: counts[2] + counts[3] + counts[4] + counts[5],
                afectacion: counts[3] + counts[4] + counts[5],
                contratacion: counts[4] + counts[5],
                adjudicacion: counts[5],
            },
        });
    }
    catch (error) {
        console.error('ERROR getKpis =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener KPIs' });
    }
});
exports.getKpis = getKpis;
const getSolicitudesCola = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { estatus } = req.params;
        const solicitudes = yield AdqSolicitudes_1.default.findAll({
            where: { estatus_id: Number(estatus) },
            order: [['id_solicitud', 'DESC']],
        });
        return res.json({ ok: true, data: solicitudes });
    }
    catch (error) {
        console.error('ERROR getSolicitudesCola =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener la cola' });
    }
});
exports.getSolicitudesCola = getSolicitudesCola;
const getSolicitudesAfectacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const solicitudes = yield AdqSolicitudes_1.default.findAll({
            where: {
                estatus_id: 2
            },
            order: [['id_solicitud', 'DESC']]
        });
        return res.json({
            ok: true,
            msg: 'Solicitudes para afectación presupuestal',
            data: solicitudes
        });
    }
    catch (error) {
        console.error('ERROR AL OBTENER AFECTACIÓN =>', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al obtener solicitudes de afectación presupuestal'
        });
    }
});
exports.getSolicitudesAfectacion = getSolicitudesAfectacion;
function generarHtmlCorreo(contenidoHtml) {
    return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f7;
            margin: 0;
            padding: 0;
          }
          .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 40px auto;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            padding: 30px;
          }
          h1 {
            color: #2c3e50;
            font-size: 22px;
            margin-bottom: 20px;
          }
          p {
            color: #4d4d4d;
            font-size: 16px;
            line-height: 1.5;
          }
          .credentials {
            background-color: #ecf0f1;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-family: monospace;
          }
          .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            margin-top: 20px;
          }
          .footer {
            font-size: 12px;
            color: #999999;
            margin-top: 30px;
            text-align: center;
          }
          .pderecha {
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div style="text-align: center;">
          <img 
            src="https://congresoedomex.gob.mx/storage/images/congreso.png" 
            alt="Logo"
            style="display: block; margin: 0 auto; width: 300px; height: auto;"
          >
        </div>
        <div class="content">
          ${contenidoHtml}
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} SIDerechosHumanos. Todos los derechos reservados.
        </div>
      </body>
    </html>
  `;
}
