
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Clock, CalendarDays, ArrowRight, Film } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

function FeaturedMovies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`${API_URL}/movies`);

                // The latest 6 added movies
                const movieList = response.data.movies || [];
                setMovies(movieList.slice(-6).reverse());
            } catch (err) {
                setError("Unable to load movies. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return (
        <section className="bg-[#0A1020] px-4 md:px-0 py-16 ">
            <div className="mx-auto max-w-7xl sm:px-8 lg:px-10">

                {/* Section Header */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
                            Explore Collection
                        </p>

                        <h2 className="text-3xl font-bold text-white sm:text-4xl">
                            Featured <span className="text-purple-400">Movies</span>
                        </h2>

                        <p className="mt-2 text-sm text-gray-400 sm:text-base">
                            Discover your next favorite movie.
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="group flex items-center gap-2 text-sm font-semibold text-purple-400 transition hover:text-purple-300"
                    >
                        View All Movies
                        <ArrowRight
                            size={18}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="h-72 animate-pulse rounded-xl bg-[#151D31]"
                            />
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-300">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && movies.length === 0 && (
                    <div className="rounded-xl border border-white/10 bg-[#111A2E] px-6 py-12 text-center">
                        <Film className="mx-auto mb-3 text-purple-400" size={36} />
                        <h3 className="text-lg font-semibold text-white">
                            No Movies Yet
                        </h3>
                        <p className="mt-2 text-sm text-gray-400">
                            Add your first movie to see it featured here.
                        </p>
                    </div>
                )}

                {/* Movie Cards */}
                {!loading && !error && movies.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2  lg:grid-cols-5">
                        {movies.map((movie) => (
                            <div
                                key={movie._id}
                                className="group overflow-hidden rounded-xl border border-white/10 bg-[#111A2E] transition duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
                            >
                                {/* Poster Placeholder */}
                                <div className="flex aspect-[2/3] items-center justify-center bg-gradient-to-br from-[#252047] to-[#10182B]">
                                    <Film size={42} className="text-purple-400/50" />
                                </div>

                                {/* Movie Information */}
                                <div className="p-3">
                                    <h3 className="truncate text-sm font-bold text-white sm:text-base">
                                        {movie.title}
                                    </h3>

                                    <div className="mt-2 flex items-center justify-between gap-2 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <CalendarDays size={13} />
                                            {movie.releaseYear}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <Clock size={13} />
                                            {movie.runtimeMinutes} min
                                        </span>
                                    </div>

                                    <div className="mt-3">
                                        <span
                                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${movie.watched
                                                    ? "bg-green-500/10 text-green-400"
                                                    : "bg-purple-500/10 text-purple-300"
                                                }`}
                                        >
                                            {movie.watched ? "Watched" : "Not Watched"}
                                        </span>
                                    </div>

                                    <Link
                                        to="/"
                                        className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-purple-500/30 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-600 hover:text-white"
                                    >
                                        View Movie
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default FeaturedMovies;
