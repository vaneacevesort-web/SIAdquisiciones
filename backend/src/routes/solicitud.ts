import { Router } from "express";
import {
  deleteRegistro,
  getRegistros,
  getRegistro,
  saveRegistro,
  putRegistro,
  getSolicitudes,
  getestatus,
  createEstudioMercado,
  getSolicitudesAfectacion,
} from "../controllers/solicitud";

const router = Router();

router.post("/api/solicitud/create", saveRegistro)
router.get("/api/solicitud/read", getRegistros)
router.delete("/api/solicitud/delete/:id", deleteRegistro)
router.post("/api/solicitud/edit/:id", getRegistro)
router.put("/api/solicitud/update/:id", putRegistro)
router.post("/api/solicitud/getsolicitudes", getSolicitudes)
router.get("/api/solicitud/getestatus/:id", getestatus)
router.post("/api/solicitud/estudio-mercado", createEstudioMercado);
router.get("/api/solicitud/afectacion-presupuestal", getSolicitudesAfectacion);

export default router