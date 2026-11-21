import { ObjectId } from "mongodb";

import { getDB } from "../db/db.js";

import {
    validateMovie
} from "../controllers/validators.js";

import {
    hasCircularDependency
} from "../utils/checkCircularDependency.js";


const moviePostController = async (req, res, next) => {
    try {
        const errors = validateMovie(req.body);

        if (errors.length) {
            return res.status(400).json({
                error: "VALIDATION_ERROR",
                errors
            });
        }

        const movies = getDB().collection("movies");

        const prerequisiteIds = (
            req.body.prerequisites || []
        ).map(id => new ObjectId(id));

        // Check prerequisites exist
        const found = await movies.countDocuments({
            _id: { $in: prerequisiteIds }
        });

        if (found !== prerequisiteIds.length) {
            return res.status(400).json({
                error: "PREREQUISITE_NOT_FOUND"
            });
        }

        // New movie gets a unique ID before insertion.
        const movieId = new ObjectId();

        // Check circular dependency
        if (
            await hasCircularDependency(
                movieId,
                prerequisiteIds
            )
        ) {
            return res.status(409).json({
                error: "CIRCULAR_DEPENDENCY"
            });
        }

        const doc = {
            _id: movieId,
            title: req.body.title.trim(),
            releaseYear: req.body.releaseYear,
            runtimeMinutes: req.body.runtimeMinutes,
            prerequisites: prerequisiteIds,
            watched: req.body.watched ?? false,
        };

        await movies.insertOne(doc);

        return res.status(201).json(doc);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: "DUPLICATE_TITLE"
            });
        }

        next(error);
    }
};

export default moviePostController;