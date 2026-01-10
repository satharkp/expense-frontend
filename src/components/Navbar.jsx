import LogoutButton from "./LogoutButton";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Left: App name + nav links */}
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Expense Tracker
          </h1>

          <div className="flex items-center gap-4">
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
                location.pathname === "/expenses"
                  ? "text-sky-400"
                  : "text-gray-300 hover:text-white"
              }`} to="/categories">Categories</Link>
            <Link
              to="/expenses"
              className={`text-sm font-medium ${
                location.pathname === "/expenses"
                  ? "text-sky-400"
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

        {/* Right: actions */}
        <div className="flex items-center gap-4">
          <LogoutButton />
        </div>

      </div>
    </nav>
  );
}
