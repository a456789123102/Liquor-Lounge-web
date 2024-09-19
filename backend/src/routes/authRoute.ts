import {login} from"../controllers/userController";
import { Router } from "express";

const router = Router();
router.post("/login",login);
export default router;