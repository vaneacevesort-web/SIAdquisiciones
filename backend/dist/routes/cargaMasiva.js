"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cargaMasiva_1 = require("../controllers/cargaMasiva");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
        const ok = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            || file.originalname.endsWith('.xlsx');
        cb(null, ok);
    },
});
router.post('/api/carga-masiva/validar', upload.single('archivo'), cargaMasiva_1.validarExcel);
router.post('/api/carga-masiva/importar', cargaMasiva_1.importarExcel); // recibe { token } como JSON
exports.default = router;
