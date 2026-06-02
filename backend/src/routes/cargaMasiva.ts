import { Router } from 'express';
import multer from 'multer';
import { validarExcel, importarExcel } from '../controllers/cargaMasiva';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const ok = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      || file.originalname.endsWith('.xlsx');
    cb(null, ok);
  },
});

router.post('/api/carga-masiva/validar',  upload.single('archivo'), validarExcel);
router.post('/api/carga-masiva/importar', importarExcel);   // recibe { token } como JSON

export default router;
