import api from "../api/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import MovieDetailModal from "../components/MovieDetailModal";

export default function Recommendations({ initialResults = [] }) {
  const navigate = useNavigate();
  const [results, setResults] = useState(
    initialResults.length
      ? initialResults
      : (() => {
          try {
            return JSON.parse(localStorage.getItem("last_recommendations") || "[]");
          } catch {
            return [];
          }
        })()
  );
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Refresh from localStorage if empty
    if (results.length === 0) {
      try {
        const stored = JSON.parse(
          localStorage.getItem("last_recommendations") || "[]"
        );
        if (stored.length > 0) {
          setResults(stored);
        }
      } catch (e) {
        console.error("Error parsing stored recommendations:", e);
      }
    }
  }, [results.length]);

  const openDetail = async (item) => {
    try {
      setLoading(true);
      const res = await api.get(`/movies/${item.mediaType}/${item.id}`);
      setSelected(res.data);
    } catch (e) {
      console.error(e);
      // Fallback to item data if API fails
      setSelected(item);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            Your Recommendations
          </h1>
          {results.length > 0 && (
            <span className="text-gray-400">
              {results.length} recommendations
            </span>
          )}
        </div>

        {results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">
              No recommendations found.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Please select your preferences to get personalized
              recommendations.
            </p>
            <button
              onClick={() => navigate("/preferences")}
              className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Preferences
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((r) => (
            <div
              key={`${r.mediaType}-${r.id}`}
              onClick={() => openDetail(r)}
              className="cursor-pointer transform hover:scale-105 transition-transform"
            >
              <MovieCard movie={r} reason={r.reason} />
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
