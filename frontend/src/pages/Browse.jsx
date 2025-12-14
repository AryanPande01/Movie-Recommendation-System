import api from "../api/api";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import MovieDetailModal from "../components/MovieDetailModal";

export default function Browse() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const initialCategory = query.get("category") || "movie";

  const [category, setCategory] = useState(initialCategory);
  const [language, setLanguage] = useState("english");
  const [genre, setGenre] = useState("");
  const [provider, setProvider] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState(null);

  const providers = [
    "Netflix",
    "Amazon Prime Video",
    "Disney+",
    "Hotstar",
    "Hulu",
    "HBO Max",
  ];
  const languages = ["English", "Hindi", "Marathi", "Spanish", "German"];
  const genres = [
    "romantic",
    "romance",
    "sci-fi",
    "fiction",
    "thriller",
    "comedy",
    "action",
    "documentary",
    "drama",
    "horror",
    "adventure",
    "fantasy",
  ];

  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    // Update category when URL changes
    setCategory(initialCategory);
  }, [initialCategory]);

  const handleRecommend = async () => {
    setMessage(null);
    if (!isAuthenticated) {
      setMessage("Please log in to get personalized recommendations.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const body = {
        category: category === "series" ? "series" : category,
        language: language.toLowerCase(),
        genre: genre || undefined,
        region: "US",
      };

      const res = await api.post("/movies/recommend", body);

      if (!res || !res.data) {
        console.error("No response body from /movies/recommend", res);
        setMessage("Recommendation service returned no data.");
        setResults([]);
        return;
      }

      const r = res.data.results || [];
      setResults(r);
      localStorage.setItem("last_recommendations", JSON.stringify(r));

      // Update URL
      const params = new URLSearchParams({
        category,
        language,
        ...(genre && { genre }),
      }).toString();
      navigate(`/browse?${params}`, { replace: true });

      if (r.length === 0) {
        setMessage("No matches found for your filters. Try different options.");
      } else {
        setMessage(null);
      }
    } catch (err) {
      console.error("Recommend error:", err.response || err.message || err);
      const status = err?.response?.status;
      if (status === 401) {
        setMessage("Authentication required — please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setMessage(
        err?.response?.data?.message ||
          "Failed to fetch recommendations. Please try again."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const mostRecommended = results.slice(0, 6);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 bg-zinc-900 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Filter & Preferences</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 bg-zinc-800 rounded text-white"
              >
                <option value="movie">Movies</option>
                <option value="series">Web Series</option>
                <option value="documentary">Documentary</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 bg-zinc-800 rounded text-white"
              >
                {languages.map((l) => (
                  <option key={l} value={l.toLowerCase()}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full p-2 bg-zinc-800 rounded text-white"
              >
                <option value="">Any Genre</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Provider (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {providers.map((p) => (
                  <button
                    key={p}
                    onClick={() => setProvider(p === provider ? "" : p)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      provider === p
                        ? "bg-red-500 text-white"
                        : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRecommend}
              disabled={loading || !isAuthenticated}
              className={`w-full py-3 rounded font-semibold transition-colors ${
                isAuthenticated && !loading
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-zinc-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Finding picks..." : "Get Recommendations"}
            </button>

            {message && (
              <div className="mt-4 p-3 text-sm text-yellow-300 bg-yellow-900/20 rounded">
                {message}
              </div>
            )}

            {mostRecommended.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-semibold mb-3">Most Recommended</h3>
                <div className="space-y-3">
                  {mostRecommended.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-zinc-800 p-2 rounded"
                      onClick={() => setSelected(m)}
                    >
                      <img
                        src={m.poster}
                        alt={m.title}
                        className="h-16 w-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/48x64?text=No+Image";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {m.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {m.providers?.slice(0, 1).join(", ") || "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              {category === "series"
                ? "Web Series"
                : category.charAt(0).toUpperCase() + category.slice(1)}{" "}
              Recommendations
            </h1>
            {results.length > 0 && (
              <span className="text-gray-400">
                {results.length} results found
              </span>
            )}
          </div>

          {results.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                No recommendations yet.
              </p>
              <p className="text-gray-500 text-sm">
                Choose your filters and click "Get Recommendations" to see
                personalized suggestions.
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading recommendations...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((movie) => (
              <div
                key={`${movie.mediaType}-${movie.id}`}
                onClick={() => setSelected(movie)}
                className="cursor-pointer"
              >
                <MovieCard movie={movie} reason={movie.reason} />
              </div>
            ))}
          </div>
        </main>
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
