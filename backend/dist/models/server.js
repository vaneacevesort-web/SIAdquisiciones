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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const user_1 = __importDefault(require("./user"));
const solicitud_1 = __importDefault(require("./solicitud"));
const user_2 = __importDefault(require("../routes/user"));
const solicitud_2 = __importDefault(require("../routes/solicitud"));
const documentos_1 = __importDefault(require("../routes/documentos"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3001';
        this.midlewares();
        this.router();
        this.DBconnetc();
        this.listen();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("La aplicación se esta corriendo exitosamente en el puerto => " + this.port);
        });
    }
    router() {
        this.app.use(user_2.default);
        this.app.use(solicitud_2.default);
        this.app.use(documentos_1.default);
    }
    midlewares() {
        //Parseo BOdy
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        this.app.use('/storage', express_1.default.static(path_1.default.join(process.cwd(), 'storage')));
        this.app.use('/pdfs', express_1.default.static(path_1.default.join(process.cwd(), 'public/pdfs')));
    }
    DBconnetc() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield user_1.default.sync();
                yield solicitud_1.default.sync();
                console.log("Conexion de DB exitoso");
            }
            catch (error) {
                console.log("Conexion de DB errorena => " + error);
            }
        });
    }
}
exports.default = Server;
