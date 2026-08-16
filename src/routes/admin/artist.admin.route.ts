import { Router } from "express";

import {
  createArtist,
  deleteArtist,
  updateArtist,
} from "../../controllers/artist.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { upload } from "../../middlewares/upload.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();

// Protect every route in this router
router.use(requireAuth);

router.post("/", upload.single("portrait"), createArtist);
router.patch("/:id", upload.single("portrait"), authorize("admin"), updateArtist);
router.delete("/:id", authorize("admin"), deleteArtist);

export default router;
