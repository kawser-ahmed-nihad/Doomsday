import express from "express";
import cinemaPostController, { bookingQuoteController, getCinemasController } from "../controllers/cinemaController.js";

const router = express.Router();

router.post("/", cinemaPostController);
router.get("/", getCinemasController);
router.get("/:id/booking", bookingQuoteController);

export default router;
