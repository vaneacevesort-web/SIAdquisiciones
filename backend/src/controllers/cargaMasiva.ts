import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../database/connection';
import AdqSolicitudes from '../models/AdqSolicitudes';
import AdqEstudioMercado from '../models/AdqEstudioMercado';
import AdqBienesServicios from '../models/AdqBienesServicios';
import AdqAfectacionPresupuestal from '../models/AdqAfectacionPresupuestal';
import AdqProcedimientoAdquisitivo from '../models/AdqProcedimientoAdquisitivo';
import AdqDependencias from '../models/AdqDependencias';
import AdqCentrosCosto from '../models/AdqCentrosCosto';
import AdqOrganismosOPDS from '../models/AdqOrganismosOPDS';
import AdqOrganosDesconcentrados from '../models/AdqOrganosDesconcentrados';
import AdqCatCapitulos from '../models/AdqCatCapitulos';
import AdqCatSubcapitulos from '../models/AdqCatSubcapitulos';
import AdqCatPartidasGenericas from '../models/AdqCatPartidasGenericas';
import AdqCatPartidasEspecificas from '../models/AdqCatPartidasEspecificas';
import AdqCatFuentesFinanciamiento from '../models/adq_cat_fuentes_financiamiento';

const SYSTEM_USER = '00000000-0000-0000-0000-000000000000';

// ── Helpers de transformación (formato institucional) ─────────────────────────

/** Normaliza a null si el valor es vacío, undefined o "N/A" */
function ns(val: any): string | null {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  return (s === '' || s.toUpperCase() === 'N/A') ? null : s;
}

/**
 * Fecha: acepta Date ISO de xlsx ("2026-02-10T06:00:36.000Z") o string YYYY-MM-DD.
 * Rechaza fechas epoch de Excel (1899-12-30) que en realidad son horas.
 */
function pd(val: any): string | null {
  if (!val) return null;
  if (val instanceof Date) {
    if (val.getUTCFullYear() === 1899) return null; // es un time-only
    return val.toISOString().split('T')[0];
  }
  if (typeof val === 'string') {
    const s = val.trim();
    if (s.toUpperCase() === 'N/A' || s === '') return null;
    if (s.includes('1899-12-30')) return null;       // time-only disfrazada de fecha
    if (s.includes('T')) return s.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  }
  return null;
}

/**
 * Hora: "1899-12-30T17:36:36.000Z" (valor time-only de Excel) → "17:36".
 * También acepta strings "HH:MM" y objetos Date.
 */
function pt(val: any): string | null {
  if (!val) return null;
  const toHHMM = (d: Date) =>
    `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;

  if (val instanceof Date) return toHHMM(val);

  if (typeof val === 'string') {
    const s = val.trim();
    if (s.toUpperCase() === 'N/A' || s === '') return null;
    if (s.includes('T')) return toHHMM(new Date(s));
    const m = s.match(/^(\d{1,2}):(\d{2})/);
    if (m) return `${m[1].padStart(2, '0')}:${m[2]}`;
  }
  return null;
}

/**
 * Decimal: limpia espacios y separadores de miles.
 * Soporta "  1,234,097.32" y números nativos de Excel.
 */
function pn(val: any): number | null {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return val;
  const s = String(val).trim().replace(/\s/g, '');
  const lastComma = s.lastIndexOf(',');
  const lastPeriod = s.lastIndexOf('.');
  const cleaned = lastComma > lastPeriod
    ? s.replace(/\./g, '').replace(',', '.')   // formato europeo
    : s.replace(/,/g, '');                      // formato US
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** "Federal" → 2, "Estatal" → 1, "Fideicomiso" → 3, "Concurrente" → 4 */
function parseOrigen(val: any): number | null {
  if (!val) return null;
  const s = String(val).toUpperCase().trim();
  const m: Record<string, number> = { ESTATAL: 1, FEDERAL: 2, FIDEICOMISO: 3, 'CONCURRENTE O PROPIO': 4, CONCURRENTE: 4 };
  return m[s] ?? null;
}

/** "Servicio- Contratacion..." → "SERVICIO", "Bien - Adquisicion..." → "BIEN" */
function parseTipoSol(val: any): 'BIEN' | 'SERVICIO' | null {
  if (!val) return null;
  const s = String(val).toUpperCase();
  if (s.includes('SERVICIO')) return 'SERVICIO';
  if (s.includes('BIEN')) return 'BIEN';
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
function inferirTipoSolicitud(
  generalRow: any,
  emSource:   any,
  apSource:   any | null,
  advertencias: string[],
): 'BIEN' | 'SERVICIO' | null {

  // 1. Palabras clave en la descripción del bien o servicio
  const desc = ns(emSource['Descripción del bien o servicio de acuerdo a la solicitud'])?.toUpperCase() ?? '';
  if (desc) {
    const esServicio = /SERVICIO|CONTRATACI[OÓ]N|PRESTACI[OÓ]N|ARRENDAMIENTO/.test(desc);
    const esBien     = /\bBIEN\b|MATERIAL|SUMINISTRO|ADQUISICI[OÓ]N|COMBUSTIBLE|EQUIPO/.test(desc);
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
  const um = ns(apSource?.['Unidad de Medida'])?.toUpperCase();
  if (um === 'SERVICIO') {
    advertencias.push(`Tipo de solicitud inferido como SERVICIO desde unidad de medida`);
    return 'SERVICIO';
  }

  return null;
}

/** "GC-Gasto Corriente" → "GC", "PAD-..." → "PAD", "MIXTO" → "MIXTO" */
function parseTipoGasto(val: any): 'PAD' | 'GC' | 'MIXTO' | null {
  if (!val) return null;
  const s = String(val).toUpperCase().trim();
  if (s.startsWith('PAD')) return 'PAD';
  if (s.startsWith('GC')) return 'GC';
  if (s.startsWith('MIXTO') || s === 'MIXTO') return 'MIXTO';
  return null;
}

/** "15000000 - Recursos federales" → "15000000" */
function parseFuenteCodigo(val: any): string | null {
  const s = ns(val);
  if (!s) return null;
  const m = s.match(/^(\S+)\s*[-–]/);
  return m ? m[1].trim() : s;
}

/** "3000 Servicios generales" → "3000", "3400 – Servicios..." → "3400" */
function parseClavePrefijo(val: any): string | null {
  const s = ns(val);
  if (!s) return null;
  const m = s.match(/^(\d+)/);
  return m ? m[1] : null;
}

/** "Coordinación Administrativa (21800005000000S)" → "21800005000000S" */
function parseCCCodigo(val: any): string | null {
  const s = ns(val);
  if (!s) return null;
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
function parseEstadoEM(val: any, advertencias: string[]): 'CONCLUIDO' | 'PROCESO' | 'RECHAZADO' {
  if (!val) return 'CONCLUIDO';
  const s = String(val).toUpperCase().trim();
  if (s === 'ADJUDICADO' || s === 'CONCLUIDO') return 'CONCLUIDO';
  if (s === 'EN PROCESO' || s === 'PROCESO') return 'PROCESO';
  if (s === 'RECHAZADO') return 'RECHAZADO';
  advertencias.push(`Estado '${val}' no reconocido → se usará CONCLUIDO por defecto`);
  return 'CONCLUIDO';
}

/** "No"/"N/A"/"" → false, "Sí"/"Si"/"Yes"/"1" → true */
function parseSiNo(val: any): boolean {
  if (!val) return false;
  const s = String(val).toUpperCase().trim();
  return ['SI', 'SÍ', 'YES', 'S', '1', 'TRUE', 'VERDADERO'].includes(s);
}

/** null/"N/A" → {activo:false,path:null}, URL → {activo:true,path:URL} */
function parseDictamen(val: any): { activo: boolean; path: string | null } {
  const s = ns(val);
  if (!s) return { activo: false, path: null };
  const esUrl = s.startsWith('http') || s.startsWith('ftp') || s.startsWith('https');
  return { activo: esUrl, path: esUrl ? s : null };
}

// ── Lector de hojas ──────────────────────────────────────────────────────────

/**
 * Lee una hoja buscando por prefijo de nombre (insensible a mayúsculas y espacios).
 * Detecta la primera fila con col[0] no nulo como cabecera.
 * Devuelve array de objetos con las cabeceras como claves (trimmed).
 */
function leerHoja(wb: XLSX.WorkBook, prefijo: string): any[] {
  const nombre = wb.SheetNames.find(n =>
    n.trim().toLowerCase().startsWith(prefijo.trim().toLowerCase())
  );
  if (!nombre) return [];

  const sheet = wb.Sheets[nombre];
  const raw: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null }) as any[][];

  // Detectar fila de cabeceras (primera con col[0] no nulo)
  let hi = -1;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i][0] !== null && raw[i][0] !== undefined) { hi = i; break; }
  }
  if (hi < 0) return [];

  const headers = (raw[hi] as any[]).map(h => (h != null ? String(h).trim() : null));

  const rows: any[] = [];
  for (let r = hi + 1; r < raw.length; r++) {
    const row = raw[r];
    const isEmpty = row.every((v: any) => v === null || v === undefined || v === '');
    if (isEmpty) continue;
    const obj: any = {};
    headers.forEach((h, i) => { if (h) obj[h] = row[i] ?? null; });
    rows.push(obj);
  }
  return rows;
}

/** Construye Map<folio, row> a partir de un array de filas y la clave de folio */
function porFolio(rows: any[], key: string): Map<string, any> {
  const m = new Map<string, any>();
  for (const row of rows) {
    const f = ns(row[key]);
    if (f) m.set(f, row);
  }
  return m;
}

// ── Catálogos ────────────────────────────────────────────────────────────────

interface Catalogos {
  depMap:    Map<string, number>;
  opdMap:    Map<string, number>;
  orgDescMap: Map<string, number>;
  ccMap:     Map<string, number>;
  capMap:    Map<string, number>;
  subMap:    Map<string, number>;
  pgMap:     Map<string, number>;
  // peMap: clave → { id de la partida específica, id de su partida genérica padre }
  peMap:     Map<string, { id: number; id_partida_generica: number }>;
  fuenteMap: Map<string, number>;
  foliosDB:  Set<string>;
}

async function cargarCatalogos(): Promise<Catalogos> {
  const [deps, opds, orgDescs, ccs, caps, subs, pgs, pes, fuentes, solsFolios] = await Promise.all([
    AdqDependencias.findAll({ raw: true })          as Promise<any[]>,
    AdqOrganismosOPDS.findAll({ raw: true })        as Promise<any[]>,
    AdqOrganosDesconcentrados.findAll({ raw: true }) as Promise<any[]>,
    AdqCentrosCosto.findAll({ raw: true })          as Promise<any[]>,
    AdqCatCapitulos.findAll({ raw: true })          as Promise<any[]>,
    AdqCatSubcapitulos.findAll({ raw: true })       as Promise<any[]>,
    AdqCatPartidasGenericas.findAll({ raw: true })  as Promise<any[]>,
    AdqCatPartidasEspecificas.findAll({ raw: true }) as Promise<any[]>,
    AdqCatFuentesFinanciamiento.findAll({ raw: true }) as Promise<any[]>,
    AdqSolicitudes.findAll({ attributes: ['folio'], raw: true }) as Promise<any[]>,
  ]);

  return {
    depMap:     new Map(deps.map((d: any)     => [d.nombre.toUpperCase(), d.id_dependencia])),
    opdMap:     new Map(opds.map((d: any)      => [d.nombre.toUpperCase(), d.id_organismo_opds])),
    orgDescMap: new Map(orgDescs.map((d: any)  => [d.nombre.toUpperCase(), d.id_organo_desconcentrado])),
    ccMap:      new Map(ccs.map((d: any)       => [String(d.codigo).toUpperCase(), d.id_centro_costo])),
    capMap:     new Map(caps.map((d: any)      => [String(d.clave).toUpperCase(), d.id_capitulo])),
    subMap:     new Map(subs.map((d: any)      => [String(d.clave).toUpperCase(), d.id_subcapitulo])),
    pgMap:      new Map(pgs.map((d: any)       => [String(d.clave).toUpperCase(), d.id_partida_generica])),
    peMap:      new Map(pes.map((d: any)       => [
      String(d.clave).toUpperCase(),
      { id: d.id_partida_especifica, id_partida_generica: d.id_partida_generica },
    ])),
    fuenteMap:  new Map(fuentes.map((d: any)   => [String(d.codigo).toUpperCase(), d.id_fuente_financiamiento])),
    foliosDB:   new Set(solsFolios.map((s: any) => s.folio)),
  };
}

// ── Inferencia de estatus ────────────────────────────────────────────────────

function inferirEstatus(tieneAdj: boolean, tieneAdq: boolean, tieneAP: boolean): number {
  if (tieneAdj) return 5;
  if (tieneAdq) return 4;
  if (tieneAP)  return 3;
  return 2; // siempre existe EM (es la hoja maestra)
}

// ── Procesamiento de un registro ─────────────────────────────────────────────

interface FilaResultado {
  fila:         number;
  folio:        string;
  errores:      string[];
  advertencias: string[];
  datos:        any;
}

function procesarRegistro(
  folio:      string,
  fila:       number,
  generalRow: any,         // hoja General — siempre presente, fuente de solicitud base
  emRow:      any | null,  // hoja Estudio de Mercado (complementa/sobreescribe General)
  apRow:      any | null,  // hoja Afectacion Presupuestal
  adqRow:     any | null,  // hoja Adquisiciones
  adjRow:     any | null,  // hoja Adjudicacion
  cats:       Catalogos,
  foliosEnArchivo: Set<string>,
): FilaResultado {
  const errores:      string[] = [];
  const advertencias: string[] = [];

  // ── Validaciones de unicidad ──────────────────────────────────────────────
  if (cats.foliosDB.has(folio)) {
    errores.push(`Folio '${folio}' ya existe en la base de datos`);
  } else if (foliosEnArchivo.has(folio)) {
    errores.push(`Folio '${folio}' está duplicado en el archivo`);
  }

  // ── Fuentes con respaldo en General ──────────────────────────────────────
  // Si no hay fila en la hoja específica, se usa la propia fila de General
  // (que también contiene esas columnas) para no perder datos.
  const emSource  = emRow  ?? generalRow;
  const apSource  = apRow  ?? (ns(generalRow['Tipo de gasto:']) ? generalRow : null);
  const adqSource = adqRow ?? (
    (ns(generalRow['Modalidad del Procedimiento Adquisitivo']) || ns(generalRow['No. de procedimiento']))
      ? generalRow : null
  );
  const adjSource = adjRow ?? (
    (ns(generalRow['Nombre o Razón Social']) || pn(generalRow['Monto Total Adjudicación con IVA']))
      ? generalRow : null
  );

  // ── adq_solicitudes — siempre de General ─────────────────────────────────
  const fecha_ingreso = pd(generalRow['Fecha Ingreso de Solicitud']);
  if (!fecha_ingreso) errores.push('Fecha de ingreso inválida o vacía');

  const tipo_solicitud: 'BIEN' | 'SERVICIO' | null =
    parseTipoSol(generalRow['Tipo de Solicitud:'])
    ?? inferirTipoSolicitud(generalRow, emSource, apSource, advertencias);
  if (!tipo_solicitud) {
    errores.push(
      `Tipo de solicitud no reconocido y no pudo inferirse` +
      (generalRow['Tipo de Solicitud:'] ? ` — valor: '${generalRow['Tipo de Solicitud:']}'` : ' — columna vacía')
    );
  }

  const id_origen_recurso = parseOrigen(generalRow['Origen de Recurso']);
  if (!id_origen_recurso) errores.push(`Origen de recurso '${generalRow['Origen de Recurso']}' no reconocido`);

  const depNombre = ns(generalRow['Dependencia'])?.toUpperCase();
  let id_dependencia: number | null = null;
  if (depNombre) {
    id_dependencia = cats.depMap.get(depNombre) ?? null;
    if (!id_dependencia) advertencias.push(`Dependencia '${generalRow['Dependencia']}' no encontrada en catálogo`);
  }

  const ccCodigo = parseCCCodigo(generalRow['Centro de Costo'])?.toUpperCase();
  let id_centro_costo: number | null = null;
  if (ccCodigo) {
    id_centro_costo = cats.ccMap.get(ccCodigo) ?? null;
    if (!id_centro_costo) advertencias.push(`Centro de Costo '${generalRow['Centro de Costo']}' (código: ${ccCodigo}) no encontrado`);
  }

  const capClave = parseClavePrefijo(generalRow['Capitulo'])?.toUpperCase();
  let id_capitulo: number | null = null;
  if (capClave) {
    id_capitulo = cats.capMap.get(capClave) ?? null;
    if (!id_capitulo) advertencias.push(`Capítulo '${generalRow['Capitulo']}' (clave: ${capClave}) no encontrado`);
  }

  const subClave = parseClavePrefijo(generalRow['Concepto del Gasto'])?.toUpperCase();
  let id_subcapitulo: number | null = null;
  if (subClave) {
    id_subcapitulo = cats.subMap.get(subClave) ?? null;
    if (!id_subcapitulo) advertencias.push(`Subcapítulo '${generalRow['Concepto del Gasto']}' (clave: ${subClave}) no encontrado`);
  }

  const pgClave = parseClavePrefijo(generalRow['Giro o Partida'])?.toUpperCase();
  let id_partida_generica: number | null = null;
  if (pgClave) {
    id_partida_generica = cats.pgMap.get(pgClave) ?? null;
    if (!id_partida_generica) advertencias.push(`Partida '${generalRow['Giro o Partida']}' (clave: ${pgClave}) no encontrada en catálogo de partidas genéricas`);
  }

  const estadoRaw = generalRow['Estado '] ?? generalRow['Estado'] ?? null;
  const estado_estudio_mercado = parseEstadoEM(estadoRaw, advertencias);

  // ── adq_estudio_mercado — de emSource (hoja EM o General) ────────────────
  const tipoContrRaw = ns(emSource['Tipo Contracion'])?.toUpperCase();
  let tipo_contratacion: string | null = null;
  if (tipoContrRaw) {
    if (['IRP', 'LPNP', 'CP'].includes(tipoContrRaw)) {
      tipo_contratacion = tipoContrRaw;
    } else {
      advertencias.push(`Tipo de contratación '${tipoContrRaw}' no está en catálogo (IRP/LPNP/CP)`);
    }
  }

  const emDatos = {
    tipo_contratacion,
    estatus_estudio:           ns(emSource['Estatus del Estudio de Mercado']),
    descripcion_bien_servicio: ns(emSource['Descripción del bien o servicio de acuerdo a la solicitud']),
    valor_estudio_mercado:     pn(emSource['Valor del Estudio de Mercado']),
    monto_sabys:               pn(emSource['Monto SABYS']),
    contratacion_plurianual:   parseSiNo(emSource['Contratacion Plurianual']) ? 'SI' : 'NO',
    monto_2026: pn(emSource['Monto 2026']),
    monto_2027: pn(emSource['Monto 2027']),
    monto_2028: pn(emSource['Monto 2028']),
    monto_2029: pn(emSource['Monto 2029']),
  };
  // Solo guardar EM si hay datos reales (distintos de null y del default 'NO')
  const tieneEM = Object.values(emDatos).some(v => v !== null && v !== 'NO');

  // ── adq_afectacion_presupuestal + adq_bienes_servicios — de apSource ──────
  let apDatos: any = null;
  let bsDatos: any = null;

  if (apSource) {
    const tipo_gasto = parseTipoGasto(apSource['Tipo de gasto:']);
    if (!tipo_gasto) {
      errores.push(`Tipo de gasto '${apSource['Tipo de gasto:']}' inválido — use PAD, GC o MIXTO`);
    } else {
      const fuenteCodigo = parseFuenteCodigo(apSource['Fuente de financiamiento:'])?.toUpperCase();
      let id_fuente_financiamiento: number | null = null;
      if (fuenteCodigo) {
        id_fuente_financiamiento = cats.fuenteMap.get(fuenteCodigo) ?? null;
        if (!id_fuente_financiamiento) advertencias.push(`Fuente de financiamiento '${apSource['Fuente de financiamiento:']}' (código: ${fuenteCodigo}) no encontrada`);
      }

      apDatos = {
        tipo_gasto,
        nombre_testigo_social:   ns(apSource['Nombre de Testigo Social (N/A,Nombre)']),
        id_fuente_financiamiento,
        importe_suficiencia:     pn(apSource['Importe de Suficiencia Presupuestal']),
        oficio_suficiencia_path: ns(apSource['Oficio de Suficiencia']),
      };

      bsDatos = {
        clave_verificacion:             ns(apSource['Clave de Verificación']),
        descripcion_clave_verificacion: ns(apSource['Descripción de la Clave de Verificación']),
        unidad_medida:                  ns(apSource['Unidad de Medida']),
        dictamen:         false,
        contrato_abierto: parseSiNo(apSource['¿Es contrato abierto?']),
        consolidado:      parseSiNo(apSource['¿Es consolidado?']),
      };
    }
  }

  // ── adq_procedimiento_adquisitivo — de adqSource + adjSource ─────────────
  let paDatos: any = null;

  const tieneAdq = !!(ns(adqSource?.['No. de procedimiento']) || ns(adqSource?.['Modalidad del Procedimiento Adquisitivo']));
  const tieneAdj = !!(ns(adjSource?.['Nombre o Razón Social']) || pn(adjSource?.['Monto Total Adjudicación con IVA']) || ns(adjSource?.['Numero de Contrato:']));

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
      modalidad:                 ns(adqSource?.['Modalidad del Procedimiento Adquisitivo']),
      dictamen_procedencia:      dictamen.activo,
      dictamen_procedencia_path: dictamen.path,
      responsable:               ns(adqSource?.['Responsable del Procedimiento']) ?? ns(adjSource?.['Nombre del Responsable del  Procedimiento']),
      no_procedimiento:          ns(adqSource?.['No. de procedimiento']),
      convocatoria_invitacion:   ns(adqSource?.['Convocatoria y/o Invitacion (URL)']),
      convocatoria_url:          ns(adqSource?.['Convocatoria y/o Invitacion (URL)']),
      medio_publicacion:         ns(adqSource?.['Medio de Publicación:']),

      fecha_junta_aclaracion:       pd(adqSource?.['Fecha de Junta de Aclaración:']),
      hora_junta_aclaracion:        pt(adqSource?.['Hora de Junta de Aclaración:']),
      fecha_presentacion_apertura:  pd(adqSource?.['Fecha de Presentación y Apertura de Proposiciones:']),
      hora_presentacion_apertura:   pt(adqSource?.['Hora de Presentación y Apertura de Proposiciones:']),
      fecha_sesion_comite_analisis: fechaSesionComite,
      hora_sesion_comite_analisis:  horaSesionComite,
      fecha_contraoferta:           pd(adqSource?.['Fecha de Contra Oferta:']),
      hora_contraoferta:            pt(adqSource?.['Hora de Contra Oferta:']),
      fecha_dictaminacion_comite:   pd(adqSource?.['Fecha de Dictaminación de Adjudicación del Comité:']),
      hora_dictaminacion_comite:    pt(adqSource?.['Hora de de Dictaminación de Adjudicación del Comité:']),
      fecha_sesion_subcomite:       pd(adqSource?.['Fecha Sesión del Subcomité Revisor de Convocatorias e Invitaciones']),
      hora_sesion_subcomite:        pt(adqSource?.['Hora Sesión del Subcomité Revisor de Convocatorias e Invitaciones']),
      fecha_fallo:                  pd(adqSource?.['Fecha de Fallo:']),
      hora_fallo:                   pt(adqSource?.['Hora de Fallo:']),

      proveedor_razon_social:             ns(adjSource?.['Nombre o Razón Social']),
      proveedor_rfc:                      ns(adjSource?.['RFC'])?.replace(/\s+/g, ''),
      monto_total_adjudicado_iva:         pn(adjSource?.['Monto Total Adjudicación con IVA']),
      no_contrato:                        ns(adjSource?.['Numero de Contrato:']),
      vigencia_inicio:                    pd(adjSource?.['Inicio de Vigencia:']),
      vigencia_termino:                   pd(adjSource?.['Termino de Vigencia:']),
      url_testimonio_testigo_social:      ns(adjSource?.['Publicación del Testimonio del Testigo Social:']),
      remanente_suficiencia_presupuestal: pn(adjSource?.['REMANENTE(Suf.Presupuestal']),
      estatus_adjudicacion:               ns(adjSource?.['Estatus']),
      comentarios_adjudicacion:           ns(adjSource?.['Comentarios']),
      // Reprogramacion solo existe en hoja Adjudicacion (no en General)
      existe_reprogramacion: adjRow?.['Reprogramacion'] != null ? parseSiNo(adjRow['Reprogramacion']) : null,
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
      em:  tieneEM ? emDatos : null,
      ap:  apDatos,
      bs:  bsDatos,
      pa:  paDatos,
    } : null,
  };
}

// ── Caché en memoria ──────────────────────────────────────────────────────────

interface EntradaCache {
  resultados: FilaResultado[];
  resumen: {
    total: number;
    validos: number;
    errores_count: number;
    advertencias_count: number;
    filas: object[];
  };
  expira: number;
}

const cache = new Map<string, EntradaCache>();
const CACHE_TTL_MS = 30 * 60 * 1000;

function limpiarExpirados(): void {
  const ahora = Date.now();
  for (const [key, entry] of cache) {
    if (entry.expira < ahora) cache.delete(key);
  }
}

// ── Validación multi-hoja ────────────────────────────────────────────────────

async function validarBuffer(buffer: Buffer): Promise<EntradaCache> {
  const wb = XLSX.read(buffer, { type: 'buffer', cellDates: true });

  // Hoja General es la única obligatoria — es la fuente maestra de todos los folios
  const hojaGeneral = wb.SheetNames.find(n => n.trim().toLowerCase() === 'general');
  if (!hojaGeneral) throw new Error('No se encontró la hoja "General" en el archivo');

  // Leer todas las hojas (las específicas son opcionales y complementan a General)
  const generalRows = leerHoja(wb, 'general');
  const emRows      = leerHoja(wb, 'estudio de mercado');
  const apRows      = leerHoja(wb, 'afectacion presupuestal');
  const adqRows     = leerHoja(wb, 'adquisiciones');
  const adjRows     = leerHoja(wb, 'adjudicacion');

  if (generalRows.length === 0) {
    return {
      resultados: [],
      resumen: { total: 0, validos: 0, errores_count: 0, advertencias_count: 0, filas: [] },
      expira: Date.now() + CACHE_TTL_MS,
    };
  }

  // Mapas por folio — para cruzar con hojas específicas cuando existan
  const emMap  = porFolio(emRows,  'Folio Interno de Solicitud');
  const apMap  = porFolio(apRows,  'Folio Interno(Seguimiento)');
  const adqMap = porFolio(adqRows, 'Folio Interno (Seguimiento)');
  const adjMap = porFolio(adjRows, 'Folio Interno (Seguimiento)');

  const cats = await cargarCatalogos();
  const foliosEnArchivo = new Set<string>();
  const resultados: FilaResultado[] = [];

  // Loop maestro sobre General: garantiza que TODOS los folios sean importados
  for (let i = 0; i < generalRows.length; i++) {
    const folio = ns(generalRows[i]['Folio Interno de Solicitud']);
    if (!folio) {
      resultados.push({
        fila: i + 4, folio: '', errores: ['Folio Interno vacío'], advertencias: [], datos: null,
      });
      continue;
    }

    const resultado = procesarRegistro(
      folio, i + 4,
      generalRows[i],              // fuente maestra
      emMap.get(folio)  ?? null,   // complementa si existe en hoja EM
      apMap.get(folio)  ?? null,   // complementa si existe en hoja AP
      adqMap.get(folio) ?? null,   // complementa si existe en hoja Adq
      adjMap.get(folio) ?? null,   // complementa si existe en hoja Adj
      cats,
      foliosEnArchivo,
    );

    foliosEnArchivo.add(folio);
    resultados.push(resultado);
  }

  const validas  = resultados.filter(r => r.errores.length === 0);
  const conError = resultados.filter(r => r.errores.length > 0);

  const resumen = {
    total:              resultados.length,
    validos:            validas.length,
    errores_count:      conError.length,
    advertencias_count: resultados.filter(r => r.advertencias.length > 0).length,
    filas: resultados.map(r => ({
      fila:         r.fila,
      folio:        r.folio,
      estado:       r.errores.length > 0 ? 'error' : r.advertencias.length > 0 ? 'advertencia' : 'ok',
      errores:      r.errores,
      advertencias: r.advertencias,
    })),
  };

  return { resultados, resumen, expira: Date.now() + CACHE_TTL_MS };
}

// ── Inserción desde caché ────────────────────────────────────────────────────

async function insertarDesdeCache(token: string): Promise<{ importados: number; omitidos: number; filas: object[] }> {
  const entrada = cache.get(token);
  if (!entrada) throw new Error('TOKEN_EXPIRADO');

  cache.delete(token);

  const validas = entrada.resultados.filter(r => r.errores.length === 0);
  let importados = 0;

  if (validas.length > 0) {
    const t = await sequelize.transaction();
    try {
      for (const r of validas) {
        const sol = await AdqSolicitudes.create(
          { ...r.datos.solicitud, user_id: null },
          { transaction: t }
        );
        const idSolicitud = sol.getDataValue('id_solicitud');

        // Estudio de Mercado — solo si hay datos reales en la hoja EM o en General
        if (r.datos.em) {
          await AdqEstudioMercado.create(
            { ...r.datos.em, id_solicitud: idSolicitud, created_by: SYSTEM_USER },
            { transaction: t }
          );
        }

        // Afectación Presupuestal (solo si existe en el Excel)
        if (r.datos.ap) {
          await AdqAfectacionPresupuestal.create(
            { ...r.datos.ap, id_solicitud: idSolicitud, created_by: SYSTEM_USER },
            { transaction: t }
          );
        }

        // Bienes y Servicios (solo si existe en la hoja AP)
        if (r.datos.bs) {
          await AdqBienesServicios.create(
            { ...r.datos.bs, id_solicitud: idSolicitud, created_by: SYSTEM_USER },
            { transaction: t }
          );
        }

        // Procedimiento Adquisitivo (solo si tiene datos de Adquisiciones o Adjudicación)
        if (r.datos.pa) {
          await AdqProcedimientoAdquisitivo.create(
            { ...r.datos.pa, id_solicitud: idSolicitud, created_by: SYSTEM_USER },
            { transaction: t }
          );
        }

        importados++;
      }
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  const omitidos = entrada.resumen.errores_count;
  const filasConError = entrada.resumen.filas.filter((f: any) => f.estado === 'error');

  return { importados, omitidos, filas: filasConError };
}

// ── Handlers HTTP ─────────────────────────────────────────────────────────────

export const validarExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    limpiarExpirados();
    if (!req.file) {
      res.status(400).json({ ok: false, msg: 'No se recibió ningún archivo' });
      return;
    }
    const entrada = await validarBuffer(req.file.buffer);
    const token   = uuidv4();
    cache.set(token, entrada);
    res.json({ ok: true, token, ...entrada.resumen });
  } catch (err: any) {
    console.error('ERROR validarExcel =>', err);
    res.status(500).json({ ok: false, msg: err.message ?? 'Error al procesar el archivo Excel' });
  }
};

export const importarExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    limpiarExpirados();
    const token = req.body?.token as string | undefined;
    if (!token) {
      res.status(400).json({ ok: false, msg: 'Token de validación no proporcionado' });
      return;
    }
    if (!cache.has(token)) {
      res.status(410).json({ ok: false, msg: 'La sesión de validación expiró o ya fue utilizada. Vuelve a validar el archivo.' });
      return;
    }
    const resultado = await insertarDesdeCache(token);
    res.json({ ok: true, ...resultado });
  } catch (err: any) {
    console.error('ERROR importarExcel =>', err);
    res.status(500).json({ ok: false, msg: err.message ?? 'Error al importar los datos' });
  }
};
