import { ObjectId } from "mongodb";
import { getDB } from "../db/db.js";

export async function hasCircularDependency(
    movieId,
    prerequisites
) {
    const movies = getDB().collection("movies");

    const visited = new Set();

    async function check(currentId) {
        const id = currentId.toString();

        // Target movie-তে ফিরে এলে cycle পাওয়া গেছে
        if (id === movieId.toString()) {
            return true;
        }

        if (visited.has(id)) {
            return false;
        }

        visited.add(id);

        const movie = await movies.findOne({
            _id: new ObjectId(id)
        });

        if (!movie) return false;

        for (const prerequisiteId of movie.prerequisites || []) {
            if (await check(prerequisiteId)) {
                return true;
            }
        }

        return false;
    }

    for (const prerequisiteId of prerequisites) {
        if (await check(prerequisiteId)) {
            return true;
        }
    }

    return false;
}