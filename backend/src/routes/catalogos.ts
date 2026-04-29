import { Router } from 'express';
import {
  getDependencias,
  getCentrosCosto,
  getOrganismosOPDS,
  getOrganosDesconcentrados,
  getCapitulos,
  getSubcapitulos,
  getPartidasGenericas,
  getPartidasEspecificas
} from '../controllers/catalogos';

const router = Router();

router.get('/prueba-catalogos', (req, res) => {
  res.json({ ok: true, msg: 'ruta catalogos viva' });
});

router.get('/dependencias', getDependencias);
router.get('/centros-costo/:id_dependencia', getCentrosCosto);
router.get('/organismos-opds', getOrganismosOPDS);
router.get('/organos-desconcentrados', getOrganosDesconcentrados);

router.get('/capitulos', getCapitulos);
router.get('/subcapitulos/:id_capitulo', getSubcapitulos);
router.get('/partidas-genericas/:id_subcapitulo', getPartidasGenericas);
router.get('/partidas-especificas/:id_partida_generica', getPartidasEspecificas);

export default router;