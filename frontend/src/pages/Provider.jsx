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

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(
          `/movies/provider/${encodeURIComponent(name)}?category=${category}`
        );
        setData(res.data || { categorized: {}, results: [] });
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
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {name} — Popular {categoryLabels[category] || "Content"}
          </h1>
          <p className="text-gray-400">
            Discover the best {categoryLabels[category] || "content"} available
            on {name}
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading content...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && Object.keys(data.categorized || {}).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No titles found for this provider in this category.
            </p>
          </div>
        )}

        <div className="space-y-12">
          {Object.entries(data.categorized || {}).map(([genre, items]) => (
            <section key={genre}>
              <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-2">
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
          Object.keys(data.categorized || {}).length === 0 &&
          data.results &&
          data.results.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white border-b border-zinc-800 pb-2">
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
