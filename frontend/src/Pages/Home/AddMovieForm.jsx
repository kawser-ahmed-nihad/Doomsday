
import { useEffect, useState } from "react";
import { createMovie, errorMessage } from "../../api";
import {
  X,
  Film,
  Plus,
  Loader2,
  Eye,
  ListChecks,
  Clock,
  CalendarDays,
  FilmIcon,
} from "lucide-react";

export default function AddMovieForm({
  isOpen,
  movies = [],
  onClose,
  onCreated,
}) {
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [runtimeMinutes, setRuntimeMinutes] = useState("");
  const [prerequisites, setPrerequisites] = useState([]);
  const [watched, setWatched] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  // Close modal with Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e) {
      if (e.key === "Escape" && !saving) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  // Toggle prerequisite selection
  const togglePrereq = (id) => {
    setPrerequisites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  // Form validation
  function validate() {
    const errors = {};

    if (!title.trim()) {
      errors.title = "Movie title is required.";
    }

    const year = Number(releaseYear);

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      errors.releaseYear =
        "Enter a valid year between 1900 and 2100.";
    }

    const runtime = Number(runtimeMinutes);

    if (
      !Number.isInteger(runtime) ||
      runtime < 1 ||
      runtime > 300
    ) {
      errors.runtimeMinutes =
        "Runtime must be between 1 and 300 minutes.";
    }

    return errors;
  }

  // Submit movie
  async function handleSubmit(e) {
    e.preventDefault();

    setServerError("");

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setSaving(true);

    try {
      await createMovie({
        title: title.trim(),
        releaseYear: Number(releaseYear),
        runtimeMinutes: Number(runtimeMinutes),
        prerequisites,
        watched,
      });

      // Reset form
      setTitle("");
      setReleaseYear("");
      setRuntimeMinutes("");
      setPrerequisites([]);
      setWatched(false);
      setFieldErrors({});
      setServerError("");

      await onCreated?.();
      onClose();
    } catch (error) {
      setServerError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0A1020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#111A2E] shadow-2xl shadow-black/50">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">
              <Film size={22} className="text-purple-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Add New Movie
              </h2>

              <p className="text-xs text-gray-400">
                Add a movie to your collection
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="max-h-[65vh] space-y-5 overflow-y-auto p-6">

            {/* Server Error */}
            {serverError && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {serverError}
              </div>
            )}

            {/* Movie Title */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <Film size={16} className="text-purple-400" />
                Movie Title
                <span className="text-red-400">*</span>
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Iron Man"
                className={inputClass}
              />

              {fieldErrors.title && (
                <p className="mt-1.5 text-xs text-red-400">
                  {fieldErrors.title}
                </p>
              )}
            </div>

            {/* Release Year & Runtime */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Release Year */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                  <CalendarDays size={16} className="text-purple-400" />
                  Release Year
                  <span className="text-red-400">*</span>
                </label>

                <input
                  type="number"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  placeholder="2008"
                  className={inputClass}
                />

                {fieldErrors.releaseYear && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {fieldErrors.releaseYear}
                  </p>
                )}
              </div>

              {/* Runtime */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Clock size={16} className="text-purple-400" />
                  Runtime (Minutes)
                  <span className="text-red-400">*</span>
                </label>

                <input
                  type="number"
                  min="1"
                  max="300"
                  value={runtimeMinutes}
                  onChange={(e) =>
                    setRuntimeMinutes(e.target.value)
                  }
                  placeholder="126"
                  className={inputClass}
                />

                {fieldErrors.runtimeMinutes && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {fieldErrors.runtimeMinutes}
                  </p>
                )}
              </div>
            </div>

            {/* Watched Status */}
            <div className="rounded-xl border border-white/10 bg-[#0A1020] p-4">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      watched
                        ? "bg-green-500/10"
                        : "bg-purple-500/10"
                    }`}
                  >
                    <Eye
                      size={20}
                      className={
                        watched
                          ? "text-green-400"
                          : "text-purple-400"
                      }
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Watched this movie?
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {watched
                        ? "This movie is already watched."
                        : "This movie is not watched yet."}
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={watched}
                  onChange={(e) => setWatched(e.target.checked)}
                  className="h-5 w-5 cursor-pointer accent-purple-500"
                />
              </label>
            </div>

            {/* Prerequisites */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <ListChecks size={17} className="text-purple-400" />
                  Prerequisites
                </label>

                <span className="text-xs text-purple-400">
                  {prerequisites.length} selected
                </span>
              </div>

              <p className="mb-3 text-xs text-gray-500">
                Select movies that should be watched before this movie.
              </p>

              <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-white/10 bg-[#0A1020] p-2">
                {movies.length === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-500">
                    No existing movies available.
                  </p>
                ) : (
                  movies.map((movie) => (
                    <label
                      key={movie._id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
                    >
                      <input
                        type="checkbox"
                        checked={prerequisites.includes(movie._id)}
                        onChange={() => togglePrereq(movie._id)}
                        className="h-4 w-4 accent-purple-500"
                      />

                      <span>{movie.title}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-[#0D1527] px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FilmIcon size={17} />
                  Add Movie
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
