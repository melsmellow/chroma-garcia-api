import { Router } from "express";

import {
  getArtworkBySlug,
  getArtworks,
  getArtworksByArtistSlug,
  likeArtwork,
} from "../controllers/artwork.controller.js";

const router = Router();

// GET /api/artworks
router.get("/", getArtworks);

// POST /api/artworks/:slug/like
router.post("/:slug/like", likeArtwork);

// GET /api/artworks/:slug
router.get("/:slug", getArtworkBySlug);
router.get(
  "/artists/:slug/artworks",
  getArtworksByArtistSlug,
);

export default router;