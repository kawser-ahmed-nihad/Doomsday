
import React from "react";
import { Link } from "react-router";
import {
  Film,
  Clapperboard,
  Play,
  Sparkles,
  ArrowRight,
  Ticket,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#0A1020] text-white">
      {/* Background Effects */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />
      <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-28 lg:px-10">

        {/* Left Content */}
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            <Sparkles size={16} />
            Your personal movie planner
          </div>

          <h1 className="max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Every Great
            <span className="block text-purple-400">
              Watch Night
            </span>
            Starts With a Plan.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 sm:text-lg">
            Organize your favorite movies, follow the right watch order,
            and plan unforgettable movie nights with Doomsday Ready.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/#movies"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3.5 font-semibold text-white transition hover:bg-purple-700"
            >
              <Film size={19} />
              Explore Movies
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/rewatch-plan"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:border-purple-400/50 hover:bg-purple-500/10"
            >
              <Play size={18} />
              Create Watch Plan
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <div className="mb-2 flex items-center gap-2 text-purple-400">
                <Film size={20} />
                <span className="font-semibold">Movies</span>
              </div>
              <p className="text-sm text-slate-500">
                Manage your collection
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-purple-400">
                <Clapperboard size={20} />
                <span className="font-semibold">Watch Order</span>
              </div>
              <p className="text-sm text-slate-500">
                Never miss a prequel
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-purple-400">
                <Ticket size={20} />
                <span className="font-semibold">Watch Party</span>
              </div>
              <p className="text-sm text-slate-500">
                Plan group movie nights
              </p>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-[100px]" />

          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#1B2340] to-[#11182C] p-5 shadow-2xl shadow-purple-950/40 sm:p-7">

            {/* Top Bar */}
            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clapperboard className="text-purple-400" size={22} />
                <span className="font-bold tracking-wide">
                  DOOMSDAY READY
                </span>
              </div>

              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                Your Watchlist
              </span>
            </div>

            {/* Featured Movie Card */}
            <div className="relative flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-[#111827] p-6">
              <div className="absolute right-6 top-6 rounded-full border border-white/20 bg-white/10 p-4 backdrop-blur">
                <Film size={35} className="text-purple-200" />
              </div>

              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-white/10" />
              <div className="absolute -right-2 -top-2 h-32 w-32 rounded-full border border-white/10" />

              <span className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-purple-200">
                Featured Collection
              </span>

              <h2 className="text-3xl font-bold">
                Movie Universe
              </h2>

              <p className="mt-2 max-w-xs text-sm text-purple-100/70">
                Your movies. Your order. Your next adventure.
              </p>
            </div>

            {/* Watch Progress */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Your movie journey
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">
                    Ready to rewatch?
                  </h3>
                </div>

                <div className="rounded-xl bg-purple-500/15 p-3 text-purple-300">
                  <Play size={22} />
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400" />
              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>Build your watch plan</span>
                <span>Let's go</span>
              </div>
            </div>

            {/* Bottom Badge */}
            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Sparkles size={15} className="text-purple-400" />
              Make every movie night count
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
