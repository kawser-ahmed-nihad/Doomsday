const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(url, options) {
    const res = await fetch(`${BASE}${url}`, options);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(body.error || "REQUEST_FAILED");
        err.code = body.error;
        err.details = body.errors;
        throw err;
    }
    return body;
}

export const getMovies = () => request("/api/movies");

export const createMovie = (data) =>
    request("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });


export const updateMovie = (id, data) =>
    request(`/api/movies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

const MESSAGES = {
    DUPLICATE_TITLE: "A movie with this title already exists.",
    PREREQUISITE_NOT_FOUND: "One of the selected prerequisites no longer exists.",
    CIRCULAR_DEPENDENCY: "These prerequisites would create a circular dependency.",
    MOVIE_NOT_FOUND: "This movie no longer exists.",
    INVALID_ID: "Invalid movie id.",
    DUPLICATE_NAME: "A cinema with this name already exists.",
};

export function errorMessage(err) {
    if (err.code === "VALIDATION_ERROR" && err.details?.length)
        return err.details.join(" ");
    return MESSAGES[err.code] || "Something went wrong. Please try again.";
}

export const getRewatchOrder = (id) => request(`/api/movies/${id}/rewatch-order`);

export const getCinemas = () => request("/api/cinemas");

export const createCinema = (data) =>
    request("/api/cinemas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

export const getBooking = (id, groupSize) =>
    request(`/api/cinemas/${id}/booking?groupSize=${groupSize}`);