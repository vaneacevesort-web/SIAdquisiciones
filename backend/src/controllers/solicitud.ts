import AdqDependencias from '../models/AdqDependencias';
import AdqCentrosCosto from '../models/AdqCentrosCosto';
import AdqOrganismosOPDS from '../models/AdqOrganismosOPDS';
import AdqCatCapitulos from '../models/AdqCatCapitulos';
import AdqCatSubcapitulos from '../models/AdqCatSubcapitulos';
import AdqCatPartidasGenericas from '../models/AdqCatPartidasGenericas';
import AdqCatPartidasEspecificas from '../models/AdqCatPartidasEspecificas';
import { Request, Response } from 'express';
import { fn, col, Op, literal } from 'sequelize';
import Solicitudes from '../models/solicitud';
import User from '../models/user';
import RolUsers from '../models/role_users';
import ValidadorSolicitud from '../models/validadorsolicitud';
import dotenv from 'dotenv';
import AdqSolicitudes from '../models/AdqSolicitudes';
import AdqAfectacionPresupuestal from '../models/AdqAfectacionPresupuestal';
import AdqBienesServicios from '../models/AdqBienesServicios';
import AdqAfectacionFuentes from '../models/AdqAfectacionFuentes';
import AdqProcedimientoAdquisitivo from '../models/AdqProcedimientoAdquisitivo';
import AdqEstudioMercado from '../models/AdqEstudioMercado';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

dotenv.config();

export const getRegistros = async (req: Request, res: Response): Promise<any> => {
  try {
    const listSolicitudes: any[] = await AdqSolicitudes.findAll({
      order: [['id_solicitud', 'ASC']]
    });

    const data = await Promise.all(
      listSolicitudes.map(async (solicitud: any) => {
        const item = solicitud.toJSON();

        const dependencia: any = item.id_dependencia
          ? await AdqDependencias.findByPk(item.id_dependencia)
          : null;

        const centroCosto: any = item.id_centro_costo
          ? await AdqCentrosCosto.findByPk(item.id_centro_costo)
          : null;

        const opd: any = item.id_opd
          ? await AdqOrganismosOPDS.findByPk(item.id_opd)
          : null;

        const capitulo: any = item.id_capitulo
          ? await AdqCatCapitulos.findByPk(item.id_capitulo)
          : null;

        const partidaGenerica: any = item.id_partida_generica
          ? await AdqCatPartidasGenericas.findByPk(item.id_partida_generica)
          : null;

        const partidaEspecifica: any = item.id_partida_especifica
          ? await AdqCatPartidasEspecificas.findByPk(item.id_partida_especifica)
          : null;

        return {
          ...item,

          origen_recurso_nombre: getOrigenRecursoNombre(item.id_origen_recurso),

          dependencia_nombre: dependencia?.getDataValue('nombre') || '',

          centro_costo_nombre: centroCosto
            ? `${centroCosto.getDataValue('codigo')} - ${centroCosto.getDataValue('nombre')}`
            : '',

          opd_nombre: opd
            ? `${opd.getDataValue('codigo')} - ${opd.getDataValue('nombre')}`
            : '',

          capitulo_nombre: capitulo
            ? `${capitulo.getDataValue('codigo')} - ${capitulo.getDataValue('nombre')}`
            : '',

          partida_generica_nombre: partidaGenerica
            ? `${partidaGenerica.getDataValue('codigo')} - ${partidaGenerica.getDataValue('nombre')}`
            : '',

          partida_especifica_nombre: partidaEspecifica
            ? `${partidaEspecifica.getDataValue('codigo')} - ${partidaEspecifica.getDataValue('nombre')}`
            : '',
        };
      })
    );

    return res.json({
      msg: 'Lista obtenida exitosamente',
      data
    });

  } catch (error: any) {
    console.error('ERROR REAL AL CREAR SOLICITUD =>', error);

     if (error.name=== 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      msg: 'El folio ya existe. Captura un folio diferente.'
    });
  }

    return res.status(500).json({
      msg: 'Error al crear la solicitud',
      error: error.message
    });
  }
};

      export const getRegistro = async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;

        const solicitud = await AdqSolicitudes.findByPk(id);

        if (solicitud) {
          return res.json(solicitud);
        }

        return res.status(404).json({
          msg: `No existe el id ${id}`,
        });
      };

export const deleteRegistro = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  const solicitud = await AdqSolicitudes.findByPk(id);

  if (solicitud) {
    await solicitud.destroy();

    return res.json({
      msg: 'Eliminado con éxito',
    });
  }

  return res.status(404).json({
    msg: `No existe el id ${id}`,
  });
};
function safeId(val: any): number | null {
  const n = parseInt(val, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function getOrigenRecursoNombre(id: number): string {
  switch (Number(id)) {
    case 1: return 'Estatal';
    case 2: return 'Federal';
    case 3: return 'Fideicomiso';
    case 4: return 'Concurrente';
    case 5: return 'Propio';
    default: return '';
  }
}

export const saveRegistro = async (req: Request, res: Response): Promise<any> => {
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

      const solicitud = await AdqSolicitudes.create({
      folio: folio,
      fecha_ingreso: fechaIngreso,
      id_origen_recurso: Number(origenRecurso),
      tipo_solicitud: body.tipo_solicitud || 'BIEN',

      id_dependencia:           safeId(body.id_dependencia),
      id_opd:                   safeId(body.id_opd),
      id_organo_desconcentrado: safeId(body.id_organo_desconcentrado),
      id_centro_costo:          safeId(body.id_centro_costo),

      id_capitulo:              safeId(body.id_capitulo),
      id_subcapitulo:           safeId(body.id_subcapitulo),
      id_partida_generica:      safeId(body.id_partida_generica),
      id_partida_especifica:    safeId(body.id_partida_especifica),

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
    
  } catch (error: any) {
    if (
      error.name === 'SequelizeUniqueConstraintError' ||
      error.original?.code === 'ER_DUP_ENTRY'
    ) {
      return res.status(409).json({
        ok: false,
        code: 'FOLIO_DUPLICADO',
        msg: 'El folio interno ya existe. Ingresa un folio diferente.',
      });
    }

    console.error('ERROR EN saveRegistro:', error);
    return res.status(500).json({ ok: false, msg: 'Ocurrió un error al guardar la solicitud.' });
  }
};

export const putRegistro = async (req: Request, res: Response): Promise<any> => {
  return res.status(404).json({
    msg: 'put',
  });
};

export const getSolicitudes = async (req: Request, res: Response): Promise<any> => {
  const { id, usuario } = req.body;

  const user: any = await User.findOne({
    where: { id: usuario },
    include: [
      {
        model: RolUsers,
        as: 'rol_users',
      }
    ]
  });

  const roleId = user?.rol_users?.role_id;

  let listSolicitudes: any[] = [];

  if (user && roleId == 1) {
    if (id == 5) {
      listSolicitudes = await Solicitudes.findAll({
        where: {
          estatusId: [1, 2]
        } as any
      });
    } else {
      listSolicitudes = await Solicitudes.findAll({
        where: {
          estatusId: id
        } as any
      });
    }
  } else {
    listSolicitudes = await Solicitudes.findAll({
      where: {
        estatusId: id,
      } as any,
      include: [
        {
          model: ValidadorSolicitud,
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
};

export const getestatus = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  const solicitud: any = await Solicitudes.findOne({
    where: {
      userId: id
    } as any
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
};
export const getEstudioMercadoById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const estudio = await AdqEstudioMercado.findOne({ where: { id_solicitud: id } });
    return res.json({ ok: true, data: { estudio: estudio ?? null } });
  } catch (error) {
    console.error('ERROR getEstudioMercadoById =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener estudio de mercado' });
  }
};

export const createEstudioMercado = async (req: Request, res: Response): Promise<any> => {
  const {
    id_solicitud,
    estado_estudio_mercado,
    tipo_contratacion,
    descripcion_bien_servicio,
    valor_estudio_mercado,
    monto_sabys,
    contratacion_plurianual,
    monto_2026, monto_2027, monto_2028, monto_2029,
  } = req.body;

  if (!id_solicitud) {
    return res.status(400).json({ ok: false, msg: 'Falta id_solicitud' });
  }

  // ── 1. Avanza estatus (esta columna siempre existe) ───────────────────────
  try {
    await AdqSolicitudes.update({ estatus_id: 2 }, { where: { id_solicitud } });
  } catch (e: any) {
    console.error('[EM] Error al actualizar estatus_id:', e?.message);
    return res.status(500).json({ ok: false, msg: 'Error al actualizar estatus de la solicitud.', detail: e?.message });
  }

  // ── 2. Actualiza semáforo en adq_solicitudes (columna puede no existir aún) ─
  if (estado_estudio_mercado) {
    try {
      await AdqSolicitudes.update({ estado_estudio_mercado }, { where: { id_solicitud } });
    } catch (e: any) {
      console.warn('[EM] estado_estudio_mercado no guardado (¿ejecutaste add_estado_estudio_mercado.sql?):', e?.message);
    }
  }

  // ── 3. Upsert en adq_estudio_mercado ─────────────────────────────────────
  const n = (v: any) => (v != null && v !== '' ? Number(v) : null);
  const estudioData = {
    tipo_contratacion:         tipo_contratacion         || null,
    descripcion_bien_servicio: descripcion_bien_servicio || null,
    valor_estudio_mercado:     n(valor_estudio_mercado),
    estatus_estudio:           estado_estudio_mercado    || null,
    monto_sabys:               n(monto_sabys),
    contratacion_plurianual:   contratacion_plurianual   || null,
    monto_2026:                n(monto_2026),
    monto_2027:                n(monto_2027),
    monto_2028:                n(monto_2028),
    monto_2029:                n(monto_2029),
  };

  try {
    const existente = await AdqEstudioMercado.findOne({ where: { id_solicitud } });
    if (existente) {
      await existente.update(estudioData);
    } else {
      await AdqEstudioMercado.create({ id_solicitud: Number(id_solicitud), ...estudioData });
    }
  } catch (e: any) {
    console.error('[EM] Error en adq_estudio_mercado:', e?.message);
    const msg = (e?.message ?? '').toLowerCase();
    if (msg.includes("doesn't exist") || msg.includes('no existe')) {
      return res.status(500).json({ ok: false, msg: 'La tabla adq_estudio_mercado no existe. Ejecuta alter_adq_estudio_mercado.sql.', detail: e?.message });
    }
    if (msg.includes("unknown column") || msg.includes("doesn't have a default")) {
      return res.status(500).json({ ok: false, msg: 'Faltan columnas en adq_estudio_mercado. Ejecuta alter_adq_estudio_mercado.sql.', detail: e?.message });
    }
    return res.status(500).json({ ok: false, msg: 'Error al guardar estudio de mercado.', detail: e?.message });
  }

  return res.status(200).json({ ok: true, msg: 'Estudio de mercado guardado correctamente' });
};

export const getAfectacionById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const [afectacion, bienesServicios] = await Promise.all([
      AdqAfectacionPresupuestal.findOne({ where: { id_solicitud: id } }),
      AdqBienesServicios.findOne({ where: { id_solicitud: id } }),
    ]);

    let fuentes_financiamiento: number[] = [];
    if (afectacion) {
      const filas = await AdqAfectacionFuentes.findAll({
        where: { id_afectacion: afectacion.id_afectacion },
      });
      fuentes_financiamiento = filas.map(f => f.id_fuente_financiamiento);
    }

    return res.json({
      ok: true,
      data: {
        afectacion: afectacion ? { ...afectacion.toJSON(), fuentes_financiamiento } : null,
        bienesServicios: bienesServicios ?? null,
      },
    });
  } catch (error) {
    console.error('ERROR getAfectacionById =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener datos de afectación' });
  }
};

export const saveAfectacionPresupuestal = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { afectacion, bienesServicios } = req.body;

    const idSolicitud = Number(id);

    const existeAfectacion = await AdqAfectacionPresupuestal.findOne({ where: { id_solicitud: idSolicitud } });

    const fuentes: number[] = afectacion.fuentes_financiamiento ?? [];

    let registroAfectacion: AdqAfectacionPresupuestal;

    if (existeAfectacion) {
      await existeAfectacion.update({
        nombre_testigo_social: afectacion.nombre_testigo_social ?? null,
        tipo_gasto: afectacion.tipo_gasto,
        importe_suficiencia: afectacion.importe_suficiencia ?? null,
        updated_by: afectacion.user_id ?? null,
      });
      registroAfectacion = existeAfectacion;
    } else {
      registroAfectacion = await AdqAfectacionPresupuestal.create({
        id_solicitud: idSolicitud,
        nombre_testigo_social: afectacion.nombre_testigo_social ?? null,
        tipo_gasto: afectacion.tipo_gasto,
        importe_suficiencia: afectacion.importe_suficiencia ?? null,
        created_by: afectacion.user_id ?? '00000000-0000-0000-0000-000000000000',
      });
    }

    // Reemplaza todas las fuentes: borra las anteriores e inserta las nuevas
    await AdqAfectacionFuentes.destroy({ where: { id_afectacion: registroAfectacion.id_afectacion } });
    if (fuentes.length > 0) {
      await AdqAfectacionFuentes.bulkCreate(
        fuentes.map(id_fuente => ({
          id_afectacion: registroAfectacion.id_afectacion,
          id_fuente_financiamiento: id_fuente,
        }))
      );
    }

    if (bienesServicios) {
      const existeBS = await AdqBienesServicios.findOne({ where: { id_solicitud: idSolicitud } });

      if (existeBS) {
        await existeBS.update({
          clave_verificacion: bienesServicios.clave_verificacion ?? null,
          descripcion_clave_verificacion: bienesServicios.descripcion_clave_verificacion ?? null,
          unidad_medida: bienesServicios.unidad_medida ?? null,
          dictamen: bienesServicios.dictamen === 'SI',
          contrato_abierto: bienesServicios.contrato_abierto === 'SI',
          consolidado: bienesServicios.consolidado === 'SI',
          updated_by: afectacion.user_id ?? null,
        });
      } else {
        await AdqBienesServicios.create({
          id_solicitud: idSolicitud,
          clave_verificacion: bienesServicios.clave_verificacion ?? null,
          descripcion_clave_verificacion: bienesServicios.descripcion_clave_verificacion ?? null,
          unidad_medida: bienesServicios.unidad_medida ?? null,
          dictamen: bienesServicios.dictamen === 'SI',
          contrato_abierto: bienesServicios.contrato_abierto === 'SI',
          consolidado: bienesServicios.consolidado === 'SI',
          created_by: afectacion.user_id ?? '00000000-0000-0000-0000-000000000000',
        });
      }
    }

    await AdqSolicitudes.update({ estatus_id: 3 }, { where: { id_solicitud: idSolicitud } });

    return res.json({ ok: true, msg: 'Afectación presupuestal guardada correctamente' });
  } catch (error) {
    console.error('ERROR saveAfectacionPresupuestal =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al guardar afectación presupuestal' });
  }
};

export const getProcedimientoById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const [sol, proc] = await Promise.all([
      AdqSolicitudes.findByPk(id),
      AdqProcedimientoAdquisitivo.findOne({ where: { id_solicitud: id } }),
    ]);

    // Lookups de catálogos en paralelo para mostrar nombres en la vista
    const item = sol ? sol.toJSON() as any : null;
    if (item) {
      const [dep, cc, opd, cap, sub, pg, pe] = await Promise.all([
        item.id_dependencia       ? AdqDependencias.findByPk(item.id_dependencia)             : Promise.resolve(null),
        item.id_centro_costo      ? AdqCentrosCosto.findByPk(item.id_centro_costo)            : Promise.resolve(null),
        item.id_opd               ? AdqOrganismosOPDS.findByPk(item.id_opd)                  : Promise.resolve(null),
        item.id_capitulo          ? AdqCatCapitulos.findByPk(item.id_capitulo)                : Promise.resolve(null),
        item.id_subcapitulo       ? AdqCatSubcapitulos.findByPk(item.id_subcapitulo)          : Promise.resolve(null),
        item.id_partida_generica  ? AdqCatPartidasGenericas.findByPk(item.id_partida_generica): Promise.resolve(null),
        item.id_partida_especifica? AdqCatPartidasEspecificas.findByPk(item.id_partida_especifica): Promise.resolve(null),
      ]);
      const n = (m: any, f = 'nombre') => m?.getDataValue(f) ?? null;
      const cn = (m: any) => m ? `${n(m,'codigo')} — ${n(m,'nombre')}` : null;
      item.dependencia_nombre          = n(dep);
      item.centro_costo_nombre         = cn(cc);
      item.opd_nombre                  = cn(opd);
      item.capitulo_nombre             = cn(cap);
      item.subcapitulo_nombre          = cn(sub);
      item.partida_generica_nombre     = cn(pg);
      item.partida_especifica_nombre   = cn(pe);
      item.origen_recurso_nombre       = getOrigenRecursoNombre(item.id_origen_recurso);
    }

    // Mapeo inverso: columnas BD → nombres del form
    const procedimiento = proc ? {
      ...proc.toJSON(),
      fecha_sesion_comite:  proc.fecha_sesion_comite_analisis,
      hora_sesion_comite:   proc.hora_sesion_comite_analisis,
      fecha_contra_oferta:  proc.fecha_contraoferta,
      hora_contra_oferta:   proc.hora_contraoferta,
      fecha_dictaminacion:  proc.fecha_dictaminacion_comite,
      hora_dictaminacion:   proc.hora_dictaminacion_comite,
      dictamen_procedencia: proc.dictamen_procedencia === true ? 'SI' : (proc.dictamen_procedencia === false ? 'NO' : null),
    } : null;

    return res.json({ ok: true, data: { solicitud: item, procedimiento } });
  } catch (error) {
    console.error('ERROR getProcedimientoById =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener procedimiento' });
  }
};

export const saveProcedimientoAdquisitivo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { user_id, ...c } = req.body;
    const idSolicitud = Number(id);

    // Mapeo: nombres del form → nombres reales de columna en la BD
    const camposGuardar = {
      modalidad:                    c.modalidad                    ?? null,
      responsable:                  c.responsable                  ?? null,
      no_procedimiento:             c.no_procedimiento             ?? null,
      dictamen_procedencia:         c.dictamen_procedencia === 'SI' ? true : (c.dictamen_procedencia === 'NO' ? false : null),
      convocatoria_url:             c.convocatoria_url             ?? null,
      medio_publicacion:            c.medio_publicacion            ?? null,
      fecha_junta_aclaracion:       c.fecha_junta_aclaracion       ?? null,
      hora_junta_aclaracion:        c.hora_junta_aclaracion        ?? null,
      fecha_presentacion_apertura:  c.fecha_presentacion_apertura  ?? null,
      hora_presentacion_apertura:   c.hora_presentacion_apertura   ?? null,
      fecha_sesion_comite_analisis: c.fecha_sesion_comite          ?? null,   // form → BD
      hora_sesion_comite_analisis:  c.hora_sesion_comite           ?? null,
      fecha_contraoferta:           c.fecha_contra_oferta          ?? null,   // form → BD
      hora_contraoferta:            c.hora_contra_oferta           ?? null,
      fecha_dictaminacion_comite:   c.fecha_dictaminacion          ?? null,   // form → BD
      hora_dictaminacion_comite:    c.hora_dictaminacion           ?? null,
      fecha_sesion_subcomite:       c.fecha_sesion_subcomite       ?? null,
      hora_sesion_subcomite:        c.hora_sesion_subcomite        ?? null,
      fecha_fallo:                  c.fecha_fallo                  ?? null,
      hora_fallo:                   c.hora_fallo                   ?? null,
    };

    const existe = await AdqProcedimientoAdquisitivo.findOne({ where: { id_solicitud: idSolicitud } });

    if (existe) {
      await existe.update({ ...camposGuardar, updated_by: user_id ?? null });
    } else {
      await AdqProcedimientoAdquisitivo.create({
        id_solicitud: idSolicitud,
        ...camposGuardar,
        created_by: user_id ?? '00000000-0000-0000-0000-000000000000',
      });
    }

    // Avanzar a estatus 4 (Adquisición o Contratación)
    await AdqSolicitudes.update({ estatus_id: 4 }, { where: { id_solicitud: idSolicitud } });

    return res.json({ ok: true, msg: 'Procedimiento adquisitivo guardado correctamente' });
  } catch (error: any) {
    console.error('ERROR saveProcedimientoAdquisitivo =>', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al guardar procedimiento adquisitivo',
      detail: error?.message ?? String(error),
    });
  }
};

export const getAdjudicacionById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const [solicitud, proc] = await Promise.all([
      AdqSolicitudes.findByPk(id),
      AdqProcedimientoAdquisitivo.findOne({ where: { id_solicitud: id } }),
    ]);
    return res.json({ ok: true, data: { solicitud, procedimiento: proc ?? null } });
  } catch (error) {
    console.error('ERROR getAdjudicacionById =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener adjudicación' });
  }
};

export const saveAdjudicacion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { user_id, ...c } = req.body;
    const idSolicitud = Number(id);

    const campos = {
      no_procedimiento:                    c.no_procedimiento                    ?? null,
      proveedor_razon_social:              c.proveedor_razon_social              ?? null,
      proveedor_rfc:                       c.proveedor_rfc                       ?? null,
      monto_total_adjudicado_iva:          c.monto_total_adjudicado_iva          ? Number(c.monto_total_adjudicado_iva) : null,
      no_contrato:                         c.no_contrato                         ?? null,
      vigencia_inicio:                     c.vigencia_inicio                     ?? null,
      vigencia_termino:                    c.vigencia_termino                    ?? null,
      url_testimonio_testigo_social:       c.url_testimonio_testigo_social       ?? null,
      remanente_suficiencia_presupuestal:  c.remanente_suficiencia_presupuestal  ? Number(c.remanente_suficiencia_presupuestal) : null,
      responsable:                         c.responsable                         ?? null,
      estatus_adjudicacion:                c.estatus_adjudicacion                ?? null,
      estatus_estudio_mercado_adj:         c.estatus_estudio_mercado_adj         ?? null,
      comentarios_adjudicacion:            c.comentarios_adjudicacion            ?? null,
      existe_reprogramacion:               c.existe_reprogramacion === 'SI' ? true : (c.existe_reprogramacion === 'NO' ? false : null),
      fecha_junta_aclaracion:              c.existe_reprogramacion === 'SI' ? (c.fecha_junta_aclaracion       ?? null) : null,
      hora_junta_aclaracion:               c.existe_reprogramacion === 'SI' ? (c.hora_junta_aclaracion        ?? null) : null,
      fecha_presentacion_apertura:         c.existe_reprogramacion === 'SI' ? (c.fecha_presentacion_apertura  ?? null) : null,
      hora_presentacion_apertura:          c.existe_reprogramacion === 'SI' ? (c.hora_presentacion_apertura   ?? null) : null,
      fecha_fallo:                         c.existe_reprogramacion === 'SI' ? (c.fecha_fallo                  ?? null) : null,
      hora_fallo:                          c.existe_reprogramacion === 'SI' ? (c.hora_fallo                   ?? null) : null,
    };

    const existe = await AdqProcedimientoAdquisitivo.findOne({ where: { id_solicitud: idSolicitud } });

    if (existe) {
      await existe.update({ ...campos, updated_by: user_id ?? null });
    } else {
      await AdqProcedimientoAdquisitivo.create({
        id_solicitud: idSolicitud,
        ...campos,
        created_by: user_id ?? '00000000-0000-0000-0000-000000000000',
      });
    }

    // Avanzar a estatus 5 (Adjudicación)
    await AdqSolicitudes.update({ estatus_id: 5 }, { where: { id_solicitud: idSolicitud } });

    return res.json({ ok: true, msg: 'Adjudicación guardada correctamente' });
  } catch (error: any) {
    console.error('ERROR saveAdjudicacion =>', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al guardar adjudicación',
      detail: error?.message ?? String(error),
    });
  }
};

export const getKpis = async (_req: Request, res: Response): Promise<any> => {
  try {
    // ── Conteo por etapa (estatus_id) ─────────────────────────────────────
    const estatusFilas = await AdqSolicitudes.findAll({
      attributes: ['estatus_id', [fn('COUNT', col('id_solicitud')), 'total']],
      group: ['estatus_id'],
      raw: true,
    });
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    estatusFilas.forEach((f: any) => { counts[Number(f.estatus_id)] = Number(f.total); });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    // ── Conteo por origen de recurso ──────────────────────────────────────
    const origenFilas = await AdqSolicitudes.findAll({
      attributes: ['id_origen_recurso', [fn('COUNT', col('id_solicitud')), 'total']],
      group: ['id_origen_recurso'],
      raw: true,
    });
    const origenes: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    origenFilas.forEach((f: any) => { origenes[Number(f.id_origen_recurso)] = Number(f.total); });

    // ── Contratos y monto adjudicado ──────────────────────────────────────
    const totalContratos = await AdqProcedimientoAdquisitivo.count({
      where: { no_contrato: { [Op.not]: null } },
    });
    const [montoRow]: any = await AdqProcedimientoAdquisitivo.findAll({
      attributes: [[fn('COALESCE', fn('SUM', col('monto_total_adjudicado_iva')), 0), 'monto']],
      raw: true,
    });
    const montoTotal = Number(montoRow?.monto ?? 0);

    return res.json({
      ok: true,
      data: {
        // por etapa
        total,
        registradas:  counts[1],
        estudio:      counts[2],
        afectacion:   counts[3],
        contratacion: counts[4],
        adjudicacion: counts[5],
        // por origen
        estatal:     origenes[1],
        federal:     origenes[2],
        fideicomiso: origenes[3],
        concurrente: origenes[4],
        propio:      origenes[5],
        // financiero
        total_contratos: totalContratos,
        monto_total:     montoTotal,
      },
    });
  } catch (error) {
    console.error('ERROR getKpis =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener KPIs' });
  }
};

export const getTopDependencias = async (_req: Request, res: Response): Promise<any> => {
  try {
    const seq = AdqSolicitudes.sequelize!;

    // Top 5 dependencias por número de solicitudes
    const [solRows]: any = await seq.query(`
      SELECT d.nombre, COUNT(s.id_solicitud) AS total
      FROM adq_solicitudes s
      JOIN adq_dependencias d ON d.id_dependencia = s.id_dependencia
      WHERE s.id_dependencia IS NOT NULL
      GROUP BY d.id_dependencia, d.nombre
      ORDER BY total DESC
      LIMIT 5
    `);

    // Top 5 dependencias por monto adjudicado
    const [montoRows]: any = await seq.query(`
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
        porSolicitudes: solRows.map((r: any) => ({
          nombre: r.nombre,
          total:  Number(r.total),
        })),
        porMonto: montoRows.map((r: any) => ({
          nombre:    r.nombre,
          monto:     Number(r.monto),
          contratos: Number(r.contratos),
        })),
      },
    });
  } catch (error) {
    console.error('ERROR getTopDependencias =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener top dependencias' });
  }
};

export const getEvolucionMensual = async (req: Request, res: Response): Promise<any> => {
  try {
    const anio = Number(req.query.anio) || new Date().getFullYear();
    const seq  = AdqSolicitudes.sequelize!;

    const [solRows]: any = await seq.query(`
      SELECT MONTH(fecha_ingreso) AS mes, COUNT(*) AS total
      FROM adq_solicitudes
      WHERE YEAR(fecha_ingreso) = :anio
      GROUP BY MONTH(fecha_ingreso)
      ORDER BY mes
    `, { replacements: { anio } });

    const [adjRows]: any = await seq.query(`
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

    const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

    // Construir arrays de 12 posiciones (índice 0 = enero)
    const solicitudesPorMes = Array(12).fill(0);
    const contratosPorMes   = Array(12).fill(0);
    const montoPorMes       = Array(12).fill(0);

    solRows.forEach((r: any)  => { solicitudesPorMes[Number(r.mes) - 1] = Number(r.total);     });
    adjRows.forEach((r: any)  => {
      contratosPorMes[Number(r.mes) - 1] = Number(r.contratos);
      montoPorMes[Number(r.mes) - 1]     = Number(r.monto);
    });

    return res.json({
      ok: true,
      data: {
        anio,
        categorias:   MESES,
        solicitudes:  solicitudesPorMes,
        contratos:    contratosPorMes,
        montos:       montoPorMes,
      },
    });
  } catch (error) {
    console.error('ERROR getEvolucionMensual =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener evolución mensual' });
  }
};

// ─── Helpers para exportación Excel ─────────────────────────────────────────

function getEstatusLabelExcel(estatus: number): string {
  switch (Number(estatus)) {
    case 1: return 'Registrada';
    case 2: return 'Estudio de Mercado';
    case 3: return 'Afectación Presupuestal';
    case 4: return 'Adquisición';
    case 5: return 'Adjudicación';
    default: return 'Desconocido';
  }
}

function calcularDiasExcel(fechaIngreso: string | null | undefined): number | null {
  if (!fechaIngreso) return null;
  const ingreso = new Date(fechaIngreso + 'T00:00:00');
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Math.floor((hoy.getTime() - ingreso.getTime()) / 86_400_000);
}

function calcularSemaforoExcel(solicitud: any): { label: string; estado: string; dias: number | null } {
  const dias = calcularDiasExcel(solicitud?.fecha_ingreso);
  if (!solicitud) return { label: 'En tiempo', estado: 'en-tiempo', dias: null };
  if (solicitud.estado_estudio_mercado === 'RECHAZADO') return { label: 'Rechazado', estado: 'rechazado', dias };
  if (Number(solicitud.estatus_id) === 5) return { label: 'Concluido', estado: 'concluido', dias };
  if (dias !== null && dias > 15) return { label: 'Atrasado', estado: 'atrasado', dias };
  return { label: 'En tiempo', estado: 'en-tiempo', dias };
}

function formatFechaExcel(fecha: string): string {
  if (!fecha) return '—';
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function applyBorder(cell: ExcelJS.Cell, color = 'CCCCCC'): void {
  const thin: ExcelJS.Border = { style: 'thin', color: { argb: color } };
  cell.border = { top: thin, bottom: thin, left: thin, right: thin };
}

export const exportarExcelGestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { busqueda, estatus } = req.query;

    // Obtener y enriquecer datos (igual que getRegistros)
    const listSolicitudes: any[] = await AdqSolicitudes.findAll({
      order: [['id_solicitud', 'ASC']]
    });

    let data: any[] = await Promise.all(
      listSolicitudes.map(async (solicitud: any) => {
        const item = solicitud.toJSON();
        const [dependencia, centroCosto, opd] = await Promise.all([
          item.id_dependencia  ? AdqDependencias.findByPk(item.id_dependencia)  : null,
          item.id_centro_costo ? AdqCentrosCosto.findByPk(item.id_centro_costo) : null,
          item.id_opd          ? AdqOrganismosOPDS.findByPk(item.id_opd)         : null,
        ]);
        return {
          ...item,
          origen_recurso_nombre: getOrigenRecursoNombre(item.id_origen_recurso),
          dependencia_nombre:    (dependencia as any)?.getDataValue('nombre') || '',
          opd_nombre:            opd
            ? `${(opd as any).getDataValue('codigo')} - ${(opd as any).getDataValue('nombre')}`
            : '',
        };
      })
    );

    // Aplicar filtros si los hay
    if (busqueda) {
      const texto = (busqueda as string).toLowerCase();
      data = data.filter((row: any) =>
        Object.values(row).some(v => v && v.toString().toLowerCase().includes(texto))
      );
    }
    if (estatus) {
      data = data.filter((row: any) => Number(row.estatus_id) === Number(estatus));
    }

    // ── Construir Excel ────────────────────────────────────────────────────
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SIAdquisiciones';
    workbook.created = new Date();

    const ws = workbook.addWorksheet('Gestión de Solicitudes', {
      pageSetup: {
        paperSize:   9,
        orientation: 'landscape',
        fitToPage:   true,
        fitToWidth:  1,
        fitToHeight: 0,
      },
    });

    const GUINDA   = '6B0F2A';
    const GUINDA_L = 'F7E6EA';
    const WHITE    = 'FFFFFF';
    const GRAY     = 'F4F4F4';
    const TEXT     = '2C2C2C';

    // Anchos de columna
    ws.getColumn(1).width = 5;
    ws.getColumn(2).width = 22;
    ws.getColumn(3).width = 16;
    ws.getColumn(4).width = 14;
    ws.getColumn(5).width = 38;
    ws.getColumn(6).width = 20;
    ws.getColumn(7).width = 24;
    ws.getColumn(8).width = 22;
    ws.getColumn(9).width = 16;

    // ── Fila 1: Logo + nombre institución ─────────────────────────────────
    ws.getRow(1).height = 40;
    ws.mergeCells('A1:A4');
    ws.mergeCells('B1:I1');

    const logoPath = path.join(__dirname, '../../src/assets/acusederegistro.png');
    if (fs.existsSync(logoPath)) {
      const imageId = workbook.addImage({ filename: logoPath, extension: 'png' });
      ws.addImage(imageId, {
        tl:  { col: 0, row: 0 } as any,
        ext: { width: 80, height: 80 },
      } as any);
    }

    const b1 = ws.getCell('B1');
    b1.value     = 'SISTEMA DE INFORMACIÓN DE ADQUISICIONES';
    b1.font      = { name: 'Calibri', size: 13, bold: true, color: { argb: GUINDA } };
    b1.alignment = { vertical: 'middle', horizontal: 'center' };
    b1.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: WHITE } };

    // ── Fila 2: Título principal ───────────────────────────────────────────
    ws.getRow(2).height = 30;
    ws.mergeCells('B2:I2');
    const b2 = ws.getCell('B2');
    b2.value     = 'Gestión de Solicitudes';
    b2.font      = { name: 'Calibri', size: 16, bold: true, color: { argb: WHITE } };
    b2.alignment = { vertical: 'middle', horizontal: 'center' };
    b2.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: GUINDA } };

    // ── Fila 3: Subtítulo ──────────────────────────────────────────────────
    ws.getRow(3).height = 20;
    ws.mergeCells('B3:I3');
    const b3 = ws.getCell('B3');
    b3.value     = 'Vista centralizada de todas las etapas del proceso adquisitivo';
    b3.font      = { name: 'Calibri', size: 11, italic: true, color: { argb: GUINDA } };
    b3.alignment = { vertical: 'middle', horizontal: 'center' };
    b3.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: GUINDA_L } };

    // ── Fila 4: Fecha de generación + filtros ──────────────────────────────
    ws.getRow(4).height = 18;
    ws.mergeCells('B4:I4');
    const now      = new Date();
    const fechaStr = now.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    const horaStr  = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    let filtrosInfo = '';
    if (busqueda) filtrosInfo += `  |  Búsqueda: "${busqueda}"`;
    if (estatus)  filtrosInfo += `  |  Estatus: ${getEstatusLabelExcel(Number(estatus))}`;
    const b4 = ws.getCell('B4');
    b4.value     = `Generado: ${fechaStr} a las ${horaStr}${filtrosInfo}`;
    b4.font      = { name: 'Calibri', size: 9, color: { argb: '666666' } };
    b4.alignment = { vertical: 'middle', horizontal: 'right' };
    b4.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRAY } };

    ws.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: WHITE } };

    // ── Fila 5: Espaciador ────────────────────────────────────────────────
    ws.getRow(5).height = 6;
    ws.mergeCells('A5:I5');

    // ── Fila 6: Encabezados de tabla ──────────────────────────────────────
    ws.getRow(6).height = 22;
    const headers = [
      '#', 'Folio', 'Fecha Ingreso', 'Semáforo',
      'Dependencia / OPD', 'Origen del Recurso',
      'Estatus', 'Etapa Actual', 'Días Transcurridos',
    ];
    headers.forEach((h, i) => {
      const c = ws.getCell(6, i + 1);
      c.value     = h;
      c.font      = { name: 'Calibri', size: 11, bold: true, color: { argb: WHITE } };
      c.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: GUINDA } };
      c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
      applyBorder(c, '8B2040');
    });

    // ── Filas de datos ────────────────────────────────────────────────────
    const semColors: Record<string, string> = {
      'en-tiempo': '1B5E20',
      'atrasado':  'B71C1C',
      'rechazado': '424242',
      'concluido': '0D47A1',
    };

    data.forEach((row: any, idx: number) => {
      const rowNum = idx + 7;
      const rowBg  = idx % 2 === 1 ? GUINDA_L : WHITE;
      ws.getRow(rowNum).height = 18;

      const sem      = calcularSemaforoExcel(row);
      const diasText = sem.dias !== null ? `${sem.dias} d` : '—';
      const etapa    = getEstatusLabelExcel(Number(row.estatus_id));

      const values: (string | number)[] = [
        idx + 1,
        row.folio || '—',
        formatFechaExcel(row.fecha_ingreso),
        sem.label,
        row.dependencia_nombre || row.opd_nombre || '—',
        row.origen_recurso_nombre || '—',
        etapa,
        etapa,
        diasText,
      ];

      values.forEach((val, colIdx) => {
        const c = ws.getCell(rowNum, colIdx + 1);
        c.value     = val;
        c.font      = { name: 'Calibri', size: 10, color: { argb: TEXT } };
        c.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
        c.alignment = {
          vertical:   'middle',
          horizontal: colIdx === 0 || colIdx === 8 ? 'center' : 'left',
          wrapText:   colIdx === 4,
        };
        applyBorder(c);
      });

      // Color semáforo según estado
      const semCell = ws.getCell(rowNum, 4);
      semCell.font = {
        name: 'Calibri',
        size: 10,
        bold: true,
        color: { argb: semColors[sem.estado] ?? TEXT },
      };
    });

    // ── Fila de pie ───────────────────────────────────────────────────────
    const footerRow = data.length + 7;
    ws.getRow(footerRow).height = 14;
    ws.mergeCells(`A${footerRow}:I${footerRow}`);
    const fc = ws.getCell(`A${footerRow}`);
    fc.value     = `Total de registros: ${data.length}`;
    fc.font      = { name: 'Calibri', size: 9, bold: true, color: { argb: GUINDA } };
    fc.alignment = { horizontal: 'right', vertical: 'middle' };
    fc.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: GUINDA_L } };

    // ── Enviar respuesta ──────────────────────────────────────────────────
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="solicitudes_SIAdquisiciones.xlsx"');
    await workbook.xlsx.write(res);
    return res.end();

  } catch (error: any) {
    console.error('Error al exportar Excel:', error);
    return res.status(500).json({ msg: 'Error al generar el Excel', error: error.message });
  }
};

export const getSemaforo = async (_req: Request, res: Response): Promise<any> => {
  try {
    const seq   = AdqSolicitudes.sequelize!;
    const ahora = new Date();

    // Semáforo: solicitudes activas agrupadas por días desde ingreso
    const [semaforoRows]: any = await seq.query(`
      SELECT
        SUM(CASE WHEN DATEDIFF(NOW(), fecha_ingreso) > 60 THEN 1 ELSE 0 END) AS urgente,
        SUM(CASE WHEN DATEDIFF(NOW(), fecha_ingreso) BETWEEN 30 AND 60 THEN 1 ELSE 0 END) AS atencion,
        SUM(CASE WHEN DATEDIFF(NOW(), fecha_ingreso) < 30 THEN 1 ELSE 0 END) AS normal,
        COUNT(*) AS total_activas
      FROM adq_solicitudes
      WHERE estatus_id < 5
    `);

    // Monto total comprometido (todas las adjudicaciones)
    const [montoRow]: any = await seq.query(`
      SELECT COALESCE(SUM(monto_total_adjudicado_iva), 0) AS monto
      FROM adq_procedimiento_adquisitivo
    `);

    // Solicitudes nuevas este mes y el anterior
    const primerDiaMes = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2,'0')}-01`;
    const primerDiaMesAnt = ahora.getMonth() === 0
      ? `${ahora.getFullYear() - 1}-12-01`
      : `${ahora.getFullYear()}-${String(ahora.getMonth()).padStart(2,'0')}-01`;
    const ultimoDiaMesAnt = new Date(ahora.getFullYear(), ahora.getMonth(), 0)
      .toISOString().split('T')[0];

    const [esteMesRow]: any = await seq.query(`
      SELECT COUNT(*) AS total FROM adq_solicitudes
      WHERE fecha_ingreso >= :inicio
    `, { replacements: { inicio: primerDiaMes } });

    const [mesAntRow]: any = await seq.query(`
      SELECT COUNT(*) AS total FROM adq_solicitudes
      WHERE fecha_ingreso BETWEEN :inicio AND :fin
    `, { replacements: { inicio: primerDiaMesAnt, fin: ultimoDiaMesAnt } });

    const esteMes   = Number(esteMesRow[0]?.total   ?? 0);
    const mesAnt    = Number(mesAntRow[0]?.total     ?? 0);
    const pctCambio = mesAnt === 0 ? null : Math.round(((esteMes - mesAnt) / mesAnt) * 100);

    const s = semaforoRows[0] ?? {};

    return res.json({
      ok: true,
      data: {
        total_activas: Number(s.total_activas ?? 0),
        monto:         Number(montoRow[0]?.monto ?? 0),
        semaforo: {
          normal:   Number(s.normal   ?? 0),
          atencion: Number(s.atencion ?? 0),
          urgente:  Number(s.urgente  ?? 0),
        },
        comparativa: {
          este_mes:   esteMes,
          mes_anterior: mesAnt,
          pct_cambio:   pctCambio,
        },
      },
    });
  } catch (error) {
    console.error('ERROR getSemaforo =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener semáforo ejecutivo' });
  }
};

export const getActividadCalendario = async (req: Request, res: Response): Promise<any> => {
  try {
    const anio = Number(req.query.anio)  || new Date().getFullYear();
    const mes  = Number(req.query.mes)   || new Date().getMonth() + 1;

    const inicio = `${anio}-${String(mes).padStart(2, '0')}-01`;
    const fin    = new Date(anio, mes, 0).toISOString().split('T')[0];
    const seq    = AdqSolicitudes.sequelize!;

    const [solRows]: any = await seq.query(`
      SELECT DATE(fecha_ingreso) AS fecha, COUNT(*) AS total
      FROM adq_solicitudes
      WHERE DATE(fecha_ingreso) BETWEEN :inicio AND :fin
      GROUP BY DATE(fecha_ingreso)
    `, { replacements: { inicio, fin } });

    const [contratoRows]: any = await seq.query(`
      SELECT DATE(pa.created_at) AS fecha, COUNT(*) AS total
      FROM adq_procedimiento_adquisitivo pa
      WHERE pa.no_contrato IS NOT NULL
        AND DATE(pa.created_at) BETWEEN :inicio AND :fin
      GROUP BY DATE(pa.created_at)
    `, { replacements: { inicio, fin } });

    const [adjRows]: any = await seq.query(`
      SELECT DATE(s.fecha_ingreso) AS fecha, COUNT(*) AS total
      FROM adq_solicitudes s
      WHERE s.estatus_id = 5
        AND DATE(s.fecha_ingreso) BETWEEN :inicio AND :fin
      GROUP BY DATE(s.fecha_ingreso)
    `, { replacements: { inicio, fin } });

    return res.json({
      ok: true,
      data: {
        solicitudes:  solRows.map((r: any)       => ({ fecha: r.fecha, total: Number(r.total) })),
        contratos:    contratoRows.map((r: any)   => ({ fecha: r.fecha, total: Number(r.total) })),
        adjudicaciones: adjRows.map((r: any)      => ({ fecha: r.fecha, total: Number(r.total) })),
      },
    });
  } catch (error) {
    console.error('ERROR getActividadCalendario =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener actividad del calendario' });
  }
};

export const getSolicitudesCola = async (req: Request, res: Response): Promise<any> => {
  try {
    const { estatus } = req.params;
    const solicitudes = await AdqSolicitudes.findAll({
      where: { estatus_id: Number(estatus) },
      order: [['id_solicitud', 'DESC']],
    });
    return res.json({ ok: true, data: solicitudes });
  } catch (error) {
    console.error('ERROR getSolicitudesCola =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener la cola' });
  }
};


export const getSolicitudesAfectacion = async (req: Request, res: Response): Promise<any> => {
  try {

    const solicitudes = await AdqSolicitudes.findAll({
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

  } catch (error) {

    console.error('ERROR AL OBTENER AFECTACIÓN =>', error);

    return res.status(500).json({
      ok: false,
      msg: 'Error al obtener solicitudes de afectación presupuestal'
    });

  }
};

function generarHtmlCorreo(contenidoHtml: string): string {
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