import express, {Application} from 'express'
import cors from 'cors'
import path from 'path';
import User from './user'
import Solicitudes from './solicitud'
import routesUser from '../routes/user'
import routesSolicitud from '../routes/solicitud'
import routesDocumentos from '../routes/documentos'


class Server {

    private app: Application
    private port: string


    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.midlewares();
        this.router();
        this.DBconnetc();
        this.listen();
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log("La aplicación se esta corriendo exitosamente en el puerto => "+ this.port)
        })
    }

    router(){
        this.app.use(routesUser);
        this.app.use(routesSolicitud);
        this.app.use(routesDocumentos);
    }



    midlewares(){
        //Parseo BOdy
        this.app.use(express.json())
        this.app.use(cors())
        this.app.use('/storage', express.static(path.join(process.cwd(), 'storage')));
        this.app.use('/pdfs', express.static(path.join(process.cwd(), 'public/pdfs')));
    }

    async DBconnetc(){
        try {

            await User.sync();
            await Solicitudes.sync();
            console.log("Conexion de DB exitoso");

        } catch (error) {
            console.log("Conexion de DB errorena => "+error);

        }
    }


}


export default Server
