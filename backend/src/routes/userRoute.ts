import {create, find, me} from"../controllers/userController";
import { Router } from "express";

const router = Router();
//router.post("/",create);
//router.get("/",find);
router.get("/me",me);
export default router;