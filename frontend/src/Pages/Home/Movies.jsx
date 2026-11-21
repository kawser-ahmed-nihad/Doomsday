
import { useCallback, useEffect, useState } from "react";
import {
  Film,
  Plus,
  Clapperboard,
  Eye,
  EyeOff,
  Search,
} from "lucide-react";

import { getMovies, errorMessage } from "../../api";
import AddMovieForm from "./AddMovieForm";
import MovieCard from "../../Components/MovieCard";

function ErrorBox({ children }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
    >
      {children}
    </div>
  );
}

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoadError("");

    try {
      const data = await getMovies();
      setMovies(Array.isArray(data) ? data : data.movies ?? []);
    } catch (error) {
      setLoadError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const watchedCount = movies.filter((m) => m.watched).length;
  const unwatchedCount = movies.length - watchedCount;

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  const nameById = Object.fromEntries(
    movies.map((m) => [m._id, m.title])
  );

  return (
    <div className="min-h-screen bg-[#0A1020] px-4 py-10 text-white ">
      <div className="mx-auto max-w-7xl  sm:px-8 lg:px-10">

        {/* Page Header */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
              <Film size={17} />
              Movie Collection
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My <span className="text-purple-400">Movies</span>
            </h1>

            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Organize your movie collection and track your watching journey.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 transition hover:bg-purple-500 active:scale-95"
          >
            <Plus size={19} />
            Add Movie
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#111A2E] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Movies</p>
                <h2 className="mt-2 text-3xl font-bold">{movies.length}</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <Clapperboard className="text-purple-400" size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111A2E] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Watched</p>
                <h2 className="mt-2 text-3xl font-bold text-green-400">
                  {watchedCount}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                <Eye className="text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111A2E] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Not Watched</p>
                <h2 className="mt-2 text-3xl font-bold text-orange-400">
                  {unwatchedCount}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                <EyeOff className="text-orange-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Movie Collection Header */}
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold">All Movies</h2>
            <p className="mt-1 text-sm text-gray-400">
              {movies.length} movies in your collection
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies..."
              className="w-full rounded-xl border border-white/10 bg-[#111A2E] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Error */}
        {loadError && (
          <div className="mb-5">
            <ErrorBox>{loadError}</ErrorBox>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl border border-white/10 bg-[#111A2E]"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !loadError && movies.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#111A2E] px-5 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10">
              <Film size={30} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold">Your collection is empty</h3>
            <p className="mt-2 text-sm text-gray-400">
              Start building your movie collection by adding your first movie.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-6 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold hover:bg-purple-500"
            >
              Add Your First Movie
            </button>
          </div>
        )}

        {/* No Search Results */}
        {!loading && !loadError && movies.length > 0 && filteredMovies.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#111A2E] py-12 text-center">
            <Search className="mx-auto mb-3 text-gray-500" size={30} />
            <p className="font-medium">No matching movies found</p>
            <p className="mt-1 text-sm text-gray-400">
              Try searching with another title.
            </p>
          </div>
        )}

        {/* Movie Cards */}
        {!loading && !loadError && filteredMovies.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                allMovies={movies}
                nameById={nameById}
                onChanged={load}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      <AddMovieForm
        isOpen={showAddModal}
        movies={movies}
        onClose={() => setShowAddModal(false)}
        onCreated={load}
      />
    </div>
  );
}
