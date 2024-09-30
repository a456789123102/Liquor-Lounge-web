import {create, find,branches, findOne, update} from '../controllers/storeController';
import { Router } from "express";

const router = Router();

router.post("/",create);
router.get("/",find);
router.get("/:storeId/branches",branches);
router.get("/:storeId",findOne);
router.patch("/:storeId",update);
export default router;