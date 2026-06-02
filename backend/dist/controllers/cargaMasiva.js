"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importarExcel = exports.validarExcel = void 0;
const XLSX = __importStar(require("xlsx"));
const uuid_1 = require("uuid");
const connection_1 = __importDefault(require("../database/connection"));
const AdqSolicitudes_1 = __importDefault(require("../models/AdqSolicitudes"));
const AdqEstudioMercado_1 = __importDefault(require("../models/AdqEstudioMercado"));
const AdqBienesServicios_1 = __importDefault(require("../models/AdqBienesServicios"));
const AdqAfectacionPresupuestal_1 = __importDefault(require("../models/AdqAfectacionPresupuestal"));
const AdqProcedimientoAdquisitivo_1 = __importDefault(require("../models/AdqProcedimientoAdquisitivo"));
const AdqDependencias_1 = __importDefault(require("../models/AdqDependencias"));
const AdqCentrosCosto_1 = __importDefault(require("../models/AdqCentrosCosto"));
const AdqOrganismosOPDS_1 = __importDefault(require("../models/AdqOrganismosOPDS"));
const AdqOrganosDesconcentrados_1 = __importDefault(require("../models/AdqOrganosDesconcentrados"));
const AdqCatCapitulos_1 = __importDefault(require("../models/AdqCatCapitulos"));
const AdqCatSubcapitulos_1 = __importDefault(require("../models/AdqCatSubcapitulos"));
const AdqCatPartidasGenericas_1 = __importDefault(require("../models/AdqCatPartidasGenericas"));
const AdqCatPartidasEspecificas_1 = __importDefault(require("../models/AdqCatPartidasEspecificas"));
const adq_cat_fuentes_financiamiento_1 = __importDefault(require("../models/adq_cat_fuentes_financiamiento"));
const SYSTEM_USER = '00000000-0000-0000-0000-000000000000';
// ── Helpers de transformación (formato institucional) ─────────────────────────
/** Normaliza a null si el valor es vacío, undefined o "N/A" */
function ns(val) {
    if (val === null || val === undefined)
        return null;
    const s = String(val).trim();
    return (s === '' || s.toUpperCase() === 'N/A') ? null : s;
}
/**
 * Fecha: acepta Date ISO de xlsx ("2026-02-10T06:00:36.000Z") o string YYYY-MM-DD.
 * Rechaza fechas epoch de Excel (1899-12-30) que en realidad son horas.
 */
function pd(val) {
    if (!val)
        return null;
    if (val instanceof Date) {
        if (val.getUTCFullYear() === 1899)
            return null; // es un time-only
        return val.toISOString().split('T')[0];
    }
    if (typeof val === 'string') {
        const s = val.trim();
        if (s.toUpperCase() === 'N/A' || s === '')
            return null;
        if (s.includes('1899-12-30'))
            return null; // time-only disfrazada de fecha
        if (s.includes('T'))
            return s.split('T')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(s))
            return s;
    }
    return null;
}
/**
 * Hora: "1899-12-30T17:36:36.000Z" (valor time-only de Excel) → "17:36".
 * También acepta strings "HH:MM" y objetos Date.
 */
function pt(val) {
    if (!val)
        return null;
    const toHHMM = (d) => `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
    if (val instanceof Date)
        return toHHMM(val);
    if (typeof val === 'string') {
        const s = val.trim();
        if (s.toUpperCase() === 'N/A' || s === '')
            return null;
        if (s.includes('T'))
            return toHHMM(new Date(s));
        const m = s.match(/^(\d{1,2}):(\d{2})/);
        if (m)
            return `${m[1].padStart(2, '0')}:${m[2]}`;
    }
    return null;
}
/**
 * Decimal: limpia espacios y separadores de miles.
 * Soporta "  1,234,097.32" y números nativos de Excel.
 */
function pn(val) {
    if (val === null || val === undefined || val === '')
        return null;
    if (typeof val === 'number')
        return val;
    const s = String(val).trim().replace(/\s/g, '');
    const lastComma = s.lastIndexOf(',');
    const lastPeriod = s.lastIndexOf('.');
    const cleaned = lastComma > lastPeriod
        ? s.replace(/\./g, '').replace(',', '.') // formato europeo
        : s.replace(/,/g, ''); // formato US
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
}
/** "Federal" → 2, "Estatal" → 1, "Fideicomiso" → 3, "Concurrente" → 4 */
function parseOrigen(val) {
    var _a;
    if (!val)
        return null;
    const s = String(val).toUpperCase().trim();
    const m = { ESTATAL: 1, FEDERAL: 2, FIDEICOMISO: 3, 'CONCURRENTE O PROPIO': 4, CONCURRENTE: 4 };
    return (_a = m[s]) !== null && _a !== void 0 ? _a : null;
}
/** "Servicio- Contratacion..." → "SERVICIO", "Bien - Adquisicion..." → "BIEN" */
function parseTipoSol(val) {
    if (!val)
        return null;
    const s = String(val).toUpperCase();
    if (s.includes('SERVICIO'))
        return 'SERVICIO';
    if (s.includes('BIEN'))
        return 'BIEN';
    return null;
}
/**
 * Inferencia de tipo de solicitud cuando la columna está vacía.
 * Orden de prioridad:
 *   1. Descripción del bien/servicio (contiene palabras clave)
 *   2. Capítulo presupuestal (2000-2999 → BIEN, 3000-3999 → SERVICIO)
 *   3. Unidad de medida en AP ("SERVICIO" → SERVICIO)
 * Agrega una advertencia indicando el criterio utilizado.
 */
function inferirTipoSolicitud(generalRow, emSource, apSource, advertencias) {
    var _a, _b, _c;
    // 1. Palabras clave en la descripción del bien o servicio
    const desc = (_b = (_a = ns(emSource['Descripción del bien o servicio de acuerdo a la solicitud'])) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
    if (desc) {
        const esServicio = /SERVICIO|CONTRATACI[OÓ]N|PRESTACI[OÓ]N|ARRENDAMIENTO/.test(desc);
        const esBien = /\bBIEN\b|MATERIAL|SUMINISTRO|ADQUISICI[OÓ]N|COMBUSTIBLE|EQUIPO/.test(desc);
        if (esServicio && !esBien) {
            advertencias.push(`Tipo de solicitud inferido como SERVICIO desde descripción: "${desc.substring(0, 60)}…"`);
            return 'SERVICIO';
        }
        if (esBien && !esServicio) {
            advertencias.push(`Tipo de solicitud inferido como BIEN desde descripción: "${desc.substring(0, 60)}…"`);
            return 'BIEN';
        }
    }
    // 2. Capítulo presupuestal (clasificador económico del gasto)
    const capClave = parseClavePrefijo(generalRow['Capitulo']);
    if (capClave) {
        const capNum = Number(capClave);
        if (capNum >= 2000 && capNum < 3000) {
            advertencias.push(`Tipo de solicitud inferido como BIEN desde capítulo '${generalRow['Capitulo']}'`);
            return 'BIEN';
        }
        if (capNum >= 3000 && capNum < 4000) {
            advertencias.push(`Tipo de solicitud inferido como SERVICIO desde capítulo '${generalRow['Capitulo']}'`);
            return 'SERVICIO';
        }
    }
    // 3. Unidad de medida en hoja Afectación Presupuestal
    const um = (_c = ns(apSource === null || apSource === void 0 ? void 0 : apSource['Unidad de Medida'])) === null || _c === void 0 ? void 0 : _c.toUpperCase();
    if (um === 'SERVICIO') {
        advertencias.push(`Tipo de solicitud inferido como SERVICIO desde unidad de medida`);
        return 'SERVICIO';
    }
    return null;
}
/** "GC-Gasto Corriente" → "GC", "PAD-..." → "PAD", "MIXTO" → "MIXTO" */
function parseTipoGasto(val) {
    if (!val)
        return null;
    const s = String(val).toUpperCase().trim();
    if (s.startsWith('PAD'))
        return 'PAD';
    if (s.startsWith('GC'))
        return 'GC';
    if (s.startsWith('MIXTO') || s === 'MIXTO')
        return 'MIXTO';
    return null;
}
/** "15000000 - Recursos federales" → "15000000" */
function parseFuenteCodigo(val) {
    const s = ns(val);
    if (!s)
        return null;
    const m = s.match(/^(\S+)\s*[-–]/);
    return m ? m[1].trim() : s;
}
/** "3000 Servicios generales" → "3000", "3400 – Servicios..." → "3400" */
function parseClavePrefijo(val) {
    const s = ns(val);
    if (!s)
        return null;
    const m = s.match(/^(\d+)/);
    return m ? m[1] : null;
}
/** "Coordinación Administrativa (21800005000000S)" → "21800005000000S" */
function parseCCCodigo(val) {
    const s = ns(val);
    if (!s)
        return null;
    const m = s.match(/\(([^)]+)\)/);
    return m ? m[1].trim() : s;
}
/**
 * Mapeo de "Estado" / "Estatus del Estudio de Mercado" → ENUM BD.
 * "Adjudicado"/"Concluido" → CONCLUIDO
 * "En proceso"/"Proceso" → PROCESO
 * "Rechazado" → RECHAZADO
 * Otro → CONCLUIDO (con advertencia)
 */
function parseEstadoEM(val, advertencias) {
    if (!val)
        return 'CONCLUIDO';
    const s = String(val).toUpperCase().trim();
    if (s === 'ADJUDICADO' || s === 'CONCLUIDO')
        return 'CONCLUIDO';
    if (s === 'EN PROCESO' || s === 'PROCESO')
        return 'PROCESO';
    if (s === 'RECHAZADO')
        return 'RECHAZADO';
    advertencias.push(`Estado '${val}' no reconocido → se usará CONCLUIDO por defecto`);
    return 'CONCLUIDO';
}
/** "No"/"N/A"/"" → false, "Sí"/"Si"/"Yes"/"1" → true */
function parseSiNo(val) {
    if (!val)
        return false;
    const s = String(val).toUpperCase().trim();
    return ['SI', 'SÍ', 'YES', 'S', '1', 'TRUE', 'VERDADERO'].includes(s);
}
/** null/"N/A" → {activo:false,path:null}, URL → {activo:true,path:URL} */
function parseDictamen(val) {
    const s = ns(val);
    if (!s)
        return { activo: false, path: null };
    const esUrl = s.startsWith('http') || s.startsWith('ftp') || s.startsWith('https');
    return { activo: esUrl, path: esUrl ? s : null };
}
// ── Lector de hojas ──────────────────────────────────────────────────────────
/**
 * Lee una hoja buscando por prefijo de nombre (insensible a mayúsculas y espacios).
 * Detecta la primera fila con col[0] no nulo como cabecera.
 * Devuelve array de objetos con las cabeceras como claves (trimmed).
 */
function leerHoja(wb, prefijo) {
    const nombre = wb.SheetNames.find(n => n.trim().toLowerCase().startsWith(prefijo.trim().toLowerCase()));
    if (!nombre)
        return [];
    const sheet = wb.Sheets[nombre];
    const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
    // Detectar fila de cabeceras (primera con col[0] no nulo)
    let hi = -1;
    for (let i = 0; i < raw.length; i++) {
        if (raw[i][0] !== null && raw[i][0] !== undefined) {
            hi = i;
            break;
        }
    }
    if (hi < 0)
        return [];
    const headers = raw[hi].map(h => (h != null ? String(h).trim() : null));
    const rows = [];
    for (let r = hi + 1; r < raw.length; r++) {
        const row = raw[r];
        const isEmpty = row.every((v) => v === null || v === undefined || v === '');
        if (isEmpty)
            continue;
        const obj = {};
        headers.forEach((h, i) => { var _a; if (h)
            obj[h] = (_a = row[i]) !== null && _a !== void 0 ? _a : null; });
        rows.push(obj);
    }
    return rows;
}
/** Construye Map<folio, row> a partir de un array de filas y la clave de folio */
function porFolio(rows, key) {
    const m = new Map();
    for (const row of rows) {
        const f = ns(row[key]);
        if (f)
            m.set(f, row);
    }
    return m;
}
function cargarCatalogos() {
    return __awaiter(this, void 0, void 0, function* () {
        const [deps, opds, orgDescs, ccs, caps, subs, pgs, pes, fuentes, solsFolios] = yield Promise.all([
            AdqDependencias_1.default.findAll({ raw: true }),
            AdqOrganismosOPDS_1.default.findAll({ raw: true }),
            AdqOrganosDesconcentrados_1.default.findAll({ raw: true }),
            AdqCentrosCosto_1.default.findAll({ raw: true }),
            AdqCatCapitulos_1.default.findAll({ raw: true }),
            AdqCatSubcapitulos_1.default.findAll({ raw: true }),
            AdqCatPartidasGenericas_1.default.findAll({ raw: true }),
            AdqCatPartidasEspecificas_1.default.findAll({ raw: true }),
            adq_cat_fuentes_financiamiento_1.default.findAll({ raw: true }),
            AdqSolicitudes_1.default.findAll({ attributes: ['folio'], raw: true }),
        ]);
        return {
            depMap: new Map(deps.map((d) => [d.nombre.toUpperCase(), d.id_dependencia])),
            opdMap: new Map(opds.map((d) => [d.nombre.toUpperCase(), d.id_organismo_opds])),
            orgDescMap: new Map(orgDescs.map((d) => [d.nombre.toUpperCase(), d.id_organo_desconcentrado])),
            ccMap: new Map(ccs.map((d) => [String(d.codigo).toUpperCase(), d.id_centro_costo])),
            capMap: new Map(caps.map((d) => [String(d.clave).toUpperCase(), d.id_capitulo])),
            subMap: new Map(subs.map((d) => [String(d.clave).toUpperCase(), d.id_subcapitulo])),
            pgMap: new Map(pgs.map((d) => [String(d.clave).toUpperCase(), d.id_partida_generica])),
            peMap: new Map(pes.map((d) => [
                String(d.clave).toUpperCase(),
                { id: d.id_partida_especifica, id_partida_generica: d.id_partida_generica },
            ])),
            fuenteMap: new Map(fuentes.map((d) => [String(d.codigo).toUpperCase(), d.id_fuente_financiamiento])),
            foliosDB: new Set(solsFolios.map((s) => s.folio)),
        };
    });
}
// ── Inferencia de estatus ────────────────────────────────────────────────────
function inferirEstatus(tieneAdj, tieneAdq, tieneAP) {
    if (tieneAdj)
        return 5;
    if (tieneAdq)
        return 4;
    if (tieneAP)
        return 3;
    return 2; // siempre existe EM (es la hoja maestra)
}
function procesarRegistro(folio, fila, generalRow, // hoja General — siempre presente, fuente de solicitud base
emRow, // hoja Estudio de Mercado (complementa/sobreescribe General)
apRow, // hoja Afectacion Presupuestal
adqRow, // hoja Adquisiciones
adjRow, // hoja Adjudicacion
cats, foliosEnArchivo) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const errores = [];
    const advertencias = [];
    // ── Validaciones de unicidad ──────────────────────────────────────────────
    if (cats.foliosDB.has(folio)) {
        errores.push(`Folio '${folio}' ya existe en la base de datos`);
    }
    else if (foliosEnArchivo.has(folio)) {
        errores.push(`Folio '${folio}' está duplicado en el archivo`);
    }
    // ── Fuentes con respaldo en General ──────────────────────────────────────
    // Si no hay fila en la hoja específica, se usa la propia fila de General
    // (que también contiene esas columnas) para no perder datos.
    const emSource = emRow !== null && emRow !== void 0 ? emRow : generalRow;
    const apSource = apRow !== null && apRow !== void 0 ? apRow : (ns(generalRow['Tipo de gasto:']) ? generalRow : null);
    const adqSource = adqRow !== null && adqRow !== void 0 ? adqRow : ((ns(generalRow['Modalidad del Procedimiento Adquisitivo']) || ns(generalRow['No. de procedimiento']))
        ? generalRow : null);
    const adjSource = adjRow !== null && adjRow !== void 0 ? adjRow : ((ns(generalRow['Nombre o Razón Social']) || pn(generalRow['Monto Total Adjudicación con IVA']))
        ? generalRow : null);
    // ── adq_solicitudes — siempre de General ─────────────────────────────────
    const fecha_ingreso = pd(generalRow['Fecha Ingreso de Solicitud']);
    if (!fecha_ingreso)
        errores.push('Fecha de ingreso inválida o vacía');
    const tipo_solicitud = (_a = parseTipoSol(generalRow['Tipo de Solicitud:'])) !== null && _a !== void 0 ? _a : inferirTipoSolicitud(generalRow, emSource, apSource, advertencias);
    if (!tipo_solicitud) {
        errores.push(`Tipo de solicitud no reconocido y no pudo inferirse` +
            (generalRow['Tipo de Solicitud:'] ? ` — valor: '${generalRow['Tipo de Solicitud:']}'` : ' — columna vacía'));
    }
    const id_origen_recurso = parseOrigen(generalRow['Origen de Recurso']);
    if (!id_origen_recurso)
        errores.push(`Origen de recurso '${generalRow['Origen de Recurso']}' no reconocido`);
    const depNombre = (_b = ns(generalRow['Dependencia'])) === null || _b === void 0 ? void 0 : _b.toUpperCase();
    let id_dependencia = null;
    if (depNombre) {
        id_dependencia = (_c = cats.depMap.get(depNombre)) !== null && _c !== void 0 ? _c : null;
        if (!id_dependencia)
            advertencias.push(`Dependencia '${generalRow['Dependencia']}' no encontrada en catálogo`);
    }
    const ccCodigo = (_d = parseCCCodigo(generalRow['Centro de Costo'])) === null || _d === void 0 ? void 0 : _d.toUpperCase();
    let id_centro_costo = null;
    if (ccCodigo) {
        id_centro_costo = (_e = cats.ccMap.get(ccCodigo)) !== null && _e !== void 0 ? _e : null;
        if (!id_centro_costo)
            advertencias.push(`Centro de Costo '${generalRow['Centro de Costo']}' (código: ${ccCodigo}) no encontrado`);
    }
    const capClave = (_f = parseClavePrefijo(generalRow['Capitulo'])) === null || _f === void 0 ? void 0 : _f.toUpperCase();
    let id_capitulo = null;
    if (capClave) {
        id_capitulo = (_g = cats.capMap.get(capClave)) !== null && _g !== void 0 ? _g : null;
        if (!id_capitulo)
            advertencias.push(`Capítulo '${generalRow['Capitulo']}' (clave: ${capClave}) no encontrado`);
    }
    const subClave = (_h = parseClavePrefijo(generalRow['Concepto del Gasto'])) === null || _h === void 0 ? void 0 : _h.toUpperCase();
    let id_subcapitulo = null;
    if (subClave) {
        id_subcapitulo = (_j = cats.subMap.get(subClave)) !== null && _j !== void 0 ? _j : null;
        if (!id_subcapitulo)
            advertencias.push(`Subcapítulo '${generalRow['Concepto del Gasto']}' (clave: ${subClave}) no encontrado`);
    }
    const pgClave = (_k = parseClavePrefijo(generalRow['Giro o Partida'])) === null || _k === void 0 ? void 0 : _k.toUpperCase();
    let id_partida_generica = null;
    if (pgClave) {
        id_partida_generica = (_l = cats.pgMap.get(pgClave)) !== null && _l !== void 0 ? _l : null;
        if (!id_partida_generica)
            advertencias.push(`Partida '${generalRow['Giro o Partida']}' (clave: ${pgClave}) no encontrada en catálogo de partidas genéricas`);
    }
    const estadoRaw = (_o = (_m = generalRow['Estado ']) !== null && _m !== void 0 ? _m : generalRow['Estado']) !== null && _o !== void 0 ? _o : null;
    const estado_estudio_mercado = parseEstadoEM(estadoRaw, advertencias);
    // ── adq_estudio_mercado — de emSource (hoja EM o General) ────────────────
    const tipoContrRaw = (_p = ns(emSource['Tipo Contracion'])) === null || _p === void 0 ? void 0 : _p.toUpperCase();
    let tipo_contratacion = null;
    if (tipoContrRaw) {
        if (['IRP', 'LPNP', 'CP'].includes(tipoContrRaw)) {
            tipo_contratacion = tipoContrRaw;
        }
        else {
            advertencias.push(`Tipo de contratación '${tipoContrRaw}' no está en catálogo (IRP/LPNP/CP)`);
        }
    }
    const emDatos = {
        tipo_contratacion,
        estatus_estudio: ns(emSource['Estatus del Estudio de Mercado']),
        descripcion_bien_servicio: ns(emSource['Descripción del bien o servicio de acuerdo a la solicitud']),
        valor_estudio_mercado: pn(emSource['Valor del Estudio de Mercado']),
        monto_sabys: pn(emSource['Monto SABYS']),
        contratacion_plurianual: parseSiNo(emSource['Contratacion Plurianual']) ? 'SI' : 'NO',
        monto_2026: pn(emSource['Monto 2026']),
        monto_2027: pn(emSource['Monto 2027']),
        monto_2028: pn(emSource['Monto 2028']),
        monto_2029: pn(emSource['Monto 2029']),
    };
    // Solo guardar EM si hay datos reales (distintos de null y del default 'NO')
    const tieneEM = Object.values(emDatos).some(v => v !== null && v !== 'NO');
    // ── adq_afectacion_presupuestal + adq_bienes_servicios — de apSource ──────
    let apDatos = null;
    let bsDatos = null;
    if (apSource) {
        const tipo_gasto = parseTipoGasto(apSource['Tipo de gasto:']);
        if (!tipo_gasto) {
            errores.push(`Tipo de gasto '${apSource['Tipo de gasto:']}' inválido — use PAD, GC o MIXTO`);
        }
        else {
            const fuenteCodigo = (_q = parseFuenteCodigo(apSource['Fuente de financiamiento:'])) === null || _q === void 0 ? void 0 : _q.toUpperCase();
            let id_fuente_financiamiento = null;
            if (fuenteCodigo) {
                id_fuente_financiamiento = (_r = cats.fuenteMap.get(fuenteCodigo)) !== null && _r !== void 0 ? _r : null;
                if (!id_fuente_financiamiento)
                    advertencias.push(`Fuente de financiamiento '${apSource['Fuente de financiamiento:']}' (código: ${fuenteCodigo}) no encontrada`);
            }
            apDatos = {
                tipo_gasto,
                nombre_testigo_social: ns(apSource['Nombre de Testigo Social (N/A,Nombre)']),
                id_fuente_financiamiento,
                importe_suficiencia: pn(apSource['Importe de Suficiencia Presupuestal']),
                oficio_suficiencia_path: ns(apSource['Oficio de Suficiencia']),
            };
            bsDatos = {
                clave_verificacion: ns(apSource['Clave de Verificación']),
                descripcion_clave_verificacion: ns(apSource['Descripción de la Clave de Verificación']),
                unidad_medida: ns(apSource['Unidad de Medida']),
                dictamen: false,
                contrato_abierto: parseSiNo(apSource['¿Es contrato abierto?']),
                consolidado: parseSiNo(apSource['¿Es consolidado?']),
            };
        }
    }
    // ── adq_procedimiento_adquisitivo — de adqSource + adjSource ─────────────
    let paDatos = null;
    const tieneAdq = !!(ns(adqSource === null || adqSource === void 0 ? void 0 : adqSource['No. de procedimiento']) || ns(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Modalidad del Procedimiento Adquisitivo']));
    const tieneAdj = !!(ns(adjSource === null || adjSource === void 0 ? void 0 : adjSource['Nombre o Razón Social']) || pn(adjSource === null || adjSource === void 0 ? void 0 : adjSource['Monto Total Adjudicación con IVA']) || ns(adjSource === null || adjSource === void 0 ? void 0 : adjSource['Numero de Contrato:']));
    if (adqSource || adjSource) {
        const dictamen = adqSource ? parseDictamen(adqSource['Dictamen de Procedencia(Pdf)']) : { activo: false, path: null };
        const fecha_liberacion_mercado = apSource ? pd(apSource['Fecha de Liberación de Estudio de Mercado']) : null;
        // La columna de Sesión del Comité está truncada en General; se prefiere la hoja Adq
        const fechaSesionComite = adqRow
            ? pd(adqRow['Fecha de Sesión del Comité de Adquisiciones y Servicios para Análisis Cualitativo de Propuestas:'])
            : pd(generalRow['Fecha de Sesión del Comité de Adquisiciones y Servicios para Análisis Cualitativ']);
        const horaSesionComite = adqRow
            ? pt(adqRow['Hora de Sesión del Comité de Adquisiciones y Servicios para Análisis Cualitativo de Propuestas.'])
            : pt(generalRow['Hora de Sesión del Comité de Adquisiciones y Servicios para Análisis Cualitativo']);
        paDatos = {
            fecha_liberacion_mercado,
            modalidad: ns(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Modalidad del Procedimiento Adquisitivo']),
            dictamen_procedencia: dictamen.activo,
            dictamen_procedencia_path: dictamen.path,
            responsable: (_s = ns(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Responsable del Procedimiento'])) !== null && _s !== void 0 ? _s : ns(adjSource === null || adjSource === void 0 ? void 0 : adjSource['Nombre del Responsable del  Procedimiento']),
            no_procedimiento: ns(adqSource === null || adqSource === void 0 ? void 0 : adqSource['No. de procedimiento']),
            convocatoria_invitacion: ns(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Convocatoria y/o Invitacion (URL)']),
            convocatoria_url: ns(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Convocatoria y/o Invitacion (URL)']),
            medio_publicacion: ns(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Medio de Publicación:']),
            fecha_junta_aclaracion: pd(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Fecha de Junta de Aclaración:']),
            hora_junta_aclaracion: pt(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Hora de Junta de Aclaración:']),
            fecha_presentacion_apertura: pd(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Fecha de Presentación y Apertura de Proposiciones:']),
            hora_presentacion_apertura: pt(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Hora de Presentación y Apertura de Proposiciones:']),
            fecha_sesion_comite_analisis: fechaSesionComite,
            hora_sesion_comite_analisis: horaSesionComite,
            fecha_contraoferta: pd(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Fecha de Contra Oferta:']),
            hora_contraoferta: pt(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Hora de Contra Oferta:']),
            fecha_dictaminacion_comite: pd(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Fecha de Dictaminación de Adjudicación del Comité:']),
            hora_dictaminacion_comite: pt(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Hora de de Dictaminación de Adjudicación del Comité:']),
            fecha_sesion_subcomite: pd(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Fecha Sesión del Subcomité Revisor de Convocatorias e Invitaciones']),
            hora_sesion_subcomite: pt(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Hora Sesión del Subcomité Revisor de Convocatorias e Invitaciones']),
            fecha_fallo: pd(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Fecha de Fallo:']),
            hora_fallo: pt(adqSource === null || adqSource === void 0 ? void 0 : adqSource['Hora de Fallo:']),
            proveedor_razon_social: ns(adjSource === null || adjSource === void 0 ? void 0 : adjSource['Nombre o Razón Social']),
            proveedor_rfc: (_t = ns(adjSource === null || adjSource === void 0 ? void 0 : adjSource['RFC'])) === null || _t === void 0 ? void 0 : _t.replace(/\s+/g, ''),
            monto_total_adjudicado_iva: pn(adjSource === null || adjSource === void 0 ? void 0 : adjSource['Monto Total Adjudicación con IVA']),
            no_contrato: ns(adjSource === null || adjSource === void 0 ? void 0 : adjSource['Numero de Contrato:']),
            vigencia_inicio: pd(adjSource === null || adjSource === void 0 ? void 0 : adjSource['Inicio de Vigencia:']),
            vigencia_termino: pd(adjSource === null || adjSource === void 0 ? void 0 : adjSource['Termino de Vigencia:']),
            url_testimonio_testigo_social: ns(adjSource === null || adjSource === void 0 ? void 0 : adjSource['Publicación del Testimonio del Testigo Social:']),
            remanente_suficiencia_presupuestal: pn(adjSource === null || adjSource === void 0 ? void 0 : adjSource['REMANENTE(Suf.Presupuestal']),
            estatus_adjudicacion: ns(adjSource === null || adjSource === void 0 ? void 0 : adjSource['Estatus']),
            comentarios_adjudicacion: ns(adjSource === null || adjSource === void 0 ? void 0 : adjSource['Comentarios']),
            // Reprogramacion solo existe en hoja Adjudicacion (no en General)
            existe_reprogramacion: (adjRow === null || adjRow === void 0 ? void 0 : adjRow['Reprogramacion']) != null ? parseSiNo(adjRow['Reprogramacion']) : null,
        };
    }
    // ── Inferir estatus_id ────────────────────────────────────────────────────
    const estatus_id = inferirEstatus(tieneAdj, tieneAdq, !!apDatos);
    return {
        fila,
        folio,
        errores,
        advertencias,
        datos: errores.length === 0 ? {
            solicitud: {
                folio, fecha_ingreso, id_origen_recurso, tipo_solicitud, estatus_id,
                id_dependencia, id_opd: null, id_organo_desconcentrado: null,
                id_centro_costo, id_capitulo, id_subcapitulo, id_partida_generica,
                id_partida_especifica: null, estado_estudio_mercado,
            },
            em: tieneEM ? emDatos : null,
            ap: apDatos,
            bs: bsDatos,
            pa: paDatos,
        } : null,
    };
}
const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000;
function limpiarExpirados() {
    const ahora = Date.now();
    for (const [key, entry] of cache) {
        if (entry.expira < ahora)
            cache.delete(key);
    }
}
// ── Validación multi-hoja ────────────────────────────────────────────────────
function validarBuffer(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const wb = XLSX.read(buffer, { type: 'buffer', cellDates: true });
        // Hoja General es la única obligatoria — es la fuente maestra de todos los folios
        const hojaGeneral = wb.SheetNames.find(n => n.trim().toLowerCase() === 'general');
        if (!hojaGeneral)
            throw new Error('No se encontró la hoja "General" en el archivo');
        // Leer todas las hojas (las específicas son opcionales y complementan a General)
        const generalRows = leerHoja(wb, 'general');
        const emRows = leerHoja(wb, 'estudio de mercado');
        const apRows = leerHoja(wb, 'afectacion presupuestal');
        const adqRows = leerHoja(wb, 'adquisiciones');
        const adjRows = leerHoja(wb, 'adjudicacion');
        if (generalRows.length === 0) {
            return {
                resultados: [],
                resumen: { total: 0, validos: 0, errores_count: 0, advertencias_count: 0, filas: [] },
                expira: Date.now() + CACHE_TTL_MS,
            };
        }
        // Mapas por folio — para cruzar con hojas específicas cuando existan
        const emMap = porFolio(emRows, 'Folio Interno de Solicitud');
        const apMap = porFolio(apRows, 'Folio Interno(Seguimiento)');
        const adqMap = porFolio(adqRows, 'Folio Interno (Seguimiento)');
        const adjMap = porFolio(adjRows, 'Folio Interno (Seguimiento)');
        const cats = yield cargarCatalogos();
        const foliosEnArchivo = new Set();
        const resultados = [];
        // Loop maestro sobre General: garantiza que TODOS los folios sean importados
        for (let i = 0; i < generalRows.length; i++) {
            const folio = ns(generalRows[i]['Folio Interno de Solicitud']);
            if (!folio) {
                resultados.push({
                    fila: i + 4, folio: '', errores: ['Folio Interno vacío'], advertencias: [], datos: null,
                });
                continue;
            }
            const resultado = procesarRegistro(folio, i + 4, generalRows[i], // fuente maestra
            (_a = emMap.get(folio)) !== null && _a !== void 0 ? _a : null, // complementa si existe en hoja EM
            (_b = apMap.get(folio)) !== null && _b !== void 0 ? _b : null, // complementa si existe en hoja AP
            (_c = adqMap.get(folio)) !== null && _c !== void 0 ? _c : null, // complementa si existe en hoja Adq
            (_d = adjMap.get(folio)) !== null && _d !== void 0 ? _d : null, // complementa si existe en hoja Adj
            cats, foliosEnArchivo);
            foliosEnArchivo.add(folio);
            resultados.push(resultado);
        }
        const validas = resultados.filter(r => r.errores.length === 0);
        const conError = resultados.filter(r => r.errores.length > 0);
        const resumen = {
            total: resultados.length,
            validos: validas.length,
            errores_count: conError.length,
            advertencias_count: resultados.filter(r => r.advertencias.length > 0).length,
            filas: resultados.map(r => ({
                fila: r.fila,
                folio: r.folio,
                estado: r.errores.length > 0 ? 'error' : r.advertencias.length > 0 ? 'advertencia' : 'ok',
                errores: r.errores,
                advertencias: r.advertencias,
            })),
        };
        return { resultados, resumen, expira: Date.now() + CACHE_TTL_MS };
    });
}
// ── Inserción desde caché ────────────────────────────────────────────────────
function insertarDesdeCache(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const entrada = cache.get(token);
        if (!entrada)
            throw new Error('TOKEN_EXPIRADO');
        cache.delete(token);
        const validas = entrada.resultados.filter(r => r.errores.length === 0);
        let importados = 0;
        if (validas.length > 0) {
            const t = yield connection_1.default.transaction();
            try {
                for (const r of validas) {
                    const sol = yield AdqSolicitudes_1.default.create(Object.assign(Object.assign({}, r.datos.solicitud), { user_id: null }), { transaction: t });
                    const idSolicitud = sol.getDataValue('id_solicitud');
                    // Estudio de Mercado — solo si hay datos reales en la hoja EM o en General
                    if (r.datos.em) {
                        yield AdqEstudioMercado_1.default.create(Object.assign(Object.assign({}, r.datos.em), { id_solicitud: idSolicitud, created_by: SYSTEM_USER }), { transaction: t });
                    }
                    // Afectación Presupuestal (solo si existe en el Excel)
                    if (r.datos.ap) {
                        yield AdqAfectacionPresupuestal_1.default.create(Object.assign(Object.assign({}, r.datos.ap), { id_solicitud: idSolicitud, created_by: SYSTEM_USER }), { transaction: t });
                    }
                    // Bienes y Servicios (solo si existe en la hoja AP)
                    if (r.datos.bs) {
                        yield AdqBienesServicios_1.default.create(Object.assign(Object.assign({}, r.datos.bs), { id_solicitud: idSolicitud, created_by: SYSTEM_USER }), { transaction: t });
                    }
                    // Procedimiento Adquisitivo (solo si tiene datos de Adquisiciones o Adjudicación)
                    if (r.datos.pa) {
                        yield AdqProcedimientoAdquisitivo_1.default.create(Object.assign(Object.assign({}, r.datos.pa), { id_solicitud: idSolicitud, created_by: SYSTEM_USER }), { transaction: t });
                    }
                    importados++;
                }
                yield t.commit();
            }
            catch (err) {
                yield t.rollback();
                throw err;
            }
        }
        const omitidos = entrada.resumen.errores_count;
        const filasConError = entrada.resumen.filas.filter((f) => f.estado === 'error');
        return { importados, omitidos, filas: filasConError };
    });
}
// ── Handlers HTTP ─────────────────────────────────────────────────────────────
const validarExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        limpiarExpirados();
        if (!req.file) {
            res.status(400).json({ ok: false, msg: 'No se recibió ningún archivo' });
            return;
        }
        const entrada = yield validarBuffer(req.file.buffer);
        const token = (0, uuid_1.v4)();
        cache.set(token, entrada);
        res.json(Object.assign({ ok: true, token }, entrada.resumen));
    }
    catch (err) {
        console.error('ERROR validarExcel =>', err);
        res.status(500).json({ ok: false, msg: (_a = err.message) !== null && _a !== void 0 ? _a : 'Error al procesar el archivo Excel' });
    }
});
exports.validarExcel = validarExcel;
const importarExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        limpiarExpirados();
        const token = (_a = req.body) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(400).json({ ok: false, msg: 'Token de validación no proporcionado' });
            return;
        }
        if (!cache.has(token)) {
            res.status(410).json({ ok: false, msg: 'La sesión de validación expiró o ya fue utilizada. Vuelve a validar el archivo.' });
            return;
        }
        const resultado = yield insertarDesdeCache(token);
        res.json(Object.assign({ ok: true }, resultado));
    }
    catch (err) {
        console.error('ERROR importarExcel =>', err);
        res.status(500).json({ ok: false, msg: (_b = err.message) !== null && _b !== void 0 ? _b : 'Error al importar los datos' });
    }
});
exports.importarExcel = importarExcel;
