import { Router } from "express";

import {
  createArtwork,
  deleteArtwork,
  updateArtwork,
} from "../../controllers/artwork.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { upload } from "../../middlewares/upload.js";


const router = Router();

router.use(requireAuth);

// POST /api/admin/artworks
router.post(
  "/",
  upload.single("image"),
  createArtwork
);
// PATCH /api/admin/artworks/:id
router.patch("/:id", updateArtwork);

// DELETE /api/admin/artworks/:id
router.delete("/:id", deleteArtwork);

export default router;