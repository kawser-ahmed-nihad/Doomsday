
import React from "react";
import {
  Clapperboard,
  Film,
  ListChecks,
  Ticket,
  Code2,
} from "lucide-react";
import { Link } from "react-router";
import { FaGithub } from "react-icons/fa";

const quickLinks = [
  { name: "Movies", path: "/" },
  { name: "Rewatch Plan", path: "/rewatch-plan" },
  { name: "Booking", path: "/booking" },
];

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-r from-[#0A1020] to-[#111A30]">

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">

            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
                <Clapperboard size={22} />
              </div>

              <h3 className="text-2xl font-extrabold text-white">
                Doomsday<span className="text-purple-400">Ready</span>
              </h3>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
              Manage your movies, organize your rewatch order, and calculate
              cinema bundle requirements with Doomsday Ready.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <Code2 size={16} className="text-purple-400" />
              <span>Made for movie lovers. Built for better watch nights.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-base font-bold text-white">
              Quick Links
            </h4>

            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-slate-400 transition hover:text-purple-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="mb-4 text-base font-bold text-white">
              Features
            </h4>

            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Film size={15} className="text-purple-400" />
                Movie Management
              </li>

              <li className="flex items-center gap-2 text-sm text-slate-400">
                <ListChecks size={15} className="text-purple-400" />
                Rewatch Planning
              </li>

              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Ticket size={15} className="text-purple-400" />
                Cinema Booking Quote
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Doomsday Ready. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <FaGithub size={18} />
            <span>Built with React & Node.js</span>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
