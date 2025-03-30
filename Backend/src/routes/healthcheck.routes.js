import { Router } from "express";
import {healthCheck} from "../controllers/healthcheck.controllers";

const router = Router();

router.get("/",healthCheck)

export default router;
