import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import  Solicitudes   from '../models/solicitud'
import User  from '../models/user'
import RolUsers  from '../models/role_users'
const nodemailer = require('nodemailer');
import dotenv from "dotenv";
import ValidadorSolicitud from '../models/validadorsolicitud'
dotenv.config();
import { sendEmail } from '../utils/mailer';
const PDFDocument = require('pdfkit');
import jwt from 'jsonwebtoken';


export const getRegistros = async (req: Request, res: Response): Promise<any> => {
    const listSolicitudes = await Solicitudes.findAll()
    return res.json({
        msg: `List de exitosamente`,
        data: listSolicitudes
    });
}

export const getRegistro = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const solicitud = await Solicitudes.findByPk(id)

    if(solicitud){
      return res.json(solicitud)
      
    }else{
      return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
}

export const deleteRegistro = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const solicitud = await Solicitudes.findByPk(id)

    if(solicitud){
        await solicitud.destroy();
        return res.json({
            msg: `Eliminado con exito`,
        });
    }else{
      return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
}

export const saveRegistro = async (req: Request, res: Response): Promise<any> => {
  const { body } = req;

  function generateRandomPassword(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  const solicitud = await User.findOne({
    where: { email: body.correo }  
  });


  if (solicitud) {
  return res.status(400).json({
    estatus: 400,
    mensaje: 'Ya existe un registro con el mismo correo o cédula profesional',
    correo: solicitud?.email || null,
  });
}

  try {
    const Upassword = generateRandomPassword(12);
    const UpasswordHash = await bcrypt.hash(Upassword, 10);
    const newUser = await User.create({
      name: body.curp,
      email: body.correo,
      password: UpasswordHash,
      rol_users: {
        role_id: 3,  
      },
    }, {
      include: [{ model: RolUsers, as: 'rol_users' }],
    });

    const token = jwt.sign(
      {
        email: body.correo,
        userId: newUser.id,
      },
      process.env.JWT_SECRET || 'sUP3r_s3creT_ClavE-4321!', 
      { expiresIn: '2d' } 
    );
    const enlace = `https://dev5.siasaf.gob.mx/auth/cambiar-contrasena?token=${token}`;
      //  https://dev5.siasaf.gob.mx             
    body.userId = newUser.id;
    body.estatusId = 1;
    await Solicitudes.create(body);
    
    (async () => {
      try {
         const meses = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ];
         const hoy = new Date();
         const fechaFormateada = `Toluca de Lerdo, México; a ${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}.`;
        const contenido = `
           <div class="container">
            <p  class="pderecha" >${fechaFormateada}</p>
            <p>C. ${body.nombres} ${body.ap_paterno} ${body.ap_materno},</p>
            <p>Por este medio le informamos que su cuenta de usuario ha sido generada exitosamente para el proceso de registro. A continuación, se proporcionan sus credenciales de acceso:</p>
            <div class="credentials">
              <strong>Usuario:</strong> ${body.correo} <br>
            <strong>Contraseña:</strong> <a href="${enlace}">Establecer mi contraseña</a>
            </div>
            <p>Podrá iniciar su proceso de registro a través del siguiente enlace durante el periodo comprendido del <strong>27 junio al 03 de julio de 2025</strong>:</p>
            <a href="https://dev5.siasaf.gob.mx/auth/login" class="button" target="_blank">Iniciar registro</a>
            <p class="footer">
              Si tiene problemas para hacer clic en el botón, copie y pegue esta URL en su navegador:<br>
               ${enlace}
            </p>
            <p>Atentamente,<br><strong>Poder Legislativo del Estado de México</strong></p>
          </div>
        `;
        let htmlContent = generarHtmlCorreo(contenido);
        await sendEmail(
          body.correo,
          'Tus credenciales de acceso',
           htmlContent
        );

        console.log('Correo enviado correctamente');
      } catch (err) {
        console.error('Error al enviar correo:', err);
      }
    })();

    return res.json({ msg: `Agregado con éxito y correo enviado`, correo: body.correo } );

  } catch (error) {
    
    console.error(error);
    return res.status(500).json({ msg: `Ocurrió un error al registrar` });

  }

};

  export const putRegistro = async (req: Request, res: Response): Promise<any> => {
      return res.status(404).json({
          msg: 'put',
      });
      // try {
      //     await Solicitudes.create(body);
      //     res.json({
      //         msg: `Agregado con exito`,
      //     });
      // }catch (error){
      //     console.log(error);
      //     res.json({
      //         msg: `Ocurrio un error al cargar `,
      //     });
      // }
  }

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
      })
      const roleId = user.rol_users.role_id
      
      let listSolicitudes: any[] = [];
      if(user && roleId == 1){
        if(id == 5){
          listSolicitudes = await Solicitudes.findAll({
                where: {
                    estatusId: [1,2] 
                }
            });
        }else{
          listSolicitudes = await Solicitudes.findAll({
            where: {
                estatusId: id 
            }
        });
        }
        
        
      }else{
          listSolicitudes = await Solicitudes.findAll({
            where: {
              estatusId: id,
            },
            include: [
              {
                model: ValidadorSolicitud,
                as: "validasolicitud",
                where: {
                  validadorId: usuario,
                },
              },
            ],
          });
      }
      
      return res.json({
          msg: `List de exitosamente`,
          data: listSolicitudes
      });
  }

  export const getestatus = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    
    const solicitud: any = await Solicitudes.findOne({ where: { userId: id } });
    console.log(id, solicitud)
    if(solicitud){
        return res.json({
          msg: `List de exitosamente`,
          data: solicitud.estatusId
      });
    }else{
      return res.status(404).json({
            msg: `No existe el id ${id}`,
        });
    }
}

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
               .pderecha{
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





