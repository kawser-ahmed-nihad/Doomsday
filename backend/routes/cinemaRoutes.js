import express from "express";
import cinemaPostController from "../controllers/cinemaController.js";

const router = express.Router();

router.post("/", cinemaPostController);

export default router;
