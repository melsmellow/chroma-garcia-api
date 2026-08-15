import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
import authRoutes from "./routes/auth.routes.js";

// arist route
import artistRoutes from "./routes/artist.route.js";
import adminArtistRoutes from "./routes/admin/artist.admin.route.js";

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
app.use("/api/artists", artistRoutes);
app.use("/api/admin/artists", adminArtistRoutes);



// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Chroma Garcia API is running",
  });
});

export default app;