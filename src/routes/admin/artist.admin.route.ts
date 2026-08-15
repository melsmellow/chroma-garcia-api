import { Router } from "express";

import {
  createArtist,
  deleteArtist,
  updateArtist,
} from "../../controllers/artist.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";


const router = Router();

// Protect every route in this router
router.use(requireAuth);

router.post("/", createArtist);
router.patch("/:id", updateArtist);
router.delete("/:id", deleteArtist);

export default router;