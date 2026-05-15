"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catalogos_1 = require("../controllers/catalogos");
const router = (0, express_1.Router)();
router.get('/prueba-catalogos', (req, res) => {
    res.json({ ok: true, msg: 'ruta catalogos viva' });
});
router.get('/dependencias', catalogos_1.getDependencias);
router.get('/centros-costo/:id_dependencia', catalogos_1.getCentrosCosto);
router.get('/organismos-opds', catalogos_1.getOrganismosOPDS);
router.get('/organos-desconcentrados', catalogos_1.getOrganosDesconcentrados);
router.get('/capitulos', catalogos_1.getCapitulos);
router.get('/subcapitulos/:id_capitulo', catalogos_1.getSubcapitulos);
router.get('/partidas-genericas/:id_subcapitulo', catalogos_1.getPartidasGenericas);
router.get('/partidas-especificas/:id_partida_generica', catalogos_1.getPartidasEspecificas);
router.get('/fuentes-financiamiento', catalogos_1.getFuentesFinanciamiento);
exports.default = router;
