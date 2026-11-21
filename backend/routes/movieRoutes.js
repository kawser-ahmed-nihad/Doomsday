import express from "express";
import moviePostController, { moviePatchController } from "../controllers/moviePostController.js";

const router = express.Router();

router.post("/", moviePostController);
router.patch("/:id", moviePatchController);


export default router;