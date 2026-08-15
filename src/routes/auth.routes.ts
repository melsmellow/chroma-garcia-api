import { Router } from "express";
import { forgotPassword, login, logout, signup } from "../controllers/auth.controller.js";
import { forgotPasswordLimiter } from "../middlewares/rateLimiter.js";


const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/logout", logout);

export default router;