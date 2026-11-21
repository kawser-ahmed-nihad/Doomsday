import { getDB } from "../db/db.js";
import { validateCinema } from "./validators.js";
import { ObjectId } from "mongodb";

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


const bookingQuoteController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const groupSize = Number(req.query.groupSize);

        // Validate cinema ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "INVALID_CINEMA_ID",
            });
        }

        // Validate group size
        if (
            !Number.isInteger(groupSize) ||
            groupSize < 1 ||
            groupSize > 10000
        ) {
            return res.status(400).json({
                error: "INVALID_GROUP_SIZE",
            });
        }

        const cinemas = getDB().collection("cinemas");

        const cinema = await cinemas.findOne({
            _id: new ObjectId(id),
        });

        if (!cinema) {
            return res.status(404).json({
                error: "CINEMA_NOT_FOUND",
            });
        }

        const sizes = cinema.bundleSizes;

        // Dynamic Programming
        const dp = Array(groupSize + 1).fill(Infinity);
        const chosen = Array(groupSize + 1).fill(null);

        dp[0] = 0;

        for (let i = 1; i <= groupSize; i++) {
            for (const size of sizes) {
                if (i >= size && dp[i - size] + 1 < dp[i]) {
                    dp[i] = dp[i - size] + 1;
                    chosen[i] = size;
                }
            }
        }

        // Exact combination not possible
        if (dp[groupSize] === Infinity) {
            return res.status(200).json({
                possible: false,
                groupSize,
                message: "Exact bundle combination is not possible",
            });
        }

        // Calculate bundle counts
        const bundles = {};

        let remaining = groupSize;

        while (remaining > 0) {
            const size = chosen[remaining];

            bundles[size] = (bundles[size] || 0) + 1;
            remaining -= size;
        }

        return res.status(200).json({
            possible: true,
            groupSize,
            totalBundles: dp[groupSize],
            bundles,
        });

    } catch (error) {
        next(error);
    }
};

export  {bookingQuoteController};