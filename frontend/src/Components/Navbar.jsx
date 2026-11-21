
import React, { useState } from "react";
import { NavLink, Link } from "react-router";
import {
  Clapperboard,
  Film,
  ListChecks,
  Ticket,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  {
    name: "Home",
    path: "/",
    icon: Film,
  },
  {
    name: "Movies",
    path: "/movies",
    icon: Film,
  },
  {
    name: "Rewatch Plan",
    path: "/rewatch-plan",
    icon: ListChecks,
  },
  {
    name: "Booking",
    path: "/booking",
    icon: Ticket,
  },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-purple-500/15 text-purple-400"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A1020]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/20">
            <Clapperboard size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Doomsday<span className="text-purple-400">Ready</span>
            </h1>
            <p className="text-[10px] font-medium tracking-[2px] text-slate-500">
              MOVIE & BOOKING MANAGER
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={navLinkClass}
              >
                <Icon size={17} />
                {link.name}
              </NavLink>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/5 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-white/10 transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 px-4 py-3">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={() => setMenuOpen(false)}
                className={navLinkClass}
              >
                <Icon size={18} />
                {link.name}
              </NavLink>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
