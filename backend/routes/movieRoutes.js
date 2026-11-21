import express from "express";
import moviePostController from "../controllers/moviePostController.js";

const router = express.Router();

router.post("/", moviePostController);


export default router;