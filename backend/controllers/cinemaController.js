import { getDB } from "../db/db.js";
import { validateCinema } from "./validators.js";

const cinemaPostController = async (req, res, next) => {
    try {
        const errors = validateCinema(req.body);

        if (errors.length) {
            return res.status(400).json({
                error: "VALIDATION_ERROR",
                errors,
            });
        }

        const cinemas = getDB().collection("cinemas");

        const cinema = {
            name: req.body.name.trim(),
            bundleSizes: req.body.bundleSizes,
        };

        const result = await cinemas.insertOne(cinema);

        return res.status(201).json({
            message: "Cinema created successfully",
            cinema: {
                _id: result.insertedId,
                ...cinema,
            },
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: "DUPLICATE_CINEMA_NAME",
            });
        }

        next(error);
    }
};

export default cinemaPostController;


const getCinemasController = async (req, res, next) => {
    try {
        const cinemas = getDB().collection("cinemas");

        const allCinemas = await cinemas.find({}).toArray();

        return res.status(200).json({
            count: allCinemas.length,
            cinemas: allCinemas,
        });

    } catch (error) {
        next(error);
    }
};

export  {getCinemasController};
