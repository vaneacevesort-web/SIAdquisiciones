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
  getEstudioMercadoById,
  getSolicitudesAfectacion,
  getAfectacionById,
  saveAfectacionPresupuestal,
  getProcedimientoById,
  saveProcedimientoAdquisitivo,
  getSolicitudesCola,
  getKpis,
  getTopDependencias,
  getEvolucionMensual,
  getActividadCalendario,
  getSemaforo,
  getOrigenDetalle,
  getDependenciasResumen,
  getAdjudicacionById,
  saveAdjudicacion,
  exportarExcelGestion,
  getInformeContratos,
} from "../controllers/solicitud";

const router = Router();

router.post("/api/solicitud/create", saveRegistro)
router.get("/api/solicitud/read", getRegistros)
router.delete("/api/solicitud/delete/:id", deleteRegistro)
router.post("/api/solicitud/edit/:id", getRegistro)
router.put("/api/solicitud/update/:id", putRegistro)
router.post("/api/solicitud/getsolicitudes", getSolicitudes)
router.get("/api/solicitud/getestatus/:id", getestatus)
router.get("/api/solicitud/estudio-mercado/:id", getEstudioMercadoById);
router.post("/api/solicitud/estudio-mercado", createEstudioMercado);
router.get("/api/solicitud/kpis", getKpis);
router.get("/api/solicitud/top-dependencias", getTopDependencias);
router.get("/api/solicitud/evolucion-mensual", getEvolucionMensual);
router.get("/api/solicitud/actividad-calendario", getActividadCalendario);
router.get("/api/solicitud/semaforo", getSemaforo);
router.get("/api/solicitud/origen-detalle", getOrigenDetalle);
router.get("/api/solicitud/dependencias-resumen", getDependenciasResumen);
router.get("/api/solicitud/cola/:estatus", getSolicitudesCola);
router.get("/api/solicitud/afectacion-presupuestal", getSolicitudesAfectacion);
router.get("/api/solicitud/afectacion-presupuestal/:id", getAfectacionById);
router.post("/api/solicitud/afectacion-presupuestal/:id", saveAfectacionPresupuestal);
router.get("/api/solicitud/adquisicion/:id", getProcedimientoById);
router.post("/api/solicitud/adquisicion/:id", saveProcedimientoAdquisitivo);
router.get("/api/solicitud/adjudicacion/:id", getAdjudicacionById);
router.post("/api/solicitud/adjudicacion/:id", saveAdjudicacion);
router.get("/api/solicitud/exportar-excel", exportarExcelGestion);
router.get("/api/solicitud/informe-contratos", getInformeContratos);

export default router