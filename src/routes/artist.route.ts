import { Router } from "express";

import {
  getArtistBySlug,
  getArtists,
} from "../controllers/artist.controller.js";
import { getArtworksByArtistSlug } from "../controllers/artwork.controller.js";

const router = Router();

router.get("/", getArtists);
router.get("/:slug/artworks", getArtworksByArtistSlug);
router.get("/:slug", getArtistBySlug);

export default router;