import AdqDependencias from '../models/AdqDependencias';
import AdqCentrosCosto from '../models/AdqCentrosCosto';
import AdqOrganismosOPDS from '../models/AdqOrganismosOPDS';
import AdqCatCapitulos from '../models/AdqCatCapitulos';
import AdqCatPartidasGenericas from '../models/AdqCatPartidasGenericas';
import AdqCatPartidasEspecificas from '../models/AdqCatPartidasEspecificas';
import { Request, Response } from 'express';
import { fn, col } from 'sequelize';
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
function getOrigenRecursoNombre(id: number): string {
  switch (Number(id)) {
    case 1: return 'Estatal';
    case 2: return 'Federal';
    case 3: return 'Fideicomiso';
    case 4: return 'Concurrente o Propio';
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
    
  } catch (error) {
    console.log('ERROR EN saveRegistro:', error);

    return res.status(500).json({
      msg: 'Ocurrió un error al cargar',
      error
    });
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
export const createEstudioMercado = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log('BODY ESTUDIO MERCADO =>', req.body);

    const { id_solicitud } = req.body;

    if (!id_solicitud) {
      return res.status(400).json({
        ok: false,
        msg: 'Falta id_solicitud'
      });
    }

    await AdqSolicitudes.update(
      {
        estatus_id: 2
      },
      {
        where: {
          id_solicitud: id_solicitud
        }
      }
    );

    const actualizada = await AdqSolicitudes.findByPk(id_solicitud);

      console.log('SOLICITUD ACTUALIZADA =>', actualizada?.toJSON());

    return res.status(200).json({
      ok: true,
      msg: 'Estudio de mercado guardado correctamente',
      data: req.body
    });

  } catch (error) {
    console.error('ERROR ESTUDIO MERCADO =>', error);

    return res.status(500).json({
      ok: false,
      msg: 'Error al guardar estudio de mercado'
    });
  }
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
    const [solicitud, proc] = await Promise.all([
      AdqSolicitudes.findByPk(id),
      AdqProcedimientoAdquisitivo.findOne({ where: { id_solicitud: id } }),
    ]);

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

    return res.json({ ok: true, data: { solicitud, procedimiento } });
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
  } catch (error) {
    console.error('ERROR saveProcedimientoAdquisitivo =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al guardar procedimiento adquisitivo' });
  }
};

export const getKpis = async (_req: Request, res: Response): Promise<any> => {
  try {
    const filas = await AdqSolicitudes.findAll({
      attributes: ['estatus_id', [fn('COUNT', col('id_solicitud')), 'total']],
      group: ['estatus_id'],
      raw: true,
    });

    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filas.forEach((f: any) => { counts[Number(f.estatus_id)] = Number(f.total); });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    return res.json({
      ok: true,
      data: {
        total,
        registradas:  counts[1],
        estudio:      counts[2] + counts[3] + counts[4] + counts[5],
        afectacion:   counts[3] + counts[4] + counts[5],
        contratacion: counts[4] + counts[5],
        adjudicacion: counts[5],
      },
    });
  } catch (error) {
    console.error('ERROR getKpis =>', error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener KPIs' });
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