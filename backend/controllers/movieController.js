import { ObjectId } from "mongodb";

import { getDB } from "../db/db.js";

import {
    validateMovie
} from "./validators.js";

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


const moviePatchController = async (req, res, next) => {
    try {
        // Validate MongoDB ID
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: "INVALID_MOVIE_ID"
            });
        }

        const movieId = new ObjectId(req.params.id);

        const movies = getDB().collection("movies");

        // Find existing movie
        const existingMovie = await movies.findOne({
            _id: movieId
        });

        if (!existingMovie) {
            return res.status(404).json({
                error: "MOVIE_NOT_FOUND"
            });
        }

        // Only allow these fields to be updated
        const allowedFields = [
            "prerequisites",
            "watched"
        ];

        const updateData = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                error: "NO_VALID_FIELDS_TO_UPDATE"
            });
        }

        // Convert existing prerequisites to strings for validation
        const validationData = {
            title: existingMovie.title,
            releaseYear: existingMovie.releaseYear,
            runtimeMinutes: existingMovie.runtimeMinutes,
            watched: existingMovie.watched,
            prerequisites: (existingMovie.prerequisites || [])
                .map(id => id.toString()),
            ...updateData
        };

        const errors = validateMovie(validationData);

        if (errors.length > 0) {
            return res.status(400).json({
                error: "VALIDATION_ERROR",
                errors
            });
        }

        // Convert prerequisite IDs
        if (updateData.prerequisites !== undefined) {
            const prerequisiteIds = updateData.prerequisites.map(
                id => new ObjectId(id)
            );

            // Check whether all prerequisites exist
            const found = await movies.countDocuments({
                _id: { $in: prerequisiteIds }
            });

            if (found !== prerequisiteIds.length) {
                return res.status(400).json({
                    error: "PREREQUISITE_NOT_FOUND"
                });
            }

            // Check circular dependency
            const circular = await hasCircularDependency(
                movieId,
                prerequisiteIds
            );

            if (circular) {
                return res.status(409).json({
                    error: "CIRCULAR_DEPENDENCY"
                });
            }

            updateData.prerequisites = prerequisiteIds;
        }

        // Trim title
        if (updateData.title !== undefined) {
            updateData.title = updateData.title.trim();
        }

        // Update movie
        await movies.updateOne(
            { _id: movieId },
            { $set: updateData }
        );

        // Return updated movie
        const updatedMovie = await movies.findOne({
            _id: movieId
        });

        return res.status(200).json({
            message: "Movie updated successfully",
            movie: updatedMovie
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: "DUPLICATE_TITLE"
            });
        }

        next(error);
    }
};

export { moviePatchController };


const getMoviesController = async (req, res, next) => {
    try {
        const movies = getDB().collection("movies");

        const allMovies = await movies.find({}).toArray();

        return res.status(200).json({
            count: allMovies.length,
            movies: allMovies
        });

    } catch (error) {
        next(error);
    }
};

export { getMoviesController };

const getRewatchOrderController = async (req, res, next) => {
    try {
        // 1. Validate movie ID
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: "INVALID_MOVIE_ID",
            });
        }

        const movieId = new ObjectId(req.params.id);
        const movies = getDB().collection("movies");

        // 2. Find the target movie
        const targetMovie = await movies.findOne({ _id: movieId });

        if (!targetMovie) {
            return res.status(404).json({
                error: "MOVIE_NOT_FOUND",
            });
        }

        const visited = new Set();
        const visiting = new Set();
        const rewatchOrder = [];

        // 3. Recursively find prerequisite movies
        const findPrerequisites = async (currentId) => {
            const id = currentId.toString();

            // Throw an error when returning to the target movie
            if (id === movieId.toString()) {
                throw new Error("CIRCULAR_DEPENDENCY");
            }

            if (visiting.has(id)) {
                throw new Error("CIRCULAR_DEPENDENCY");
            }

            if (visited.has(id)) return;

            visiting.add(id);

            const movie = await movies.findOne({
                _id: new ObjectId(id),
            });

            if (!movie) {
                throw new Error("PREREQUISITE_NOT_FOUND");
            }

            // First, find this movie's prerequisites
            for (const prerequisiteId of movie.prerequisites || []) {
                await findPrerequisites(prerequisiteId);
            }

            visiting.delete(id);
            visited.add(id);

            // Add this movie after all its prerequisites
            rewatchOrder.push(movie);
        };

        // 4. Start with the target movie's prerequisites
        for (const prerequisiteId of targetMovie.prerequisites || []) {
            await findPrerequisites(prerequisiteId);
        }

        // 5. Calculate watched count and remaining runtime
        const watchedCount = rewatchOrder.filter(
            (movie) => movie.watched
        ).length;

        const unwatchedRuntimeMinutes = rewatchOrder
            .filter((movie) => !movie.watched)
            .reduce((total, movie) => total + movie.runtimeMinutes, 0);

        // 6. Response
        return res.status(200).json({
            targetMovie: {
                id: targetMovie._id,
                title: targetMovie.title,
            },
            totalMovies: rewatchOrder.length,
            watchedCount,
            unwatchedCount: rewatchOrder.length - watchedCount,
            unwatchedRuntimeMinutes,
            rewatchOrder,
        });
    } catch (error) {
        if (error.message === "CIRCULAR_DEPENDENCY") {
            return res.status(409).json({
                error: "CIRCULAR_DEPENDENCY",
            });
        }

        if (error.message === "PREREQUISITE_NOT_FOUND") {
            return res.status(400).json({
                error: "PREREQUISITE_NOT_FOUND",
            });
        }

        next(error);
    }
};

export { getRewatchOrderController };