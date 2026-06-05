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
exports.getInformeContratos = exports.getSolicitudesAfectacion = exports.getSolicitudesCola = exports.getActividadCalendario = exports.getOrigenDetalle = exports.getDependenciasResumen = exports.getSemaforo = exports.exportarExcelGestion = exports.getEvolucionMensual = exports.getTopDependencias = exports.getKpis = exports.saveAdjudicacion = exports.getAdjudicacionById = exports.saveProcedimientoAdquisitivo = exports.getProcedimientoById = exports.saveAfectacionPresupuestal = exports.getAfectacionById = exports.createEstudioMercado = exports.getEstudioMercadoById = exports.getestatus = exports.getSolicitudes = exports.putRegistro = exports.saveRegistro = exports.deleteRegistro = exports.getRegistro = exports.getRegistros = void 0;
const AdqDependencias_1 = __importDefault(require("../models/AdqDependencias"));
const AdqCentrosCosto_1 = __importDefault(require("../models/AdqCentrosCosto"));
const AdqOrganismosOPDS_1 = __importDefault(require("../models/AdqOrganismosOPDS"));
const AdqCatCapitulos_1 = __importDefault(require("../models/AdqCatCapitulos"));
const AdqCatSubcapitulos_1 = __importDefault(require("../models/AdqCatSubcapitulos"));
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
const AdqEstudioMercado_1 = __importDefault(require("../models/AdqEstudioMercado"));
const adq_cat_fuentes_financiamiento_1 = __importDefault(require("../models/adq_cat_fuentes_financiamiento"));
const exceljs_1 = __importDefault(require("exceljs"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
function safeId(val) {
    const n = parseInt(val, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
}
function getOrigenRecursoNombre(id) {
    switch (Number(id)) {
        case 1: return 'Estatal';
        case 2: return 'Federal';
        case 3: return 'Fideicomiso';
        case 4: return 'Concurrente';
        case 5: return 'Propio';
        default: return '';
    }
}
const saveRegistro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
            id_dependencia: safeId(body.id_dependencia),
            id_opd: safeId(body.id_opd),
            id_organo_desconcentrado: safeId(body.id_organo_desconcentrado),
            id_centro_costo: safeId(body.id_centro_costo),
            id_capitulo: safeId(body.id_capitulo),
            id_subcapitulo: safeId(body.id_subcapitulo),
            id_partida_generica: safeId(body.id_partida_generica),
            id_partida_especifica: safeId(body.id_partida_especifica),
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
        if (error.name === 'SequelizeUniqueConstraintError' ||
            ((_a = error.original) === null || _a === void 0 ? void 0 : _a.code) === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                ok: false,
                code: 'FOLIO_DUPLICADO',
                msg: 'El folio interno ya existe. Ingresa un folio diferente.',
            });
        }
        console.error('ERROR EN saveRegistro:', error);
        return res.status(500).json({ ok: false, msg: 'Ocurrió un error al guardar la solicitud.' });
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
const getEstudioMercadoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const estudio = yield AdqEstudioMercado_1.default.findOne({ where: { id_solicitud: id } });
        return res.json({ ok: true, data: { estudio: estudio !== null && estudio !== void 0 ? estudio : null } });
    }
    catch (error) {
        console.error('ERROR getEstudioMercadoById =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener estudio de mercado' });
    }
});
exports.getEstudioMercadoById = getEstudioMercadoById;
const createEstudioMercado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id_solicitud, estado_estudio_mercado, tipo_contratacion, descripcion_bien_servicio, valor_estudio_mercado, monto_sabys, contratacion_plurianual, monto_2026, monto_2027, monto_2028, monto_2029, } = req.body;
    if (!id_solicitud) {
        return res.status(400).json({ ok: false, msg: 'Falta id_solicitud' });
    }
    // ── 1. Avanza estatus (esta columna siempre existe) ───────────────────────
    try {
        yield AdqSolicitudes_1.default.update({ estatus_id: 2 }, { where: { id_solicitud } });
    }
    catch (e) {
        console.error('[EM] Error al actualizar estatus_id:', e === null || e === void 0 ? void 0 : e.message);
        return res.status(500).json({ ok: false, msg: 'Error al actualizar estatus de la solicitud.', detail: e === null || e === void 0 ? void 0 : e.message });
    }
    // ── 2. Actualiza semáforo en adq_solicitudes (columna puede no existir aún) ─
    if (estado_estudio_mercado) {
        try {
            yield AdqSolicitudes_1.default.update({ estado_estudio_mercado }, { where: { id_solicitud } });
        }
        catch (e) {
            console.warn('[EM] estado_estudio_mercado no guardado (¿ejecutaste add_estado_estudio_mercado.sql?):', e === null || e === void 0 ? void 0 : e.message);
        }
    }
    // ── 3. Upsert en adq_estudio_mercado ─────────────────────────────────────
    const n = (v) => (v != null && v !== '' ? Number(v) : null);
    const estudioData = {
        tipo_contratacion: tipo_contratacion || null,
        descripcion_bien_servicio: descripcion_bien_servicio || null,
        valor_estudio_mercado: n(valor_estudio_mercado),
        estatus_estudio: estado_estudio_mercado || null,
        monto_sabys: n(monto_sabys),
        contratacion_plurianual: contratacion_plurianual || null,
        monto_2026: n(monto_2026),
        monto_2027: n(monto_2027),
        monto_2028: n(monto_2028),
        monto_2029: n(monto_2029),
    };
    try {
        const existente = yield AdqEstudioMercado_1.default.findOne({ where: { id_solicitud } });
        if (existente) {
            yield existente.update(estudioData);
        }
        else {
            yield AdqEstudioMercado_1.default.create(Object.assign({ id_solicitud: Number(id_solicitud) }, estudioData));
        }
    }
    catch (e) {
        console.error('[EM] Error en adq_estudio_mercado:', e === null || e === void 0 ? void 0 : e.message);
        const msg = ((_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : '').toLowerCase();
        if (msg.includes("doesn't exist") || msg.includes('no existe')) {
            return res.status(500).json({ ok: false, msg: 'La tabla adq_estudio_mercado no existe. Ejecuta alter_adq_estudio_mercado.sql.', detail: e === null || e === void 0 ? void 0 : e.message });
        }
        if (msg.includes("unknown column") || msg.includes("doesn't have a default")) {
            return res.status(500).json({ ok: false, msg: 'Faltan columnas en adq_estudio_mercado. Ejecuta alter_adq_estudio_mercado.sql.', detail: e === null || e === void 0 ? void 0 : e.message });
        }
        return res.status(500).json({ ok: false, msg: 'Error al guardar estudio de mercado.', detail: e === null || e === void 0 ? void 0 : e.message });
    }
    return res.status(200).json({ ok: true, msg: 'Estudio de mercado guardado correctamente' });
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
        const [sol, proc] = yield Promise.all([
            AdqSolicitudes_1.default.findByPk(id),
            AdqProcedimientoAdquisitivo_1.default.findOne({ where: { id_solicitud: id } }),
        ]);
        // Lookups de catálogos en paralelo para mostrar nombres en la vista
        const item = sol ? sol.toJSON() : null;
        if (item) {
            const [dep, cc, opd, cap, sub, pg, pe] = yield Promise.all([
                item.id_dependencia ? AdqDependencias_1.default.findByPk(item.id_dependencia) : Promise.resolve(null),
                item.id_centro_costo ? AdqCentrosCosto_1.default.findByPk(item.id_centro_costo) : Promise.resolve(null),
                item.id_opd ? AdqOrganismosOPDS_1.default.findByPk(item.id_opd) : Promise.resolve(null),
                item.id_capitulo ? AdqCatCapitulos_1.default.findByPk(item.id_capitulo) : Promise.resolve(null),
                item.id_subcapitulo ? AdqCatSubcapitulos_1.default.findByPk(item.id_subcapitulo) : Promise.resolve(null),
                item.id_partida_generica ? AdqCatPartidasGenericas_1.default.findByPk(item.id_partida_generica) : Promise.resolve(null),
                item.id_partida_especifica ? AdqCatPartidasEspecificas_1.default.findByPk(item.id_partida_especifica) : Promise.resolve(null),
            ]);
            const n = (m, f = 'nombre') => { var _a; return (_a = m === null || m === void 0 ? void 0 : m.getDataValue(f)) !== null && _a !== void 0 ? _a : null; };
            const cn = (m) => m ? `${n(m, 'codigo')} — ${n(m, 'nombre')}` : null;
            item.dependencia_nombre = n(dep);
            item.centro_costo_nombre = cn(cc);
            item.opd_nombre = cn(opd);
            item.capitulo_nombre = cn(cap);
            item.subcapitulo_nombre = cn(sub);
            item.partida_generica_nombre = cn(pg);
            item.partida_especifica_nombre = cn(pe);
            item.origen_recurso_nombre = getOrigenRecursoNombre(item.id_origen_recurso);
        }
        // Mapeo inverso: columnas BD → nombres del form
        const procedimiento = proc ? Object.assign(Object.assign({}, proc.toJSON()), { fecha_sesion_comite: proc.fecha_sesion_comite_analisis, hora_sesion_comite: proc.hora_sesion_comite_analisis, fecha_contra_oferta: proc.fecha_contraoferta, hora_contra_oferta: proc.hora_contraoferta, fecha_dictaminacion: proc.fecha_dictaminacion_comite, hora_dictaminacion: proc.hora_dictaminacion_comite, dictamen_procedencia: proc.dictamen_procedencia === true ? 'SI' : (proc.dictamen_procedencia === false ? 'NO' : null) }) : null;
        return res.json({ ok: true, data: { solicitud: item, procedimiento } });
    }
    catch (error) {
        console.error('ERROR getProcedimientoById =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener procedimiento' });
    }
});
exports.getProcedimientoById = getProcedimientoById;
const saveProcedimientoAdquisitivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    try {
        const { id } = req.params;
        const _w = req.body, { user_id } = _w, c = __rest(_w, ["user_id"]);
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
        return res.status(500).json({
            ok: false,
            msg: 'Error al guardar procedimiento adquisitivo',
            detail: (_v = error === null || error === void 0 ? void 0 : error.message) !== null && _v !== void 0 ? _v : String(error),
        });
    }
});
exports.saveProcedimientoAdquisitivo = saveProcedimientoAdquisitivo;
const getAdjudicacionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [solicitud, proc] = yield Promise.all([
            AdqSolicitudes_1.default.findByPk(id),
            AdqProcedimientoAdquisitivo_1.default.findOne({ where: { id_solicitud: id } }),
        ]);
        return res.json({ ok: true, data: { solicitud, procedimiento: proc !== null && proc !== void 0 ? proc : null } });
    }
    catch (error) {
        console.error('ERROR getAdjudicacionById =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener adjudicación' });
    }
});
exports.getAdjudicacionById = getAdjudicacionById;
const saveAdjudicacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    try {
        const { id } = req.params;
        const _u = req.body, { user_id } = _u, c = __rest(_u, ["user_id"]);
        const idSolicitud = Number(id);
        const campos = {
            no_procedimiento: (_a = c.no_procedimiento) !== null && _a !== void 0 ? _a : null,
            proveedor_razon_social: (_b = c.proveedor_razon_social) !== null && _b !== void 0 ? _b : null,
            proveedor_rfc: (_c = c.proveedor_rfc) !== null && _c !== void 0 ? _c : null,
            monto_total_adjudicado_iva: c.monto_total_adjudicado_iva ? Number(c.monto_total_adjudicado_iva) : null,
            no_contrato: (_d = c.no_contrato) !== null && _d !== void 0 ? _d : null,
            vigencia_inicio: (_e = c.vigencia_inicio) !== null && _e !== void 0 ? _e : null,
            vigencia_termino: (_f = c.vigencia_termino) !== null && _f !== void 0 ? _f : null,
            url_testimonio_testigo_social: (_g = c.url_testimonio_testigo_social) !== null && _g !== void 0 ? _g : null,
            remanente_suficiencia_presupuestal: c.remanente_suficiencia_presupuestal ? Number(c.remanente_suficiencia_presupuestal) : null,
            responsable: (_h = c.responsable) !== null && _h !== void 0 ? _h : null,
            estatus_adjudicacion: (_j = c.estatus_adjudicacion) !== null && _j !== void 0 ? _j : null,
            estatus_estudio_mercado_adj: (_k = c.estatus_estudio_mercado_adj) !== null && _k !== void 0 ? _k : null,
            comentarios_adjudicacion: (_l = c.comentarios_adjudicacion) !== null && _l !== void 0 ? _l : null,
            existe_reprogramacion: c.existe_reprogramacion === 'SI' ? true : (c.existe_reprogramacion === 'NO' ? false : null),
            fecha_junta_aclaracion: c.existe_reprogramacion === 'SI' ? ((_m = c.fecha_junta_aclaracion) !== null && _m !== void 0 ? _m : null) : null,
            hora_junta_aclaracion: c.existe_reprogramacion === 'SI' ? ((_o = c.hora_junta_aclaracion) !== null && _o !== void 0 ? _o : null) : null,
            fecha_presentacion_apertura: c.existe_reprogramacion === 'SI' ? ((_p = c.fecha_presentacion_apertura) !== null && _p !== void 0 ? _p : null) : null,
            hora_presentacion_apertura: c.existe_reprogramacion === 'SI' ? ((_q = c.hora_presentacion_apertura) !== null && _q !== void 0 ? _q : null) : null,
            fecha_fallo: c.existe_reprogramacion === 'SI' ? ((_r = c.fecha_fallo) !== null && _r !== void 0 ? _r : null) : null,
            hora_fallo: c.existe_reprogramacion === 'SI' ? ((_s = c.hora_fallo) !== null && _s !== void 0 ? _s : null) : null,
        };
        const existe = yield AdqProcedimientoAdquisitivo_1.default.findOne({ where: { id_solicitud: idSolicitud } });
        if (existe) {
            yield existe.update(Object.assign(Object.assign({}, campos), { updated_by: user_id !== null && user_id !== void 0 ? user_id : null }));
        }
        else {
            yield AdqProcedimientoAdquisitivo_1.default.create(Object.assign(Object.assign({ id_solicitud: idSolicitud }, campos), { created_by: user_id !== null && user_id !== void 0 ? user_id : '00000000-0000-0000-0000-000000000000' }));
        }
        // Avanzar a estatus 5 (Adjudicación)
        yield AdqSolicitudes_1.default.update({ estatus_id: 5 }, { where: { id_solicitud: idSolicitud } });
        return res.json({ ok: true, msg: 'Adjudicación guardada correctamente' });
    }
    catch (error) {
        console.error('ERROR saveAdjudicacion =>', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al guardar adjudicación',
            detail: (_t = error === null || error === void 0 ? void 0 : error.message) !== null && _t !== void 0 ? _t : String(error),
        });
    }
});
exports.saveAdjudicacion = saveAdjudicacion;
const getKpis = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // ── Conteo por etapa (estatus_id) ─────────────────────────────────────
        const estatusFilas = yield AdqSolicitudes_1.default.findAll({
            attributes: ['estatus_id', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id_solicitud')), 'total']],
            group: ['estatus_id'],
            raw: true,
        });
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        estatusFilas.forEach((f) => { counts[Number(f.estatus_id)] = Number(f.total); });
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        // ── Conteo por origen de recurso ──────────────────────────────────────
        const origenFilas = yield AdqSolicitudes_1.default.findAll({
            attributes: ['id_origen_recurso', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id_solicitud')), 'total']],
            group: ['id_origen_recurso'],
            raw: true,
        });
        const origenes = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        origenFilas.forEach((f) => { origenes[Number(f.id_origen_recurso)] = Number(f.total); });
        // ── Contratos, monto y dependencias participantes ─────────────────────
        const seq2 = AdqSolicitudes_1.default.sequelize;
        const totalContratos = yield AdqProcedimientoAdquisitivo_1.default.count({
            where: { no_contrato: { [sequelize_1.Op.not]: null } },
        });
        const [montoRow] = yield AdqProcedimientoAdquisitivo_1.default.findAll({
            attributes: [[(0, sequelize_1.fn)('COALESCE', (0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('monto_total_adjudicado_iva')), 0), 'monto']],
            raw: true,
        });
        const montoTotal = Number((_a = montoRow === null || montoRow === void 0 ? void 0 : montoRow.monto) !== null && _a !== void 0 ? _a : 0);
        const [depRow] = yield seq2.query(`
      SELECT COUNT(DISTINCT COALESCE(id_dependencia, id_opd)) AS total
      FROM adq_solicitudes
      WHERE id_dependencia IS NOT NULL OR id_opd IS NOT NULL
    `);
        const depParticipantes = Number((_c = (_b = depRow[0]) === null || _b === void 0 ? void 0 : _b.total) !== null && _c !== void 0 ? _c : 0);
        return res.json({
            ok: true,
            data: {
                // por etapa
                total,
                registradas: counts[1],
                estudio: counts[2],
                afectacion: counts[3],
                contratacion: counts[4],
                adjudicacion: counts[5],
                // por origen
                estatal: origenes[1],
                federal: origenes[2],
                fideicomiso: origenes[3],
                concurrente: origenes[4],
                propio: origenes[5],
                // financiero
                total_contratos: totalContratos,
                monto_total: montoTotal,
                dependencias_participantes: depParticipantes,
            },
        });
    }
    catch (error) {
        console.error('ERROR getKpis =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener KPIs' });
    }
});
exports.getKpis = getKpis;
const getTopDependencias = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seq = AdqSolicitudes_1.default.sequelize;
        // Top 5 dependencias por número de solicitudes
        const [solRows] = yield seq.query(`
      SELECT d.nombre, COUNT(s.id_solicitud) AS total
      FROM adq_solicitudes s
      JOIN adq_dependencias d ON d.id_dependencia = s.id_dependencia
      WHERE s.id_dependencia IS NOT NULL
      GROUP BY d.id_dependencia, d.nombre
      ORDER BY total DESC
      LIMIT 5
    `);
        // Top 5 dependencias por monto adjudicado
        const [montoRows] = yield seq.query(`
      SELECT d.nombre,
             COALESCE(SUM(pa.monto_total_adjudicado_iva), 0) AS monto,
             COUNT(pa.id_proc)                                AS contratos
      FROM adq_solicitudes s
      JOIN adq_dependencias d               ON d.id_dependencia = s.id_dependencia
      JOIN adq_procedimiento_adquisitivo pa ON pa.id_solicitud  = s.id_solicitud
      WHERE s.id_dependencia IS NOT NULL
        AND pa.monto_total_adjudicado_iva IS NOT NULL
      GROUP BY d.id_dependencia, d.nombre
      ORDER BY monto DESC
      LIMIT 5
    `);
        return res.json({
            ok: true,
            data: {
                porSolicitudes: solRows.map((r) => ({
                    nombre: r.nombre,
                    total: Number(r.total),
                })),
                porMonto: montoRows.map((r) => ({
                    nombre: r.nombre,
                    monto: Number(r.monto),
                    contratos: Number(r.contratos),
                })),
            },
        });
    }
    catch (error) {
        console.error('ERROR getTopDependencias =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener top dependencias' });
    }
});
exports.getTopDependencias = getTopDependencias;
const getEvolucionMensual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const anio = Number(req.query.anio) || new Date().getFullYear();
        const seq = AdqSolicitudes_1.default.sequelize;
        const [solRows] = yield seq.query(`
      SELECT MONTH(fecha_ingreso) AS mes, COUNT(*) AS total
      FROM adq_solicitudes
      WHERE YEAR(fecha_ingreso) = :anio
      GROUP BY MONTH(fecha_ingreso)
      ORDER BY mes
    `, { replacements: { anio } });
        const [adjRows] = yield seq.query(`
      SELECT MONTH(s.fecha_ingreso) AS mes,
             COUNT(pa.id_proc)                              AS contratos,
             COALESCE(SUM(pa.monto_total_adjudicado_iva),0) AS monto
      FROM adq_solicitudes s
      JOIN adq_procedimiento_adquisitivo pa ON pa.id_solicitud = s.id_solicitud
      WHERE YEAR(s.fecha_ingreso) = :anio
        AND pa.monto_total_adjudicado_iva IS NOT NULL
      GROUP BY MONTH(s.fecha_ingreso)
      ORDER BY mes
    `, { replacements: { anio } });
        const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        // Construir arrays de 12 posiciones (índice 0 = enero)
        const solicitudesPorMes = Array(12).fill(0);
        const contratosPorMes = Array(12).fill(0);
        const montoPorMes = Array(12).fill(0);
        solRows.forEach((r) => { solicitudesPorMes[Number(r.mes) - 1] = Number(r.total); });
        adjRows.forEach((r) => {
            contratosPorMes[Number(r.mes) - 1] = Number(r.contratos);
            montoPorMes[Number(r.mes) - 1] = Number(r.monto);
        });
        return res.json({
            ok: true,
            data: {
                anio,
                categorias: MESES,
                solicitudes: solicitudesPorMes,
                contratos: contratosPorMes,
                montos: montoPorMes,
            },
        });
    }
    catch (error) {
        console.error('ERROR getEvolucionMensual =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener evolución mensual' });
    }
});
exports.getEvolucionMensual = getEvolucionMensual;
// ─── Helpers para exportación Excel ─────────────────────────────────────────
function getEstatusLabelExcel(estatus) {
    switch (Number(estatus)) {
        case 1: return 'Registrada';
        case 2: return 'Estudio de Mercado';
        case 3: return 'Afectación Presupuestal';
        case 4: return 'Adquisición';
        case 5: return 'Adjudicación';
        default: return 'Desconocido';
    }
}
function calcularDiasExcel(fechaIngreso) {
    if (!fechaIngreso)
        return null;
    const ingreso = new Date(fechaIngreso + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return Math.floor((hoy.getTime() - ingreso.getTime()) / 86400000);
}
function calcularSemaforoExcel(solicitud) {
    const dias = calcularDiasExcel(solicitud === null || solicitud === void 0 ? void 0 : solicitud.fecha_ingreso);
    if (!solicitud)
        return { label: 'En tiempo', estado: 'en-tiempo', dias: null };
    if (solicitud.estado_estudio_mercado === 'RECHAZADO')
        return { label: 'Rechazado', estado: 'rechazado', dias };
    if (Number(solicitud.estatus_id) === 5)
        return { label: 'Concluido', estado: 'concluido', dias };
    if (dias !== null && dias > 15)
        return { label: 'Atrasado', estado: 'atrasado', dias };
    return { label: 'En tiempo', estado: 'en-tiempo', dias };
}
function formatFechaExcel(fecha) {
    if (!fecha)
        return '—';
    const d = new Date(fecha);
    if (isNaN(d.getTime()))
        return String(fecha);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function applyBorder(cell, color = 'CCCCCC') {
    const thin = { style: 'thin', color: { argb: color } };
    cell.border = { top: thin, bottom: thin, left: thin, right: thin };
}
// ─── Exportar Excel completo (todas las etapas, 65 columnas) ─────────────────
const exportarExcelGestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { busqueda, estatus } = req.query;
        // ── 1. Obtener todos los datos en paralelo ─────────────────────────────
        const [listSolicitudes, listEstudios, listAfectaciones, listBienes, listProcs, listDependencias, listCentrosCosto, listOPDs, listCapitulos, listSubcapitulos, listPartidasEspecificas, listFuentes,] = yield Promise.all([
            AdqSolicitudes_1.default.findAll({ order: [['id_solicitud', 'ASC']] }),
            AdqEstudioMercado_1.default.findAll({ raw: true }),
            AdqAfectacionPresupuestal_1.default.findAll({ raw: true }),
            AdqBienesServicios_1.default.findAll({ raw: true }),
            AdqProcedimientoAdquisitivo_1.default.findAll({ raw: true }),
            AdqDependencias_1.default.findAll({ raw: true }),
            AdqCentrosCosto_1.default.findAll({ raw: true }),
            AdqOrganismosOPDS_1.default.findAll({ raw: true }),
            AdqCatCapitulos_1.default.findAll({ raw: true }),
            AdqCatSubcapitulos_1.default.findAll({ raw: true }),
            AdqCatPartidasEspecificas_1.default.findAll({ raw: true }),
            adq_cat_fuentes_financiamiento_1.default.findAll({ raw: true }),
        ]);
        // ── 2. Construir mapas de búsqueda ─────────────────────────────────────
        const mkMap = (list, key) => new Map(list.map(r => [Number(r[key]), r]));
        const mapEstudios = mkMap(listEstudios, 'id_solicitud');
        const mapAfectacion = mkMap(listAfectaciones, 'id_solicitud');
        const mapBienes = mkMap(listBienes, 'id_solicitud');
        const mapProcs = mkMap(listProcs, 'id_solicitud');
        const mapDeps = mkMap(listDependencias, 'id_dependencia');
        const mapCCs = mkMap(listCentrosCosto, 'id_centro_costo');
        const mapOPDs = mkMap(listOPDs, 'id_organismo_opds');
        const mapCaps = mkMap(listCapitulos, 'id_capitulo');
        const mapSubs = mkMap(listSubcapitulos, 'id_subcapitulo');
        const mapPEs = mkMap(listPartidasEspecificas, 'id_partida_especifica');
        const mapFuentes = mkMap(listFuentes, 'id_fuente_financiamiento');
        // ── 3. Enriquecer y filtrar ────────────────────────────────────────────
        let data = listSolicitudes.map(s => {
            var _a, _b, _c, _d;
            const item = s.toJSON ? s.toJSON() : s;
            const id = Number(item.id_solicitud);
            return {
                item,
                est: (_a = mapEstudios.get(id)) !== null && _a !== void 0 ? _a : {},
                afe: (_b = mapAfectacion.get(id)) !== null && _b !== void 0 ? _b : {},
                bs: (_c = mapBienes.get(id)) !== null && _c !== void 0 ? _c : {},
                proc: (_d = mapProcs.get(id)) !== null && _d !== void 0 ? _d : {},
                dep: item.id_dependencia ? mapDeps.get(Number(item.id_dependencia)) : null,
                cc: item.id_centro_costo ? mapCCs.get(Number(item.id_centro_costo)) : null,
                opd: item.id_opd ? mapOPDs.get(Number(item.id_opd)) : null,
                cap: item.id_capitulo ? mapCaps.get(Number(item.id_capitulo)) : null,
                sub: item.id_subcapitulo ? mapSubs.get(Number(item.id_subcapitulo)) : null,
                pe: item.id_partida_especifica ? mapPEs.get(Number(item.id_partida_especifica)) : null,
            };
        }).map(row => (Object.assign(Object.assign({}, row), { fue: row.afe.id_fuente_financiamiento
                ? mapFuentes.get(Number(row.afe.id_fuente_financiamiento))
                : null })));
        if (busqueda || estatus) {
            data = data.filter(({ item }) => {
                if (estatus && Number(item.estatus_id) !== Number(estatus))
                    return false;
                if (busqueda) {
                    const txt = busqueda.toLowerCase();
                    return Object.values(item).some(v => v && String(v).toLowerCase().includes(txt));
                }
                return true;
            });
        }
        // ── 4. Construir workbook ──────────────────────────────────────────────
        const workbook = new exceljs_1.default.Workbook();
        workbook.creator = 'SIAdquisiciones';
        workbook.created = new Date();
        const ws = workbook.addWorksheet('Solicitudes', {
            pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
        });
        // Paleta
        const GUINDA = '6B0F2A';
        const GUINDA_L = 'F7E6EA';
        const WHITE = 'FFFFFF';
        const GRAY = 'F4F4F4';
        const TEXT = '2C2C2C';
        // Colores por sección (row 6)
        const C_SOL = '6B0F2A'; // guinda
        const C_EST = '0D3B6E'; // azul marino
        const C_AFE = '7B3800'; // naranja oscuro
        const C_BS = '1A5F2A'; // verde oscuro
        const C_ADQ = '3B0D69'; // púrpura
        const C_ADJ = '0A5F5F'; // teal
        const C_CIE = '2D3748'; // gris
        // 65 columnas: anchos
        //  Solicitud (1-9): A-I
        //  Estudio de mercado (10-21): J-U
        //  Afectación (22-28): V-AB
        //  Bienes/servicios (29-33): AC-AG
        //  Adquisición (34-51): AH-AY
        //  Adjudicación (52-64): AZ-BL
        //  Cierre (65): BM
        const COL_WIDTHS = [
            8, 14, 12, 16, 30, 22, 20, 24, 24, // Solicitud 1-9
            14, 16, 16, 20, 16, 14, 32, 14, 12, 12, 12, 12, // Estudio 10-21
            18, 14, 22, 14, 26, 16, 18, // Afectación 22-28
            18, 30, 14, 10, 10, // Bienes 29-33
            20, 12, 22, 20, 28, 20, // Adquisición 34-39
            14, 10, 14, 10, 14, 10, 14, 10, 14, 10, 14, 10, // Fechas/horas 40-51
            28, 18, 16, 18, 16, 18, 14, 14, 22, 14, 22, 24, 16, // Adjudicación 52-64
            12, // Cierre 65
        ];
        COL_WIDTHS.forEach((w, i) => { ws.getColumn(i + 1).width = w; });
        // ── Filas 1-4: Encabezado institucional ───────────────────────────────
        ws.getRow(1).height = 40;
        ws.mergeCells(1, 1, 4, 1); // A1:A4
        ws.mergeCells(1, 2, 1, 65); // B1:BM1
        const logoPath = path_1.default.join(__dirname, '../../src/assets/acusederegistro.png');
        if (fs_1.default.existsSync(logoPath)) {
            const imageId = workbook.addImage({ filename: logoPath, extension: 'png' });
            ws.addImage(imageId, { tl: { col: 0, row: 0 }, ext: { width: 80, height: 80 } });
        }
        const stHeader = (cell, val, size, bold, fgColor, fontColor, italic = false) => {
            cell.value = val;
            cell.font = { name: 'Calibri', size, bold, italic, color: { argb: fontColor } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColor } };
        };
        stHeader(ws.getCell('B1'), 'SISTEMA DE INFORMACIÓN DE ADQUISICIONES', 13, true, WHITE, GUINDA);
        ws.getRow(2).height = 30;
        ws.mergeCells(2, 2, 2, 65);
        stHeader(ws.getCell('B2'), 'Reporte General de Solicitudes', 16, true, GUINDA, WHITE);
        ws.getRow(3).height = 20;
        ws.mergeCells(3, 2, 3, 65);
        stHeader(ws.getCell('B3'), 'Vista completa del proceso adquisitivo — todas las etapas', 11, false, GUINDA_L, GUINDA, true);
        ws.getRow(4).height = 18;
        ws.mergeCells(4, 2, 4, 65);
        const now = new Date();
        const fechaStr = now.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
        const horaStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        let filtrosInfo = '';
        if (busqueda)
            filtrosInfo += `  |  Búsqueda: "${busqueda}"`;
        if (estatus)
            filtrosInfo += `  |  Estatus: ${getEstatusLabelExcel(Number(estatus))}`;
        const b4 = ws.getCell('B4');
        b4.value = `Generado: ${fechaStr} a las ${horaStr}${filtrosInfo}`;
        b4.font = { name: 'Calibri', size: 9, color: { argb: '666666' } };
        b4.alignment = { vertical: 'middle', horizontal: 'right' };
        b4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRAY } };
        ws.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: WHITE } };
        // ── Fila 5: Espaciador ─────────────────────────────────────────────────
        ws.getRow(5).height = 5;
        ws.mergeCells(5, 1, 5, 65);
        // ── Fila 6: Etiquetas de sección ───────────────────────────────────────
        ws.getRow(6).height = 16;
        const sections = [
            { label: 'SOLICITUD INICIAL', s: 1, e: 9, c: C_SOL },
            { label: 'ESTUDIO DE MERCADO', s: 10, e: 21, c: C_EST },
            { label: 'AFECTACIÓN PRESUPUESTAL', s: 22, e: 28, c: C_AFE },
            { label: 'BIENES / SERVICIOS', s: 29, e: 33, c: C_BS },
            { label: 'ADQUISICIÓN', s: 34, e: 51, c: C_ADQ },
            { label: 'ADJUDICACIÓN', s: 52, e: 64, c: C_ADJ },
            { label: 'CIERRE', s: 65, e: 65, c: C_CIE },
        ];
        sections.forEach(({ label, s, e, c }) => {
            if (s !== e)
                ws.mergeCells(6, s, 6, e);
            const cell = ws.getCell(6, s);
            cell.value = label;
            cell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: WHITE } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: c } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        // ── Fila 7: Encabezados de columna ─────────────────────────────────────
        ws.getRow(7).height = 38;
        const COL_HEADERS = [
            // Solicitud (1-9)
            'Folio Interno', 'Fecha Ingreso', 'Semáforo', 'Origen del Recurso',
            'Dependencia / OPD', 'Centro de Costo', 'Capítulo',
            'Concepto del Gasto', 'Giro / Partida Específica',
            // Estudio de Mercado (10-21)
            'Tipo Contratación', 'Valor Estudio de Mercado', 'Estatus del Estudio',
            'Estado General', 'Tipo de Solicitud', 'Monto SABYS',
            'Descripción del Bien o Servicio', 'Contratación Plurianual',
            'Monto 2026', 'Monto 2027', 'Monto 2028', 'Monto 2029',
            // Afectación Presupuestal (22-28)
            'Folio Adquisición', 'Fecha Liberación Estudio',
            'Testigo Social', 'Tipo de Gasto', 'Fuente de Financiamiento',
            'Importe Suficiencia Presupuestal', 'Oficio Suficiencia',
            // Bienes / Servicios (29-33)
            'Clave de Verificación', 'Descripción Clave Verificación',
            'Unidad de Medida', '¿Contrato Abierto?', '¿Consolidado?',
            // Adquisición (34-51)
            'Modalidad', 'Dictamen de Procedencia', 'Responsable',
            'No. de Procedimiento', 'Convocatoria / Invitación (URL)', 'Medio de Publicación',
            'F. Junta de Aclaración', 'H. Junta de Aclaración',
            'F. Presentación y Apertura', 'H. Presentación y Apertura',
            'F. Sesión Comité Análisis', 'H. Sesión Comité Análisis',
            'F. Contra Oferta', 'H. Contra Oferta',
            'F. Dictaminación', 'H. Dictaminación',
            'F. Fallo', 'H. Fallo',
            // Adjudicación (52-64)
            'Razón Social / Proveedor', 'RFC', 'Representación Legal',
            'Documento (URL)', 'Monto Total Adjudicado c/IVA',
            'No. de Contrato', 'Inicio de Vigencia', 'Término de Vigencia',
            'Testimonio Testigo Social (URL)', 'Remanente Suficiencia',
            'Nombre Responsable Procedimiento', 'Comentarios', 'Estatus Adjudicación',
            // Cierre (65)
            'Días Transcurridos',
        ];
        // Mapa sección-color para encabezados
        const secColorMap = new Map();
        sections.forEach(({ s, e, c }) => {
            for (let i = s; i <= e; i++)
                secColorMap.set(i, c);
        });
        COL_HEADERS.forEach((h, i) => {
            var _a;
            const colNum = i + 1;
            const c = ws.getCell(7, colNum);
            c.value = h;
            c.font = { name: 'Calibri', size: 9, bold: true, color: { argb: WHITE } };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: (_a = secColorMap.get(colNum)) !== null && _a !== void 0 ? _a : GUINDA } };
            c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            applyBorder(c, '8B8B8B');
        });
        // ── Filas de datos ─────────────────────────────────────────────────────
        const SEM_COLORS = {
            'en-tiempo': '1B5E20', 'atrasado': 'B71C1C',
            'rechazado': '424242', 'concluido': '0D47A1',
        };
        // Columnas con formato moneda (1-indexed)
        const CURRENCY_COLS = new Set([11, 15, 18, 19, 20, 21, 27, 55, 60]);
        const n = (v) => v !== null && v !== void 0 ? v : '—';
        const fb = (v) => (v === true || v === 1) ? 'Sí' : ((v === false || v === 0) ? 'No' : '—');
        data.forEach(({ item, est, afe, bs, proc, dep, cc, opd, cap, sub, pe, fue }, idx) => {
            var _a;
            const rowNum = idx + 8;
            const rowBg = idx % 2 === 1 ? GUINDA_L : WHITE;
            ws.getRow(rowNum).height = 18;
            const sem = calcularSemaforoExcel(item);
            const rowValues = [
                // Solicitud (1-9)
                n(item.folio),
                formatFechaExcel(item.fecha_ingreso),
                sem.label,
                getOrigenRecursoNombre(item.id_origen_recurso) || '—',
                (dep === null || dep === void 0 ? void 0 : dep.nombre) || (opd ? `${opd.codigo} - ${opd.nombre}` : '—'),
                cc ? `${cc.codigo} - ${cc.nombre}` : '—',
                cap ? `${cap.codigo} - ${cap.nombre}` : '—',
                sub ? `${sub.codigo} - ${sub.nombre}` : '—',
                pe ? `${pe.codigo} - ${pe.nombre}` : '—',
                // Estudio de Mercado (10-21)
                n(est.tipo_contratacion),
                est.valor_estudio_mercado != null ? Number(est.valor_estudio_mercado) : '—',
                n(est.estatus_estudio),
                getEstatusLabelExcel(Number(item.estatus_id)),
                n(item.tipo_solicitud),
                est.monto_sabys != null ? Number(est.monto_sabys) : '—',
                n(est.descripcion_bien_servicio),
                n(est.contratacion_plurianual),
                est.monto_2026 != null ? Number(est.monto_2026) : '—',
                est.monto_2027 != null ? Number(est.monto_2027) : '—',
                est.monto_2028 != null ? Number(est.monto_2028) : '—',
                est.monto_2029 != null ? Number(est.monto_2029) : '—',
                // Afectación Presupuestal (22-28)
                n(item.folio),
                formatFechaExcel(proc.fecha_liberacion_mercado),
                n(afe.nombre_testigo_social),
                n(afe.tipo_gasto),
                fue ? `${fue.codigo} - ${fue.nombre}` : '—',
                afe.importe_suficiencia != null ? Number(afe.importe_suficiencia) : '—',
                n(afe.oficio_suficiencia_path),
                // Bienes / Servicios (29-33)
                n(bs.clave_verificacion),
                n(bs.descripcion_clave_verificacion),
                n(bs.unidad_medida),
                fb(bs.contrato_abierto),
                fb(bs.consolidado),
                // Adquisición (34-51)
                n(proc.modalidad),
                fb(proc.dictamen_procedencia),
                n(proc.responsable),
                n(proc.no_procedimiento),
                n(proc.convocatoria_url),
                n(proc.medio_publicacion),
                formatFechaExcel(proc.fecha_junta_aclaracion),
                n(proc.hora_junta_aclaracion),
                formatFechaExcel(proc.fecha_presentacion_apertura),
                n(proc.hora_presentacion_apertura),
                formatFechaExcel(proc.fecha_sesion_comite_analisis),
                n(proc.hora_sesion_comite_analisis),
                formatFechaExcel(proc.fecha_contraoferta),
                n(proc.hora_contraoferta),
                formatFechaExcel(proc.fecha_dictaminacion_comite),
                n(proc.hora_dictaminacion_comite),
                formatFechaExcel(proc.fecha_fallo),
                n(proc.hora_fallo),
                // Adjudicación (52-64)
                n(proc.proveedor_razon_social),
                n(proc.proveedor_rfc),
                '—',
                n(proc.dictamen_procedencia_path),
                proc.monto_total_adjudicado_iva != null ? Number(proc.monto_total_adjudicado_iva) : '—',
                n(proc.no_contrato),
                formatFechaExcel(proc.vigencia_inicio),
                formatFechaExcel(proc.vigencia_termino),
                n(proc.url_testimonio_testigo_social),
                proc.remanente_suficiencia_presupuestal != null ? Number(proc.remanente_suficiencia_presupuestal) : '—',
                n(proc.responsable),
                n(proc.comentarios_adjudicacion),
                n(proc.estatus_adjudicacion),
                // Cierre (65)
                sem.dias !== null ? sem.dias : '—',
            ];
            rowValues.forEach((val, colIdx) => {
                const colNum = colIdx + 1;
                const c = ws.getCell(rowNum, colNum);
                c.value = val;
                c.font = { name: 'Calibri', size: 9, color: { argb: TEXT } };
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
                c.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false };
                applyBorder(c);
                if (CURRENCY_COLS.has(colNum) && typeof val === 'number') {
                    c.numFmt = '$#,##0.00';
                    c.alignment = { vertical: 'middle', horizontal: 'right' };
                }
                if (colNum === 65) {
                    c.alignment = { vertical: 'middle', horizontal: 'center' };
                }
            });
            // Color del semáforo (col 3)
            ws.getCell(rowNum, 3).font = {
                name: 'Calibri', size: 9, bold: true,
                color: { argb: (_a = SEM_COLORS[sem.estado]) !== null && _a !== void 0 ? _a : TEXT },
            };
        });
        // ── Pie de reporte ─────────────────────────────────────────────────────
        const footerRow = data.length + 8;
        ws.getRow(footerRow).height = 14;
        ws.mergeCells(footerRow, 1, footerRow, 65);
        const fc = ws.getCell(footerRow, 1);
        fc.value = `Total de registros: ${data.length}`;
        fc.font = { name: 'Calibri', size: 9, bold: true, color: { argb: GUINDA } };
        fc.alignment = { horizontal: 'right', vertical: 'middle' };
        fc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GUINDA_L } };
        // ── Respuesta ──────────────────────────────────────────────────────────
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="solicitudes_SIAdquisiciones.xlsx"');
        yield workbook.xlsx.write(res);
        return res.end();
    }
    catch (error) {
        console.error('Error al exportar Excel:', error);
        return res.status(500).json({ msg: 'Error al generar el Excel', error: error.message });
    }
});
exports.exportarExcelGestion = exportarExcelGestion;
const getSemaforo = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    try {
        const seq = AdqSolicitudes_1.default.sequelize;
        const ahora = new Date();
        // Semáforo: solicitudes activas agrupadas por días desde ingreso
        const [semaforoRows] = yield seq.query(`
      SELECT
        SUM(CASE WHEN DATEDIFF(NOW(), fecha_ingreso) > 60 THEN 1 ELSE 0 END) AS urgente,
        SUM(CASE WHEN DATEDIFF(NOW(), fecha_ingreso) BETWEEN 30 AND 60 THEN 1 ELSE 0 END) AS atencion,
        SUM(CASE WHEN DATEDIFF(NOW(), fecha_ingreso) < 30 THEN 1 ELSE 0 END) AS normal,
        COUNT(*) AS total_activas
      FROM adq_solicitudes
      WHERE estatus_id < 5
    `);
        // Monto total comprometido (todas las adjudicaciones)
        const [montoRow] = yield seq.query(`
      SELECT COALESCE(SUM(monto_total_adjudicado_iva), 0) AS monto
      FROM adq_procedimiento_adquisitivo
    `);
        // Solicitudes nuevas este mes y el anterior
        const primerDiaMes = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-01`;
        const primerDiaMesAnt = ahora.getMonth() === 0
            ? `${ahora.getFullYear() - 1}-12-01`
            : `${ahora.getFullYear()}-${String(ahora.getMonth()).padStart(2, '0')}-01`;
        const ultimoDiaMesAnt = new Date(ahora.getFullYear(), ahora.getMonth(), 0)
            .toISOString().split('T')[0];
        const [esteMesRow] = yield seq.query(`
      SELECT COUNT(*) AS total FROM adq_solicitudes
      WHERE fecha_ingreso >= :inicio
    `, { replacements: { inicio: primerDiaMes } });
        const [mesAntRow] = yield seq.query(`
      SELECT COUNT(*) AS total FROM adq_solicitudes
      WHERE fecha_ingreso BETWEEN :inicio AND :fin
    `, { replacements: { inicio: primerDiaMesAnt, fin: ultimoDiaMesAnt } });
        const esteMes = Number((_b = (_a = esteMesRow[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0);
        const mesAnt = Number((_d = (_c = mesAntRow[0]) === null || _c === void 0 ? void 0 : _c.total) !== null && _d !== void 0 ? _d : 0);
        const pctCambio = mesAnt === 0 ? null : Math.round(((esteMes - mesAnt) / mesAnt) * 100);
        const s = (_e = semaforoRows[0]) !== null && _e !== void 0 ? _e : {};
        return res.json({
            ok: true,
            data: {
                total_activas: Number((_f = s.total_activas) !== null && _f !== void 0 ? _f : 0),
                monto: Number((_h = (_g = montoRow[0]) === null || _g === void 0 ? void 0 : _g.monto) !== null && _h !== void 0 ? _h : 0),
                semaforo: {
                    normal: Number((_j = s.normal) !== null && _j !== void 0 ? _j : 0),
                    atencion: Number((_k = s.atencion) !== null && _k !== void 0 ? _k : 0),
                    urgente: Number((_l = s.urgente) !== null && _l !== void 0 ? _l : 0),
                },
                comparativa: {
                    este_mes: esteMes,
                    mes_anterior: mesAnt,
                    pct_cambio: pctCambio,
                },
            },
        });
    }
    catch (error) {
        console.error('ERROR getSemaforo =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener semáforo ejecutivo' });
    }
});
exports.getSemaforo = getSemaforo;
const getDependenciasResumen = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seq = AdqSolicitudes_1.default.sequelize;
        const [rows] = yield seq.query(`
      SELECT
        COALESCE(d.nombre, oop.nombre, 'Sin asignar')            AS nombre,
        COUNT(DISTINCT s.id_solicitud)                            AS solicitudes,
        COUNT(DISTINCT CASE WHEN pa.no_contrato IS NOT NULL
                            THEN pa.id_proc END)                  AS contratos,
        COALESCE(SUM(CASE WHEN pa.no_contrato IS NOT NULL
                          THEN pa.monto_total_adjudicado_iva END), 0) AS monto,
        (SELECT s2.id_origen_recurso
         FROM   adq_solicitudes s2
         WHERE  (s2.id_dependencia = s.id_dependencia
                 OR (s.id_dependencia IS NULL AND s2.id_opd = s.id_opd))
         GROUP  BY s2.id_origen_recurso
         ORDER  BY COUNT(*) DESC
         LIMIT  1)                                                AS principal_origen
      FROM adq_solicitudes s
      LEFT JOIN adq_dependencias   d   ON d.id_dependencia    = s.id_dependencia
      LEFT JOIN adq_organismosOPDS oop ON oop.id_organismo_opds = s.id_opd
      LEFT JOIN adq_procedimiento_adquisitivo pa ON pa.id_solicitud = s.id_solicitud
      GROUP BY s.id_dependencia, s.id_opd, d.nombre, oop.nombre
      ORDER BY monto DESC, solicitudes DESC
      LIMIT 15
    `);
        const ORIG = {
            1: 'Estatal', 2: 'Federal', 3: 'Fideicomiso', 4: 'Concurrente', 5: 'Propio',
        };
        const data = rows.map((r) => {
            var _a;
            return ({
                nombre: r.nombre,
                solicitudes: Number(r.solicitudes),
                contratos: Number(r.contratos),
                monto: Number(r.monto),
                principal_origen: (_a = ORIG[Number(r.principal_origen)]) !== null && _a !== void 0 ? _a : '—',
            });
        });
        return res.json({ ok: true, data });
    }
    catch (error) {
        console.error('ERROR getDependenciasResumen =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener resumen de dependencias' });
    }
});
exports.getDependenciasResumen = getDependenciasResumen;
const getOrigenDetalle = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seq = AdqSolicitudes_1.default.sequelize;
        const [rows] = yield seq.query(`
      SELECT
        s.id_origen_recurso,
        COUNT(DISTINCT s.id_solicitud) AS solicitudes,
        COUNT(DISTINCT CASE WHEN pa.no_contrato IS NOT NULL THEN pa.id_proc END) AS contratos,
        COALESCE(SUM(CASE WHEN pa.no_contrato IS NOT NULL THEN pa.monto_total_adjudicado_iva END), 0) AS monto
      FROM adq_solicitudes s
      LEFT JOIN adq_procedimiento_adquisitivo pa ON pa.id_solicitud = s.id_solicitud
      GROUP BY s.id_origen_recurso
      ORDER BY s.id_origen_recurso
    `);
        const NOMBRES = {
            1: 'Estatal', 2: 'Federal', 3: 'Fideicomiso', 4: 'Concurrente', 5: 'Propio',
        };
        const data = rows.map((r) => {
            var _a;
            const sol = Number(r.solicitudes);
            const con = Number(r.contratos);
            return {
                id: Number(r.id_origen_recurso),
                nombre: (_a = NOMBRES[Number(r.id_origen_recurso)]) !== null && _a !== void 0 ? _a : `Origen ${r.id_origen_recurso}`,
                solicitudes: sol,
                contratos: con,
                monto: Number(r.monto),
                pct_formalizacion: sol > 0 ? Math.round((con / sol) * 1000) / 10 : 0,
            };
        });
        return res.json({ ok: true, data });
    }
    catch (error) {
        console.error('ERROR getOrigenDetalle =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener detalle por origen' });
    }
});
exports.getOrigenDetalle = getOrigenDetalle;
const getActividadCalendario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const anio = Number(req.query.anio) || new Date().getFullYear();
        const mes = Number(req.query.mes) || new Date().getMonth() + 1;
        const inicio = `${anio}-${String(mes).padStart(2, '0')}-01`;
        const fin = new Date(anio, mes, 0).toISOString().split('T')[0];
        const seq = AdqSolicitudes_1.default.sequelize;
        const [solRows] = yield seq.query(`
      SELECT DATE(fecha_ingreso) AS fecha, COUNT(*) AS total
      FROM adq_solicitudes
      WHERE DATE(fecha_ingreso) BETWEEN :inicio AND :fin
      GROUP BY DATE(fecha_ingreso)
    `, { replacements: { inicio, fin } });
        const [contratoRows] = yield seq.query(`
      SELECT DATE(pa.created_at) AS fecha, COUNT(*) AS total
      FROM adq_procedimiento_adquisitivo pa
      WHERE pa.no_contrato IS NOT NULL
        AND DATE(pa.created_at) BETWEEN :inicio AND :fin
      GROUP BY DATE(pa.created_at)
    `, { replacements: { inicio, fin } });
        const [adjRows] = yield seq.query(`
      SELECT DATE(s.fecha_ingreso) AS fecha, COUNT(*) AS total
      FROM adq_solicitudes s
      WHERE s.estatus_id = 5
        AND DATE(s.fecha_ingreso) BETWEEN :inicio AND :fin
      GROUP BY DATE(s.fecha_ingreso)
    `, { replacements: { inicio, fin } });
        return res.json({
            ok: true,
            data: {
                solicitudes: solRows.map((r) => ({ fecha: r.fecha, total: Number(r.total) })),
                contratos: contratoRows.map((r) => ({ fecha: r.fecha, total: Number(r.total) })),
                adjudicaciones: adjRows.map((r) => ({ fecha: r.fecha, total: Number(r.total) })),
            },
        });
    }
    catch (error) {
        console.error('ERROR getActividadCalendario =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener actividad del calendario' });
    }
});
exports.getActividadCalendario = getActividadCalendario;
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
const getInformeContratos = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seq = AdqSolicitudes_1.default.sequelize;
        const totalSolicitudes = yield AdqSolicitudes_1.default.count();
        const [contratos] = yield seq.query(`
      SELECT
        s.id_solicitud,
        s.folio                               AS no_solicitud,
        s.id_dependencia,
        s.id_opd,
        s.id_origen_recurso,
        COALESCE(d.nombre, o.nombre)          AS dependencia_nombre,
        pa.no_procedimiento,
        pa.no_contrato,
        pa.fecha_fallo                        AS fecha_adjudicacion,
        pa.proveedor_razon_social,
        CAST(pa.monto_total_adjudicado_iva AS DECIMAL(18,2)) AS monto,
        em.descripcion_bien_servicio          AS descripcion,
        CASE WHEN sub.codigo IS NOT NULL
          THEN CONCAT(sub.codigo, ' – ', sub.nombre) ELSE NULL END AS partida,
        CASE WHEN pg.codigo IS NOT NULL
          THEN CONCAT(pg.codigo, ' ', pg.nombre) ELSE NULL END     AS giro
      FROM adq_solicitudes s
      INNER JOIN adq_procedimiento_adquisitivo pa
        ON pa.id_solicitud = s.id_solicitud AND pa.no_contrato IS NOT NULL
      LEFT JOIN adq_dependencias d
        ON d.id_dependencia = s.id_dependencia
      LEFT JOIN adq_organismosOPDS o
        ON o.id_organismo_opds = s.id_opd
      LEFT JOIN adq_estudio_mercado em
        ON em.id_solicitud = s.id_solicitud
      LEFT JOIN adq_cat_subcapitulos sub
        ON sub.id_subcapitulo = s.id_subcapitulo
      LEFT JOIN adq_cat_partidas_genericas pg
        ON pg.id_partida_generica = s.id_partida_generica
      ORDER BY COALESCE(d.nombre, o.nombre), pa.fecha_fallo
    `);
        const [dependencias] = yield seq.query(`
      SELECT DISTINCT
        COALESCE(s.id_dependencia, 0)   AS id_dependencia,
        COALESCE(s.id_opd, 0)           AS id_opd,
        COALESCE(d.nombre, o.nombre)    AS nombre
      FROM adq_solicitudes s
      INNER JOIN adq_procedimiento_adquisitivo pa
        ON pa.id_solicitud = s.id_solicitud AND pa.no_contrato IS NOT NULL
      LEFT JOIN adq_dependencias d ON d.id_dependencia = s.id_dependencia
      LEFT JOIN adq_organismosOPDS o ON o.id_organismo_opds = s.id_opd
      HAVING nombre IS NOT NULL
      ORDER BY nombre
    `);
        const [solPorDep] = yield seq.query(`
      SELECT
        COALESCE(d.nombre, o.nombre) AS dep_nombre,
        COUNT(s.id_solicitud)        AS total
      FROM adq_solicitudes s
      LEFT JOIN adq_dependencias d ON d.id_dependencia = s.id_dependencia
      LEFT JOIN adq_organismosOPDS o ON o.id_organismo_opds = s.id_opd
      GROUP BY COALESCE(d.nombre, o.nombre)
      HAVING dep_nombre IS NOT NULL
    `);
        const solicitudesPorDep = {};
        solPorDep.forEach((r) => { solicitudesPorDep[r.dep_nombre] = Number(r.total); });
        const contratosFormateados = contratos.map((r) => {
            var _a;
            return (Object.assign(Object.assign({}, r), { monto: Number((_a = r.monto) !== null && _a !== void 0 ? _a : 0), origen_recurso: getOrigenRecursoNombre(Number(r.id_origen_recurso)) }));
        });
        return res.json({
            ok: true,
            data: {
                total_solicitudes: totalSolicitudes,
                contratos: contratosFormateados,
                dependencias,
                solicitudes_por_dep: solicitudesPorDep,
            },
        });
    }
    catch (error) {
        console.error('ERROR getInformeContratos =>', error);
        return res.status(500).json({ ok: false, msg: 'Error al obtener informe de contratos' });
    }
});
exports.getInformeContratos = getInformeContratos;
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
