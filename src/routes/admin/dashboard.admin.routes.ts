import { Router } from "express";
import { getDashboardStats } from "../../controllers/dashboard.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";


const router = Router();
router.use(requireAuth);
/**
 * GET /api/admin/dashboard/stats
 */
router.get("/stats", getDashboardStats);

export default router;
