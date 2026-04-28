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
exports.getPartidasEspecificas = exports.getPartidasGenericas = exports.getSubcapitulos = exports.getCapitulos = exports.getOrganosDesconcentrados = exports.getOrganismosOPDS = exports.getCentrosCosto = exports.getDependencias = void 0;
const AdqDependencias_1 = __importDefault(require("../models/AdqDependencias"));
const AdqCentrosCosto_1 = __importDefault(require("../models/AdqCentrosCosto"));
const AdqOrganismosOPDS_1 = __importDefault(require("../models/AdqOrganismosOPDS"));
const AdqOrganosDesconcentrados_1 = __importDefault(require("../models/AdqOrganosDesconcentrados"));
const AdqCatCapitulos_1 = __importDefault(require("../models/AdqCatCapitulos"));
const AdqCatSubcapitulos_1 = __importDefault(require("../models/AdqCatSubcapitulos"));
const AdqCatPartidasGenericas_1 = __importDefault(require("../models/AdqCatPartidasGenericas"));
const AdqCatPartidasEspecificas_1 = __importDefault(require("../models/AdqCatPartidasEspecificas"));
const getDependencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dependencias = yield AdqDependencias_1.default.findAll({
            order: [['nombre', 'ASC']]
        });
        return res.json({
            msg: 'Dependencias obtenidas',
            data: dependencias
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al obtener dependencias'
        });
    }
});
exports.getDependencias = getDependencias;
const getCentrosCosto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_dependencia } = req.params;
    try {
        const centros = yield AdqCentrosCosto_1.default.findAll({
            where: { id_dependencia },
            order: [['nombre', 'ASC']]
        });
        return res.json({
            msg: 'Centros de costo obtenidos',
            data: centros
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al obtener centros de costo'
        });
    }
});
exports.getCentrosCosto = getCentrosCosto;
const getOrganismosOPDS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organismos = yield AdqOrganismosOPDS_1.default.findAll({
            order: [['nombre', 'ASC']]
        });
        return res.json({
            msg: 'Organismos OPDS obtenidos',
            data: organismos
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al obtener organismos OPDS'
        });
    }
});
exports.getOrganismosOPDS = getOrganismosOPDS;
const getOrganosDesconcentrados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organos = yield AdqOrganosDesconcentrados_1.default.findAll({
            order: [['nombre', 'ASC']]
        });
        return res.json({
            msg: 'Órganos desconcentrados obtenidos',
            data: organos
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al obtener órganos desconcentrados'
        });
    }
});
exports.getOrganosDesconcentrados = getOrganosDesconcentrados;
const getCapitulos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const capitulos = yield AdqCatCapitulos_1.default.findAll({
            order: [['codigo', 'ASC']]
        });
        return res.json({
            msg: 'Capítulos obtenidos',
            data: capitulos
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al obtener capítulos'
        });
    }
});
exports.getCapitulos = getCapitulos;
const getSubcapitulos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_capitulo } = req.params;
    try {
        const subcapitulos = yield AdqCatSubcapitulos_1.default.findAll({
            where: { id_capitulo },
            order: [['codigo', 'ASC']]
        });
        return res.json({
            msg: 'Subcapítulos obtenidos',
            data: subcapitulos
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al obtener subcapítulos'
        });
    }
});
exports.getSubcapitulos = getSubcapitulos;
const getPartidasGenericas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_subcapitulo } = req.params;
    try {
        const partidas = yield AdqCatPartidasGenericas_1.default.findAll({
            where: { id_subcapitulo },
            order: [['codigo', 'ASC']]
        });
        return res.json({
            msg: 'Partidas genéricas obtenidas',
            data: partidas
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al obtener partidas genéricas'
        });
    }
});
exports.getPartidasGenericas = getPartidasGenericas;
const getPartidasEspecificas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_partida_generica } = req.params;
    try {
        const partidas = yield AdqCatPartidasEspecificas_1.default.findAll({
            where: { id_partida_generica },
            order: [['codigo', 'ASC']]
        });
        return res.json({
            msg: 'Partidas específicas obtenidas',
            data: partidas
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al obtener partidas específicas'
        });
    }
});
exports.getPartidasEspecificas = getPartidasEspecificas;
