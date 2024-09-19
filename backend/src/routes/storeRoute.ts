import {create, find,branches} from '../controllers/storeController';
import { Router } from "express";

const router = Router();

router.post("/",create);
router.get("/",find);
router.get("/:storeId/branches",branches);

export default router;