import { Router } from "express";
import { CreateUser, LoginUser, ReadUser, getRoles, registerPublic, getvalidadores, changevalidador, saveValidador, deletevali, updatevalidador, getvalidador, validatoken, updatepassword, resetpassword } from "../controllers/user";

const router = Router();

router.get("/api/user/read", ReadUser)
router.get("/api/user/roles", getRoles)
router.post("/api/user/register-public", registerPublic)
router.post("/api/user/create", CreateUser)
router.post("/api/user/register", CreateUser)
router.post("/api/user/login", LoginUser)
router.get("/api/user/getvalidadores", getvalidadores)
router.post("/api/user/updatevalidador", changevalidador)
router.post("/api/user/savevalidador", saveValidador)
router.get('/api/user/delete/:id', deletevali)
router.put('/api/user/updatedatos/:id', updatevalidador)
router.get("/api/user/getvalidador/:id", getvalidador)
router.get("/api/user/validatoken/:id", validatoken)
router.post("/api/user/updatepassword/", updatepassword) 
router.post("/api/user/resetpassword/", resetpassword)

export default router