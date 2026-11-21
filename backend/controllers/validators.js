export function validateMovie(body) {
    const errors = [];

    if (
        typeof body.title !== "string" ||
        !body.title.trim()
    ) {
        errors.push("title is required");
    }

    if (!Number.isInteger(body.releaseYear)) {
        errors.push("releaseYear must be an integer");
    }

    if (
        !Number.isInteger(body.runtimeMinutes) ||
        body.runtimeMinutes < 1 ||
        body.runtimeMinutes > 300
    ) {
        errors.push("runtimeMinutes must be between 1 and 300");
    }

    if (
        body.watched !== undefined &&
        typeof body.watched !== "boolean"
    ) {
        errors.push("watched must be boolean");
    }

    if (
        body.prerequisites !== undefined &&
        !Array.isArray(body.prerequisites)
    ) {
        errors.push("prerequisites must be an array");
    }

    if (Array.isArray(body.prerequisites)) {
        if (!body.prerequisites.every(
            id => typeof id === "string" &&
            /^[0-9a-fA-F]{24}$/.test(id)
        )) {
            errors.push("Invalid prerequisite ID");
        }

        if (
            new Set(body.prerequisites).size !==
            body.prerequisites.length
        ) {
            errors.push("Duplicate prerequisites are not allowed");
        }
    }

    return errors;
}

export function validateCinema(body) {
    const errors = [];

    if (
        typeof body.name !== "string" ||
        !body.name.trim()
    ) {
        errors.push("name is required");
    }

    const sizes = body.bundleSizes;

    if (
        !Array.isArray(sizes) ||
        sizes.length < 1 ||
        sizes.length > 10
    ) {
        errors.push("bundleSizes must contain 1-10 items");
    } else {
        if (!sizes.every(
            n => Number.isInteger(n) && n >= 1 && n <= 500
        )) {
            errors.push("Each bundle size must be between 1 and 500");
        }

        if (new Set(sizes).size !== sizes.length) {
            errors.push("Bundle sizes must be different");
        }
    }

    return errors;
}