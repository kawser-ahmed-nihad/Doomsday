
import { useCallback, useEffect, useState } from "react";
import {
  Ticket,
  Building2,
  Users,
  Armchair,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Clapperboard,
  Sparkles,
  Layers3,
  Clock3,
  X,
} from "lucide-react";

import AddCinemaForm from "../../Components/AddCinemaForm";

import {
  getCinemas,
  createCinema,
  getBooking,
  errorMessage,
} from "../../api";

// -----------------------------
// Helper Components
// -----------------------------

function ErrorBox({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
        <Icon size={20} />
      </div>

      <p className="text-sm text-slate-400">{label}</p>
      <h3 className="mt-1 text-2xl font-bold text-white">{value}</h3>
    </div>
  );
}



// -----------------------------
// Booking Page
// -----------------------------

export default function Booking() {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [groupSize, setGroupSize] = useState(6);

  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [quoting, setQuoting] = useState(false);

  const [error, setError] = useState("");
  const [showCinemaModal, setShowCinemaModal] = useState(false);

  // Load Cinemas
  const loadCinemas = useCallback(async () => {
    try {
      setError("");

      const response = await getCinemas();

      const list = Array.isArray(response)
        ? response
        : response?.cinemas ?? response?.data?.cinemas ?? [];

      setCinemas(list);

      setSelectedCinema((current) => {
        if (current && list.some((cinema) => cinema._id === current)) {
          return current;
        }

        return list[0]?._id ?? "";
      });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCinemas();
  }, [loadCinemas]);

  const currentCinema = cinemas.find(
    (cinema) => cinema._id === selectedCinema
  );

  // Booking Quote
  async function handleQuote(event) {
    event.preventDefault();

    setError("");
    setBooking(null);

    const size = Number(groupSize);

    if (!selectedCinema) {
      setError("Please select a cinema.");
      return;
    }

    if (!Number.isInteger(size) || size < 1 || size > 10000) {
      setError("Group size must be between 1 and 10,000.");
      return;
    }

    try {
      setQuoting(true);

      const response = await getBooking(selectedCinema, size);

      setBooking(response?.data ?? response);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setQuoting(false);
    }
  }

  // Normalize bundle response
  const bundleData =
    booking?.bundles ??
    booking?.breakdown ??
    booking?.combination ??
    {};

  const bundleEntries = Array.isArray(bundleData)
    ? bundleData.map((item) => [
        item.bundleSize ?? item.size,
        item.count ?? item.quantity,
      ])
    : Object.entries(bundleData);

  const possible = booking?.possible === true;

  return (
    <div className="min-h-screen bg-[#0b0c1b] px-4 py-10 text-white ">
      <div className="mx-auto max-w-7xl sm:px-8 lg:px-10">

        {/* Hero */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            <Sparkles size={16} />
            Watch Party Planner
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Cinema Booking
                <span className="text-purple-400"> Quote</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Calculate the minimum number of cinema bundles needed
                for your group.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCinemaModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 transition hover:bg-purple-500"
            >
              <Plus size={18} />
              Add New Cinema
            </button>
          </div>
        </div>

        {/* Dashboard */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main Booking Section */}
          <div className="space-y-6 lg:col-span-2">

            <div className="rounded-3xl border border-white/10 bg-[#15162b] p-5 shadow-xl shadow-black/10 sm:p-7">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">
                  <Ticket size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Plan Your Watch Party
                  </h2>

                  <p className="text-sm text-slate-400">
                    Enter your group details to get a quote.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
                  <Loader2 size={22} className="animate-spin" />
                  Loading cinemas...
                </div>
              ) : cinemas.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
                  <Building2
                    size={35}
                    className="mx-auto mb-3 text-slate-500"
                  />

                  <h3 className="font-semibold">
                    No cinemas available
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Add a cinema to start calculating quotes.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowCinemaModal(true)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold hover:bg-purple-500"
                  >
                    <Plus size={17} />
                    Add Cinema
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuote} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Select Cinema
                    </label>

                    <select
                      value={selectedCinema}
                      onChange={(event) => {
                        setSelectedCinema(event.target.value);
                        setBooking(null);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-[#0d0e20] px-4 py-3 text-white outline-none transition focus:border-purple-500"
                    >
                      {cinemas.map((cinema) => (
                        <option key={cinema._id} value={cinema._id}>
                          {cinema.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Group Size
                    </label>

                    <div className="relative">
                      <Users
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300"
                      />

                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={groupSize}
                        onChange={(event) => {
                          setGroupSize(event.target.value);
                          setBooking(null);
                        }}
                        className="w-full rounded-xl border border-white/10 bg-[#0d0e20] py-3 pl-12 pr-4 text-white outline-none transition focus:border-purple-500"
                      />
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Enter a group size between 1 and 10,000.
                    </p>
                  </div>

                  <ErrorBox message={error} />

                  <button
                    type="submit"
                    disabled={quoting || !selectedCinema}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-purple-900/20 transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {quoting ? (
                      <>
                        <Loader2 size={19} className="animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator size={19} />
                        Calculate Booking Quote
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Quote Result */}
            {booking && (
              <div className="rounded-3xl border border-white/10 bg-[#15162b] p-5 sm:p-7">
                {possible ? (
                  <>
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                        <CheckCircle2 size={24} />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold">
                          Quote Calculated!
                        </h2>

                        <p className="text-sm text-slate-400">
                          Exact bundle combination found.
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <StatCard
                        icon={Users}
                        label="Group Size"
                        value={booking.groupSize ?? groupSize}
                      />

                      <StatCard
                        icon={Layers3}
                        label="Total Bundles"
                        value={booking.totalBundles ?? 0}
                      />
                    </div>

                    <h3 className="mb-4 font-semibold text-white">
                      Bundle Breakdown
                    </h3>

                    <div className="space-y-3">
                      {bundleEntries.map(([size, count]) => (
                        <div
                          key={size}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                              <Armchair size={19} />
                            </div>

                            <div>
                              <p className="font-semibold">
                                {size} Seats Bundle
                              </p>

                              <p className="text-xs text-slate-500">
                                Bundle size
                              </p>
                            </div>
                          </div>

                          <span className="text-lg font-bold text-purple-300">
                            × {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-5 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                      <AlertCircle size={28} />
                    </div>

                    <h2 className="text-xl font-bold">
                      No Exact Combination
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                      {booking.message ||
                        "This group size cannot be matched exactly with the available bundle sizes."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Cinema Details */}
            <div className="rounded-3xl border border-white/10 bg-[#15162b] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <Building2 className="text-purple-300" size={22} />

                <h2 className="text-lg font-bold">
                  Cinema Details
                </h2>
              </div>

              {currentCinema ? (
                <>
                  <h3 className="text-xl font-bold">
                    {currentCinema.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Available bundle sizes
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentCinema.bundleSizes?.map((size) => (
                      <span
                        key={size}
                        className="rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-sm font-semibold text-purple-300"
                      >
                        {size} Seats
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        Total bundle types
                      </span>

                      <span className="font-semibold text-white">
                        {currentCinema.bundleSizes?.length ?? 0}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-400">
                  Select a cinema to view its details.
                </p>
              )}
            </div>

            {/* How It Works */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/30 to-[#15162b] p-5 sm:p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                <Clapperboard size={22} />
              </div>

              <h2 className="text-lg font-bold">
                How It Works
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                The system finds the minimum number of bundles needed
                to match your group size exactly.
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <Users
                    size={18}
                    className="mt-0.5 shrink-0 text-purple-300"
                  />

                  <p className="text-sm text-slate-300">
                    Enter your group size.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Building2
                    size={18}
                    className="mt-0.5 shrink-0 text-purple-300"
                  />

                  <p className="text-sm text-slate-300">
                    Choose an available cinema.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Calculator
                    size={18}
                    className="mt-0.5 shrink-0 text-purple-300"
                  />

                  <p className="text-sm text-slate-300">
                    Get the minimum bundle combination.
                  </p>
                </div>
              </div>
            </div>

            {/* Small Info */}
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Clock3
                size={19}
                className="mt-0.5 shrink-0 text-purple-300"
              />

              <p className="text-xs leading-5 text-slate-400">
                This feature calculates a booking quote only. It does
                not create an actual reservation or process payments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Cinema Modal */}
      <AddCinemaForm
        isOpen={showCinemaModal}
        onClose={() => setShowCinemaModal(false)}
        onCreated={loadCinemas}
      />
    </div>
  );
}
