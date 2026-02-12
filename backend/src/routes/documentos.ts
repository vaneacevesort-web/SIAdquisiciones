import { Router } from "express";
import { getDocumentos, saveDocumentos, envSolicitud, deleteDoc, estatusDoc, getdocszip } from "../controllers/documentos";
import { upload } from '../controllers/multer';

const router = Router();
router.post("/api/documentos/create/:usuarioId", upload.single('archivo'), saveDocumentos); 
router.get("/api/documentos/getdocumentos/:id", getDocumentos)
router.get("/api/documentos/envestatus/:id", envSolicitud)
router.post("/api/documentos/deleted", deleteDoc)
router.post("/api/documentos/validadoc/:id", estatusDoc)
router.get("/api/documentos/getdoczips/:id", getdocszip)

export default router 