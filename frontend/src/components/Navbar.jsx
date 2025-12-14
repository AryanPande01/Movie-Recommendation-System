import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { key: "movie", label: "Movies" },
    { key: "series", label: "Web Series" },
    { key: "documentary", label: "Documentary" },
  ];

  const providers = [
    "Netflix",
    "Amazon Prime Video",
    "Disney+",
    "Hotstar",
    "Hulu",
    "HBO Max",
    "Paramount+",
    "Apple TV+",
    "Peacock",
    "Crunchyroll",
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("last_recommendations");
    navigate("/login");
  };

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/90 dark:bg-white/90 border-b border-zinc-800 dark:border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo + Categories */}
          <div className="flex items-center gap-6 md:gap-8">
            <h1
              className="text-2xl md:text-3xl font-bold text-red-500 cursor-pointer hover:text-red-600 transition-colors"
              onClick={() => navigate("/dashboard")}
            >
              MovieVerse
            </h1>

            <div className="hidden md:flex gap-4">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => navigate(`/browse?category=${c.key}`)}
                  className={`text-sm font-medium transition-colors px-2 py-1 rounded ${
                    location.search.includes(c.key)
                      ? "text-white dark:text-gray-900 bg-red-600/20 border-b-2 border-red-500"
                      : "text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Providers + Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Provider buttons - hidden on mobile */}
            <div className="hidden lg:flex gap-2 flex-wrap">
              {providers.slice(0, 4).map((p) => (
                <button
                  key={p}
                  onClick={() =>
                    navigate(`/provider/${encodeURIComponent(p)}`)
                  }
                  className="px-3 py-1 rounded-full text-xs bg-zinc-800 dark:bg-gray-200 hover:bg-zinc-700 dark:hover:bg-gray-300 text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors border border-zinc-700 dark:border-gray-300"
                >
                  {p}
                </button>
              ))}
            </div>

            <Link
              to="/history"
              className="text-sm text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors hidden md:block px-3 py-1 rounded hover:bg-zinc-800 dark:hover:bg-gray-200"
            >
              History
            </Link>

            <Link
              to="/preferences"
              className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors hidden md:block font-semibold text-white"
            >
              Preferences
            </Link>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-sm text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors px-3 py-1 rounded hover:bg-zinc-800 dark:hover:bg-gray-200 hidden md:block"
              >
                Logout
              </button>
            )}

            <ThemeToggle />
          </div>
        </div>

        {/* Mobile menu - Provider buttons */}
        <div className="lg:hidden pb-4 flex flex-wrap gap-2">
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => navigate(`/provider/${encodeURIComponent(p)}`)}
              className="px-3 py-1 rounded-full text-xs bg-zinc-800 dark:bg-gray-200 hover:bg-zinc-700 dark:hover:bg-gray-300 text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors border border-zinc-700 dark:border-gray-300"
            >
              {p}
            </button>
          ))}
          <Link
            to="/history"
            className="px-3 py-1 rounded-full text-xs bg-zinc-800 dark:bg-gray-200 hover:bg-zinc-700 dark:hover:bg-gray-300 text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors border border-zinc-700 dark:border-gray-300"
          >
            History
          </Link>
          <Link
            to="/preferences"
            className="px-3 py-1 rounded-full text-xs bg-red-600 hover:bg-red-700 text-white transition-colors font-semibold"
          >
            Preferences
          </Link>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-full text-xs bg-zinc-800 dark:bg-gray-200 hover:bg-zinc-700 dark:hover:bg-gray-300 text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors border border-zinc-700 dark:border-gray-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
