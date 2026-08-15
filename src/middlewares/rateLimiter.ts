import { rateLimit } from "express-rate-limit";

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  limit: 5, // Max 5 requests per IP

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    message:
      "Too many password reset requests. Please try again later.",
  },
});