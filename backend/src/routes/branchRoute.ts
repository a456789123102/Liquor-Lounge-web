import { create, find } from "../controllers/branchController";
import { Router } from "express";

const router = Router();

router.post("/", create);
router.get("/", find);

export default router;
