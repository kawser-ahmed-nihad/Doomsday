import { useEffect, useState } from "react";
import {
    getMovies,
    getRewatchOrder,
    updateMovie,
    errorMessage,
} from "../../api";

import {
    Clapperboard,
    Clock3,
    Check,
    Film,
    Loader2,
    PartyPopper,
    Play,
    Ticket,
} from "lucide-react";

const fmt = (min = 0) => {
    const h = Math.floor(min / 60);
    const m = min % 60;

    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
};

// Film-strip holes + ticket notches + one soft entrance
const EXTRA_CSS = `
.rw-sprockets {
    background-image: radial-gradient(circle at center, #080D1A 0 3px, transparent 3.5px);
    background-size: 100% 18px;
    background-repeat: repeat-y;
    background-position: center 6px;
}
.rw-ticket-notch {
    -webkit-mask: radial-gradient(circle 8px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat,
                  radial-gradient(circle 8px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat;
            mask: radial-gradient(circle 8px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat,
                  radial-gradient(circle 8px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat;
}
@keyframes rw-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.rw-rise { animation: rw-rise .45s ease-out both; }
@media (prefers-reduced-motion: reduce) { .rw-rise { animation: none; } }
`;

export default function RewatchPlan() {
    const [movies, setMovies] = useState([]);
    const [targetId, setTargetId] = useState("");
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getMovies()
            .then((d) => setMovies(Array.isArray(d) ? d : d.movies ?? []))
            .catch((e) => setError(errorMessage(e)));
    }, []);

    useEffect(() => {
        if (!targetId) {
            setPlan(null);
            return;
        }

        let active = true;

        setLoading(true);
        setError("");

        getRewatchOrder(targetId)
            .then((data) => {
                const raw = Array.isArray(data)
                    ? data
                    : data.rewatchOrder ??
                      data.order ??
                      data.movies ??
                      [];

                const items = raw
                    .map((x) =>
                        typeof x === "string"
                            ? movies.find((m) => m._id === x)
                            : x
                    )
                    .filter(Boolean);

                if (!active) return;

                const watched = items.filter((m) => m.watched).length;

                const remaining = items
                    .filter((m) => !m.watched)
                    .reduce(
                        (sum, m) => sum + Number(m.runtimeMinutes || 0),
                        0
                    );

                setPlan({
                    items,
                    watched,
                    total: items.length,
                    remaining,
                });
            })
            .catch((e) => {
                if (!active) return;
                setPlan(null);
                setError(errorMessage(e));
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [targetId, movies]);

    const toggleWatched = async (movie) => {
        const newWatched = !movie.watched;

        setUpdatingId(movie._id);
        setError("");

        try {
            await updateMovie(movie._id, { watched: newWatched });

            setPlan((prev) => {
                if (!prev) return prev;

                const items = prev.items.map((m) =>
                    m._id === movie._id
                        ? { ...m, watched: newWatched }
                        : m
                );

                return {
                    ...prev,
                    items,
                    watched: items.filter((m) => m.watched).length,
                    remaining: items
                        .filter((m) => !m.watched)
                        .reduce(
                            (sum, m) =>
                                sum + Number(m.runtimeMinutes || 0),
                            0
                        ),
                };
            });

            setMovies((prev) =>
                prev.map((m) =>
                    m._id === movie._id
                        ? { ...m, watched: newWatched }
                        : m
                )
            );
        } catch (e) {
            setError(errorMessage(e));
        } finally {
            setUpdatingId("");
        }
    };

    const pct =
        plan && plan.total
            ? Math.round((plan.watched / plan.total) * 100)
            : 0;

    const selectedMovie = movies.find((m) => m._id === targetId);

    return (
        <div className="min-h-screen bg-[#080D1A] px-4 py-8 text-white ">
            <style>{EXTRA_CSS}</style>

            <div className="mx-auto max-w-7xl sm:px-8 lg:px-10 space-y-8">
                {/* Header */}
                <header className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#171433] via-[#11152B] to-[#0D1425] p-6 sm:p-9">
                    <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/15 text-purple-300">
                                <Clapperboard size={27} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    Rewatch Plan
                                </h1>
                                <p className="mt-2 max-w-md text-sm leading-6 text-gray-400 sm:text-base">
                                    Pick the movie you want to see next. We'll
                                    list what to watch first, in the right
                                    order.
                                </p>
                            </div>
                        </div>

                        {/* Selector */}
                        <div className="w-full lg:w-80">
                            <label
                                htmlFor="target"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Target movie
                            </label>
                            <div className="relative">
                                <Film
                                    size={18}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                                />
                                <select
                                    id="target"
                                    value={targetId}
                                    onChange={(e) =>
                                        setTargetId(e.target.value)
                                    }
                                    className="w-full appearance-none rounded-xl border border-white/10 bg-[#0B1220] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                                >
                                    <option value="">Select a movie…</option>
                                    {movies.map((m) => (
                                        <option key={m._id} value={m._id}>
                                            {m.title} ({m.releaseYear})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Error */}
                {error && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    >
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div
                        role="status"
                        className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111827] py-20"
                    >
                        <Loader2
                            className="mb-3 animate-spin text-purple-400"
                            size={30}
                        />
                        <p className="text-sm text-gray-400">
                            Building your watch order…
                        </p>
                    </div>
                )}

                {/* Empty state */}
                {!targetId && !loading && (
                    <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-[#111827]/60 px-5 py-20 text-center">
                        <Ticket size={38} className="mb-4 text-purple-400" />
                        <h2 className="text-lg font-semibold text-white">
                            Choose a movie to begin
                        </h2>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                            Your watch order and progress will appear here once
                            you select a target movie.
                        </p>
                    </div>
                )}

                {/* Dashboard */}
                {plan && !loading && (
                    <div className="rw-rise grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_340px]">
                        {/* Watch order: film strip */}
                        <section aria-labelledby="order-title">
                            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                                <h2
                                    id="order-title"
                                    className="text-xl font-bold"
                                >
                                    Watch order
                                </h2>
                                <span className="text-sm text-gray-500">
                                    {plan.total}{" "}
                                    {plan.total === 1 ? "movie" : "movies"}{" "}
                                    before{" "}
                                    <span className="font-medium text-purple-300">
                                        {selectedMovie?.title}
                                    </span>
                                </span>
                            </div>

                            {plan.total === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-[#111827] px-6 py-14 text-center">
                                    <PartyPopper
                                        size={40}
                                        className="mx-auto mb-4 text-green-400"
                                    />
                                    <h3 className="text-lg font-semibold text-white">
                                        Nothing to watch first
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {selectedMovie?.title} has no
                                        prerequisites. Press play whenever
                                        you're ready.
                                    </p>
                                </div>
                            ) : (
                                <ol className="flex rounded-2xl border border-white/10 bg-[#111827]">
                                    <div
                                        aria-hidden="true"
                                        className="rw-sprockets w-6 shrink-0 rounded-l-2xl bg-purple-500/70 sm:w-7"
                                    />

                                    <div className="min-w-0 flex-1 space-y-2.5 p-3 sm:p-4">
                                        {plan.items.map((m, i) => {
                                            const busy = updatingId === m._id;
                                            return (
                                                <li
                                                    key={m._id}
                                                    className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors sm:gap-4 sm:px-4 ${
                                                        m.watched
                                                            ? "border-green-500/15 bg-green-500/[0.04]"
                                                            : "border-white/5 bg-[#0B1220] hover:border-purple-500/40"
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-7 shrink-0 text-right text-xl font-bold ${
                                                            m.watched
                                                                ? "text-gray-600"
                                                                : "text-purple-400"
                                                        }`}
                                                    >
                                                        {i + 1}
                                                    </span>

                                                    <div className="min-w-0 flex-1">
                                                        <h3
                                                            className={`truncate text-sm font-semibold ${
                                                                m.watched
                                                                    ? "text-gray-500 line-through"
                                                                    : "text-gray-100"
                                                            }`}
                                                        >
                                                            {m.releaseYear
                                                                ? m.title
                                                                : m.title}
                                                        </h3>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {m.releaseYear},{" "}
                                                            {fmt(
                                                                Number(
                                                                    m.runtimeMinutes ||
                                                                        0
                                                                )
                                                            )}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleWatched(m)
                                                        }
                                                        disabled={busy}
                                                        aria-pressed={
                                                            !!m.watched
                                                        }
                                                        aria-label={`Mark ${
                                                            m.title
                                                        } as ${
                                                            m.watched
                                                                ? "unwatched"
                                                                : "watched"
                                                        }`}
                                                        className={`flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-60 ${
                                                            m.watched
                                                                ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                                                                : "bg-purple-500 text-white hover:bg-purple-400"
                                                        }`}
                                                    >
                                                        {busy ? (
                                                            <Loader2
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : m.watched ? (
                                                            <>
                                                                <Check
                                                                    size={16}
                                                                />
                                                                <span className="hidden sm:inline">
                                                                    Watched
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span>
                                                                Mark watched
                                                            </span>
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </div>

                                    <div
                                        aria-hidden="true"
                                        className="rw-sprockets w-6 shrink-0 rounded-r-2xl bg-purple-500/70 sm:w-7"
                                    />
                                </ol>
                            )}
                        </section>

                        {/* Sidebar */}
                        <aside className="space-y-5 lg:sticky lg:top-6">
                            {/* Target ticket */}
                            {selectedMovie && (
                                <div className="rw-ticket-notch bg-gradient-to-br from-purple-500 to-indigo-500 p-5 text-white">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                                        <Play size={15} fill="currentColor" />
                                        Up next
                                    </div>
                                    <h3 className="mt-2 text-2xl font-bold leading-tight">
                                        {selectedMovie.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-white/70">
                                        {selectedMovie.releaseYear},{" "}
                                        {fmt(
                                            Number(
                                                selectedMovie.runtimeMinutes ||
                                                    0
                                            )
                                        )}
                                    </p>
                                </div>
                            )}

                            {/* Progress */}
                            <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
                                <div className="flex items-center gap-5">
                                    <div
                                        role="img"
                                        aria-label={`${pct}% watched`}
                                        className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
                                        style={{
                                            background: `conic-gradient(#8B5CF6 ${
                                                pct * 3.6
                                            }deg, #252B3C 0deg)`,
                                        }}
                                    >
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#111827]">
                                            <span className="text-2xl font-bold">
                                                {pct}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-3xl font-bold">
                                            {plan.watched}
                                            <span className="text-gray-500">
                                                /{plan.total}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            movies watched
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                                    <Clock3
                                        size={20}
                                        className="shrink-0 text-purple-400"
                                    />
                                    <p className="text-sm text-gray-400">
                                        <span className="text-lg font-bold text-white">
                                            {fmt(plan.remaining)}
                                        </span>{" "}
                                        of watching left
                                    </p>
                                </div>
                            </div>

                            {/* Completion */}
                            {plan.total > 0 && plan.watched === plan.total && (
                                <div
                                    role="status"
                                    className="rw-rise rounded-2xl border border-green-500/20 bg-green-500/10 p-5"
                                >
                                    <PartyPopper
                                        size={24}
                                        className="mb-2 text-green-400"
                                    />
                                    <h3 className="font-semibold text-green-300">
                                        You're all caught up
                                    </h3>
                                    <p className="mt-1 text-sm leading-5 text-green-300/70">
                                        Every prerequisite is watched. Time for{" "}
                                        {selectedMovie?.title}.
                                    </p>
                                </div>
                            )}
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}