import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
import authRoutes from "./routes/auth.routes.js";
// Middlewares
app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);


app.use("/api/auth", authRoutes);
// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Chroma Garcia API is running",
  });
});

export default app;