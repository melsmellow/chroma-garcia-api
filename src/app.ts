import express from "express";
import cors from "cors";

const app = express();

// Middlewares
app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Chroma Garcia API is running",
  });
});

export default app;