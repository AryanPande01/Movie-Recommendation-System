import api from "../api/api";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import MovieDetailModal from "../components/MovieDetailModal";

export default function Provider() {
  const { name } = useParams();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "movie";

  const [data, setData] = useState({ categorized: {}, results: [] });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setMessage(null);
      try {
        const res = await api.get(
          `/movies/provider/${encodeURIComponent(name)}?category=${category}`
        );
        const responseData = res.data || { categorized: {}, results: [] };
        
        // Check for coming soon message
        if (responseData.message) {
          setMessage(responseData.message);
        }
        
        setData(responseData);
      } catch (e) {
        console.error(e);
        setError("Failed to load content. Please try again.");
        setData({ categorized: {}, results: [] });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [name, category]);

  const categoryLabels = {
    movie: "Movies",
    series: "Web Series",
    tv: "Web Series",
    documentary: "Documentaries",
    podcast: "Podcasts",
  };

  return (
    <div className="bg-black dark:bg-gray-50 min-h-screen text-white dark:text-gray-900 transition-colors">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white dark:text-gray-900">
            {name} — Popular {categoryLabels[category] || "Content"}
          </h1>
          <p className="text-gray-400 dark:text-gray-600">
            Discover the best {categoryLabels[category] || "content"} available
            on {name}
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-600">Loading content...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 dark:text-red-600">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-blue-900/30 dark:bg-blue-100 border border-blue-700 dark:border-blue-300 rounded-lg">
            <p className="text-blue-300 dark:text-blue-700 text-center text-lg">
              {message}
            </p>
          </div>
        )}

        {!loading && !error && Object.keys(data.categorized || {}).length === 0 && !message && (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-600">
              No titles found for this provider in this category. Try a different category.
            </p>
          </div>
        )}

        <div className="space-y-12">
          {Object.entries(data.categorized || {}).map(([genre, items]) => (
            <section key={genre}>
              <h2 className="text-2xl font-semibold mb-4 text-white dark:text-gray-900 border-b border-zinc-800 dark:border-gray-300 pb-2">
                {genre}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {items.map((item) => (
                  <div
                    key={`${item.mediaType}-${item.id}`}
                    onClick={() => setSelected(item)}
                    className="cursor-pointer transform hover:scale-105 transition-transform"
                  >
                    <MovieCard movie={item} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Fallback: Show all results if no categorization */}
        {!loading &&
          !error &&
          !message &&
          Object.keys(data.categorized || {}).length === 0 &&
          data.results &&
          data.results.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white dark:text-gray-900 border-b border-zinc-800 dark:border-gray-300 pb-2">
                All Content
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {data.results.map((item) => (
                  <div
                    key={`${item.mediaType}-${item.id}`}
                    onClick={() => setSelected(item)}
                    className="cursor-pointer transform hover:scale-105 transition-transform"
                  >
                    <MovieCard movie={item} />
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {selected && (
        <MovieDetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
