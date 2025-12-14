import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import MovieDetailModal from "../components/MovieDetailModal";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await api.get("/history");
        setHistory(res.data || []);
      } catch (e) {
        console.error("Failed to load history", e);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const rerun = async (session) => {
    if (!session?.filters) {
      alert("No filters saved for this recommendation");
      return;
    }

    try {
      const res = await api.post("/movies/recommend", session.filters);
      localStorage.setItem(
        "last_recommendations",
        JSON.stringify(res.data.results || [])
      );
      navigate("/recommendations");
    } catch (e) {
      console.error(e);
      alert("Could not rerun recommendation");
    }
  };

  return (
    <div className="bg-black dark:bg-gray-50 min-h-screen text-white dark:text-gray-900 transition-colors">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
          Your Past Recommendations
        </h1>
        <p className="text-gray-400 dark:text-gray-600 mb-8">
          View and rerun your previous recommendation sessions
        </p>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-600">Loading history...</p>
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-600 text-lg mb-4">
              No recommendations yet.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">
              Get started by selecting your preferences!
            </p>
            <button
              onClick={() => navigate("/preferences")}
              className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700 transition-colors text-white"
            >
              Go to Preferences
            </button>
          </div>
        )}

        <div className="space-y-12">
          {history.map((session) => (
            <div
              key={session._id}
              className="border-b border-zinc-800 dark:border-gray-300 pb-8 last:border-b-0"
            >
              {/* FILTER INFO */}
              <div className="mb-6 p-4 bg-zinc-900 dark:bg-gray-200 rounded-lg">
                <div className="flex flex-wrap gap-4 text-sm text-gray-400 dark:text-gray-600 mb-2">
                  <span>
                    Type:{" "}
                    <b className="text-white dark:text-gray-900">
                      {session.filters?.category || "N/A"}
                    </b>
                  </span>
                  <span>
                    Language:{" "}
                    <b className="text-white dark:text-gray-900">
                      {session.filters?.language || "N/A"}
                    </b>
                  </span>
                  <span>
                    Genre:{" "}
                    <b className="text-white dark:text-gray-900">
                      {session.filters?.genre || "N/A"}
                    </b>
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Recommended on{" "}
                  {new Date(session.createdAt).toLocaleString()}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mb-6">
                <button
                  onClick={() => rerun(session)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors text-white"
                >
                  Rerun This Recommendation
                </button>
              </div>

              {/* MOVIE GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {session.results?.map((movie) => (
                  <div
                    key={`${movie.mediaType}-${movie.id}`}
                    onClick={() => setSelected(movie)}
                    className="cursor-pointer"
                  >
                    <MovieCard movie={movie} reason={movie.reason} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <MovieDetailModal
          item={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
