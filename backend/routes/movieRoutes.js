import express from "express";
import moviePostController, { getMoviesController, moviePatchController } from "../controllers/movieController.js";

const router = express.Router();

router.post("/", moviePostController);
router.patch("/:id", moviePatchController);
router.get("/", getMoviesController);

export default router;