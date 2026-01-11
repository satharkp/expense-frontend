import { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Left: App name + nav links */}
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className="text-xl font-bold tracking-tight text-white hover:text-sky-400 transition"
          >
            Expense Tracker
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/dashboard"
              className={`text-sm font-medium ${
                location.pathname === "/dashboard"
                  ? "text-sky-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link className={`text-sm font-medium ${
              location.pathname === "/categories"
                ? "text-sky-400"
                : "text-gray-300 hover:text-white"
            }`} to="/categories">Categories</Link>
            <Link
              to="/expenses"
              className={`text-sm font-medium ${
                location.pathname === "/expenses"
                  ? "text-red-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Expenses
            </Link>

            <Link
              to="/income"
              className={`text-sm font-medium ${
                location.pathname === "/income"
                  ? "text-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Income
            </Link>
          </div>
        </div>

        {/* Hamburger for mobile */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-300 hover:text-white focus:outline-none transition"
        >
          {open ? "✕" : "☰"}
        </button>

        {/* Right: actions */}
        <div className="hidden md:flex items-center gap-4">
          <LogoutButton />
        </div>

      </div>

      <div
        className={`md:hidden border-t border-gray-800 bg-gray-900 px-4 overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        <div className="space-y-1">
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              location.pathname === "/dashboard"
                ? "bg-sky-600/20 text-sky-400"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/categories"
            onClick={() => setOpen(false)}
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              location.pathname === "/categories"
                ? "bg-sky-600/20 text-sky-400"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Categories
          </Link>

          <Link
            to="/expenses"
            onClick={() => setOpen(false)}
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              location.pathname === "/expenses"
                ? "bg-sky-600/20 text-sky-400"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Expenses
          </Link>

          <Link
            to="/income"
            onClick={() => setOpen(false)}
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              location.pathname === "/income"
                ? "bg-sky-600/20 text-sky-400"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            Income
          </Link>
        </div>
        <div className="pt-3 mt-3 border-t border-gray-800">
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
