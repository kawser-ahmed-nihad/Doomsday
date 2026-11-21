import express from "express";
import moviePostController, { getMoviesController, getRewatchOrderController, moviePatchController } from "../controllers/movieController.js";

const router = express.Router();

router.post("/", moviePostController);
router.patch("/:id", moviePatchController);
router.get("/", getMoviesController);
router.get("/:id/rewatch-order", getRewatchOrderController);

export default router;