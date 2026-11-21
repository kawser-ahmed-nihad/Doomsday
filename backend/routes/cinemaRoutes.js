import express from "express";
import cinemaPostController, { getCinemasController } from "../controllers/cinemaController.js";

const router = express.Router();

router.post("/", cinemaPostController);
router.get("/", getCinemasController);

export default router;
