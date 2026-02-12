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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetpassword = exports.updatepassword = exports.validatoken = exports.getvalidador = exports.updatevalidador = exports.deletevali = exports.saveValidador = exports.changevalidador = exports.getvalidadores = exports.LoginUser = exports.CreateUser = exports.ReadUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const role_users_1 = __importDefault(require("../models/role_users"));
const role_1 = __importDefault(require("../models/role"));
// import jwt from 'jsonwebtoken'
const validadorsolicitud_1 = __importDefault(require("../models/validadorsolicitud"));
const mailer_1 = require("../utils/mailer");
const datos_user_1 = __importDefault(require("../models/datos_user"));
// import { JwtPayload } from 'jsonwebtoken';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const solicitud_1 = __importDefault(require("../models/solicitud"));
const ReadUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listUser = yield user_1.default.findAll();
    return res.json({
        msg: `List de categoría encontrada exitosamenteeeee`,
        data: listUser
    });
});
exports.ReadUser = ReadUser;
const CreateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /*const { Uname, Ulastname, Upassword, Uemail, Ucredential } = req.body
    console.log(req.body);
    const userEmail = await User.findOne({ where: {  Uemail: Uemail  }})
    const userCredential = await User.findOne({ where: {  Ucredential: Ucredential  }})

    if (userEmail) {
        return next(JSON.stringify({ msg: `Usuario ya existe con el email ${Uemail}`}));
        /*return res.status(400).json({
            msg: `Usuario ya existe con el email ${Uemail}`
        })
    }

    if (userCredential) {
        return next(JSON.stringify({ msg: `Usuario ya existe con la credencial ${Ucredential}`}));
        /*
        return res.status(400).json({
            msg: `Usuario ya existe con la credencial ${Ucredential}`
        })
    }

    const UpasswordHash = await bcrypt.hash(Upassword, 10)
    try {
        User.create({
            name: Uname,
            lastname: Ulastname,
            Uemail: Uemail,
            Upassword: UpasswordHash,
            Ucredential: Ucredential,
            Ustatus: 1
        })

        return next(JSON.stringify({ msg: `User ${Uname} ${Ulastname} create success.`}));
        /*res.json({
            msg: `User ${Uname} ${Ulastname} create success.`
        })

    } catch (error) {
        return next(JSON.stringify({ msg: `Existe un error al crear el usuario => `, error}));
        /*res.status(400).json({
            msg: `Existe un error al crear el usuario => `, error
        })
    }*/
});
exports.CreateUser = CreateUser;
const LoginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(req.body);
    const user = yield user_1.default.findOne({
        where: { email: email },
        include: [
            {
                model: role_users_1.default,
                as: 'rol_users',
                include: [
                    {
                        model: role_1.default,
                        as: 'role'
                    }
                ]
            }
        ]
    });
    console.log(user);
    if (!user) {
        //return next(JSON.stringify({ msg: `Usuario no existe con el email ${email}`}));
        return res.status(400).json({
            msg: `Usuario no existe con el email ${email}`
        });
    }
    const passwordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!passwordValid) {
        //return next(JSON.stringify({ msg: `Password Incorrecto => ${password}`}));
        return res.status(400).json({
            msg: `Password Incorrecto => ${password}`
        });
    }
    const token = jsonwebtoken_1.default.sign({
        email: email
    }, process.env.SECRET_KEY || 'TSE-Poder-legislativo', { expiresIn: 10000 });
    return res.json({ token, user });
});
exports.LoginUser = LoginUser;
const getvalidadores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findAll({
        include: [
            {
                model: role_users_1.default,
                as: 'rol_users',
                where: { role_id: 2 },
                attributes: []
            },
            {
                model: datos_user_1.default,
                as: 'datos_user',
            }
        ]
    });
    // const user = userst.map(user1 => ({
    // id: user1.id,
    // nombre: `${user1.datos_user?.nombre ?? ''} ${user1.datos_user?.apaterno ?? ''} ${user1.datos_user?.amaterno ?? ''}`.trim()
    // }));
    if (user) {
        return res.json({
            msg: `List de exitosamente`,
            data: user
        });
    }
});
exports.getvalidadores = getvalidadores;
const changevalidador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, solicitud } = req.body;
    const validasolicitudes = yield validadorsolicitud_1.default.findOne({
        where: { solicitudId: solicitud },
    });
    if (validasolicitudes) {
        validasolicitudes.validadorId = usuario;
        yield validasolicitudes.save();
        return res.json("200");
    }
    else {
        return res.status(404).json({
            msg: `No existe el id ${solicitud}`,
        });
    }
});
exports.changevalidador = changevalidador;
const saveValidador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    function generateRandomPassword(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
    const solicitud = yield user_1.default.findOne({
        where: { email: body.correo }
    });
    if (solicitud) {
        return res.json({ estatus: `400`, correo: solicitud.email });
    }
    try {
        const Upassword = generateRandomPassword(12);
        const UpasswordHash = yield bcrypt_1.default.hash(Upassword, 10);
        const newUser = yield user_1.default.create({
            name: body.curp,
            email: body.correo,
            password: UpasswordHash,
            rol_users: {
                role_id: 2,
            },
        }, {
            include: [{ model: role_users_1.default, as: 'rol_users' }],
        });
        body.user_id = newUser.id;
        yield datos_user_1.default.create(body);
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const contenido = `
          <h1 class="pcenter">CORREO ELECTRÓNICO PARA ACCESOS AL SISTEMA</h1>
          
          <p><strong>Asunto:</strong> Cuenta creada exitosamente.</p>

          <h3>C. ${body.nombre} ${body.apaterno} ${body.amaterno},</h3>

          <p>Por este medio le informamos que se ha generado de manera exitosa
          su usuario para que pueda validar las solicitudes. A continuación, 
          se le proporcionan sus credenciales:</p>

          <p>
            <strong>Usuario:</strong> ${body.correo} <br>
            <strong>Contraseña:</strong> ${Upassword}
          </p>

          <p>Se le recuerda que podrá iniciar su proceso de registro
            a través del micrositio 
            <a href="https://dev5.siasaf.gob.mx/auth/login" target="_blank">
              https://dev5.siasaf.gob.mx/auth/login
            </a> 
            durante el periodo comprendido del XXXXX al XXXXX de XXXXX de 2025.
          </p>

        `;
                let htmlContent = generarHtmlCorreo(contenido);
                yield (0, mailer_1.sendEmail)(body.correo, 'Tus credenciales de acceso', htmlContent);
                console.log('Correo enviado correctamente');
            }
            catch (err) {
                console.error('Error al enviar correo:', err);
            }
        }))();
        return res.json({ msg: `Agregado con éxito y correo enviado`, correo: body.correo });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: `Ocurrió un error al registrar` });
    }
});
exports.saveValidador = saveValidador;
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
const deletevali = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tieneSolicitudes = yield validadorsolicitud_1.default.findOne({
            where: { validadorId: id },
            attributes: ['id'],
        });
        if (tieneSolicitudes) {
            return res.status(400).json({
                estatus: 400,
                msg: "Este validador tiene solicitudes asignadas",
            });
        }
        yield Promise.all([
            role_users_1.default.destroy({ where: { user_id: id } }),
            datos_user_1.default.destroy({ where: { user_id: id } }),
            user_1.default.destroy({ where: { id } }),
        ]);
        return res.status(200).json({ estatus: 200, msg: 'Validador eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar validador:', error);
        return res.status(500).json({ estatus: 500, msg: 'Error del servidor' });
    }
});
exports.deletevali = deletevali;
const updatevalidador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    try {
        const usuario = yield user_1.default.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        yield usuario.update({
            name: body.curp,
            email: body.correo,
        });
        const datosUsuario = yield datos_user_1.default.findOne({ where: { user_id: id } });
        if (datosUsuario) {
            yield datosUsuario.update({
                nombre: body.nombre,
                apaterno: body.apaterno,
                amaterno: body.amaterno,
                direccion: body.direccion,
                dependencia: body.dependencia,
                departamento: body.departamento,
                cargo: body.cargo,
            });
        }
        return res.status(200).json({ msg: 'Actualizado correctamente' });
    }
    catch (error) {
        console.error('Error al actualizar:', error);
        return res.status(500).json({ msg: 'Ocurrió un error al actualizar' });
    }
});
exports.updatevalidador = updatevalidador;
const getvalidador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.default.findOne({
        where: { id: id },
        include: [
            {
                model: role_users_1.default,
                as: 'rol_users',
                attributes: []
            },
            {
                model: datos_user_1.default,
                as: 'datos_user',
            }
        ]
    });
    if (user) {
        return res.json({
            msg: `List de exitosamente`,
            data: user
        });
    }
});
exports.getvalidador = getvalidador;
const validatoken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    try {
        const payload = jsonwebtoken_1.default.verify(id, process.env.JWT_SECRET);
        res.json({ valid: true, payload });
    }
    catch (err) {
        res.json({ valid: false, error: 'Token inválido o expirado' });
    }
});
exports.validatoken = validatoken;
const updatepassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        yield user_1.default.update({ password: hashedPassword }, { where: { id: payload.userId } });
        res.json({ msg: 'Contraseña actualizada correctamente' });
    }
    catch (err) {
        res.status(400).json({ error: 'Token inválido o expirado' });
    }
});
exports.updatepassword = updatepassword;
const resetpassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo } = req.body;
    const usuario = yield user_1.default.findOne({
        where: { email: correo }
    });
    if (usuario) {
        try {
            const solicitud = yield solicitud_1.default.findOne({ where: { userId: usuario.id } });
            const token = jsonwebtoken_1.default.sign({
                email: correo,
                userId: usuario.id,
            }, process.env.JWT_SECRET || 'sUP3r_s3creT_ClavE-4321!', { expiresIn: '2d' });
            const enlace = `https://dev5.siasaf.gob.mx/auth/cambiar-contrasena?token=${token}`;
            // https://dev5.siasaf.gob.mx/
            const nombreCompleto = `${solicitud.nombres} ${solicitud.ap_paterno} ${solicitud.ap_materno}`.trim();
            //         console.log(nombreCompleto);
            // return (500);
            (() => __awaiter(void 0, void 0, void 0, function* () {
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
            <p>C. ${nombreCompleto}</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta. Para establecer una nueva contraseña, haga clic en el siguiente enlace:</p>
            <p>
              <a href="${enlace}">Restablecer mi contraseña</a>
            </p>
            <p>Si no solicitó este cambio, ignore este mensaje.</p>
            <p class="footer">
              Si tiene problemas para hacer clic en el botón, copie y pegue esta URL en su navegador:<br>
               ${enlace}
            </p>
            <p>Atentamente,<br><strong>Poder Legislativo del Estado de México</strong></p>
          </div> 

          </p>
        `;
                    let htmlContent = generarHtmlCorreo(contenido);
                    yield (0, mailer_1.sendEmail)(correo, 'Restablecer contraseña', htmlContent);
                    console.log('Correo enviado correctamente');
                }
                catch (err) {
                    console.error('Error al enviar correo:', err);
                }
            }))();
            return res.json({ valid: true, msg: `enviado correctamente`, correo: correo });
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({ msg: `Ocurrió un error al registrar` });
        }
    }
    else {
        return res.json({ valid: false, estatus: `400`, correo: correo });
    }
});
exports.resetpassword = resetpassword;
