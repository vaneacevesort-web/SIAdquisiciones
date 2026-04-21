import { Router } from 'express';
import {
  getDependencias,
  getCentrosCosto,
  getOrganismosOPDS,
  getOrganosDesconcentrados
} from '../controllers/catalogos';

const router = Router();

router.get('/dependencias', getDependencias);
router.get('/centros-costo/:id_dependencia', getCentrosCosto);
router.get('/organismos-opds', getOrganismosOPDS);
router.get('/organos-desconcentrados', getOrganosDesconcentrados);

export default router;