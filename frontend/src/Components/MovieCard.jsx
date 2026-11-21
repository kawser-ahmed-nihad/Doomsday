
import { useState } from "react";
import { updateMovie, errorMessage } from "../api";
import {
  Film,
  Clock,
  CalendarDays,
  Check,
  Pencil,
  X,
  Save,
  Loader2,
  ListChecks,
} from "lucide-react";

function ErrorBox({ children }) {
  return (
    <div
      role="alert"
      className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300"
    >
      {children}
    </div>
  );
}

export default function MovieCard({
  movie,
  allMovies,
  nameById,
  onChanged,
}) {
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [watchedBusy, setWatchedBusy] = useState(false);

  const currentPrerequisites = (movie.prerequisites || []).map((item) =>
    typeof item === "object" && item !== null ? item._id : String(item)
  );

  function startEdit() {
    setSelected(currentPrerequisites);
    setError("");
    setEditing(true);
  }

  const toggle = (id) => {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  async function save() {
    setBusy(true);
    setError("");

    try {
      await updateMovie(movie._id, { prerequisites: selected });
      setEditing(false);
      await onChanged?.();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function toggleWatched(e) {
    const checked = e.target.checked;
    setWatchedBusy(true);
    setError("");

    try {
      await updateMovie(movie._id, { watched: checked });
      await onChanged?.();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setWatchedBusy(false);
    }
  }

  const names = currentPrerequisites.map(
    (id) => nameById[id] || "Unknown movie"
  );

  return (
    <li className="list-none overflow-hidden rounded-2xl border border-white/10 bg-[#111A2E] transition duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/20">

      {/* Card Top */}
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10">
            <Film size={24} className="text-purple-400" />
          </div>

          <div className="min-w-0">
            <h3
              className={`truncate text-base font-bold ${
                movie.watched
                  ? "text-gray-400"
                  : "text-white"
              }`}
            >
              {movie.title}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Movie Collection
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
            movie.watched
              ? "bg-green-500/10 text-green-400"
              : "bg-orange-500/10 text-orange-300"
          }`}
        >
          {movie.watched ? "Watched" : "Not Watched"}
        </span>
      </div>

      {/* Movie Details */}
      <div className="mx-5 flex items-center gap-5 rounded-xl bg-[#0A1020] px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <CalendarDays size={16} className="text-purple-400" />
          {movie.releaseYear}
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock size={16} className="text-purple-400" />
          {movie.runtimeMinutes} min
        </div>
      </div>

      {/* Prerequisites */}
      <div className="px-5 pb-4 pt-5">
        <div className="mb-3 flex items-center gap-2">
          <ListChecks size={17} className="text-purple-400" />
          <p className="text-sm font-semibold text-gray-300">
            Watch First
          </p>
        </div>

        {!editing ? (
          <div className="flex min-h-8 flex-wrap gap-2">
            {names.length === 0 ? (
              <span className="text-xs text-gray-500">
                No prerequisites
              </span>
            ) : (
              names.map((name, index) => (
                <span
                  key={index}
                  className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs text-purple-300"
                >
                  {name}
                </span>
              ))
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#0A1020] p-3">
            <p className="mb-2 text-xs text-gray-400">
              Select movies to watch before this one.
            </p>

            <div className="max-h-36 space-y-1 overflow-y-auto">
              {allMovies
                .filter((m) => m._id !== movie._id)
                .map((m) => (
                  <label
                    key={m._id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-300 hover:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(m._id)}
                      onChange={() => toggle(m._id)}
                      className="h-4 w-4 accent-purple-500"
                    />
                    {m.title}
                  </label>
                ))}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={save}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Save
              </button>

              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-white/5 disabled:opacity-50"
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && <ErrorBox>{error}</ErrorBox>}
      </div>

      {/* Card Footer */}
      {!editing && (
        <div className="flex items-center justify-between border-t border-white/10 bg-[#0D1527] px-5 py-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={Boolean(movie.watched)}
              disabled={watchedBusy}
              onChange={toggleWatched}
              className="h-4 w-4 accent-green-500"
            />
            {watchedBusy ? "Updating..." : "Mark as watched"}
          </label>

          <button
            type="button"
            onClick={startEdit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 px-3 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/10"
          >
            <Pencil size={14} />
            Edit
          </button>
        </div>
      )}
    </li>
  );
}
