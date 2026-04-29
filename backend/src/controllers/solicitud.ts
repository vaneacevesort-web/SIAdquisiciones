import { Request, Response } from 'express';
import Solicitudes from '../models/solicitud';
import User from '../models/user';
import RolUsers from '../models/role_users';
import ValidadorSolicitud from '../models/validadorsolicitud';
import dotenv from 'dotenv';
import AdqSolicitudes from '../models/AdqSolicitudes';

dotenv.config();

export const getRegistros = async (req: Request, res: Response): Promise<any> => {
  const listSolicitudes = await AdqSolicitudes.findAll();

  return res.json({
    msg: 'Lista obtenida exitosamente',
    data: listSolicitudes
  });
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

    return res.json({
      msg: 'Agregado con éxito',
      data: solicitud
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