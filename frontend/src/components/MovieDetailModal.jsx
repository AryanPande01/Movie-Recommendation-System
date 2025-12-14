import { useEffect, useState } from "react";
import api from "../api/api";

export default function MovieDetailModal({ item, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!item) return;
    let canceled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/movies/${item.mediaType}/${item.id}`);
        if (!canceled) setDetail(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    load();
    return () => {
      canceled = true;
    };
  }, [item]);

  if (!item) return null;

  const displayData = detail || item;
  const cast = displayData.cast || [];
  const providers = displayData.providers || [];
  const genres = displayData.genres || [];
  const runtime = displayData.runtime
    ? `${displayData.runtime} min`
    : "N/A";
  const releaseDate = displayData.releaseDate
    ? new Date(displayData.releaseDate).getFullYear()
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-lg overflow-y-auto max-h-[90vh] w-full max-w-5xl shadow-2xl border border-zinc-700"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && !detail && (
          <div className="p-12 text-center text-gray-400">
            Loading details...
          </div>
        )}

        {!loading && (
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={displayData.poster || item.poster}
                  alt={displayData.title || item.title}
                  className="w-full md:w-64 h-auto rounded-lg shadow-xl"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/256x384?text=No+Image";
                  }}
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {displayData.title || item.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 items-center text-sm text-gray-400">
                      {releaseDate && <span>{releaseDate}</span>}
                      {releaseDate && runtime !== "N/A" && <span>•</span>}
                      {runtime !== "N/A" && <span>{runtime}</span>}
                      {genres.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{genres.slice(0, 3).join(", ")}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white text-2xl font-bold px-3 py-1 rounded hover:bg-zinc-700 transition-colors"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* Overview */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {displayData.overview || item.overview || item.description || "No description available."}
                </p>

                {/* Providers */}
                {providers.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Available On
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {providers.map((p, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm border border-red-600/30"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cast */}
                {cast.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Cast
                    </h3>
                    <div className="space-y-2">
                      {cast.slice(0, 8).map((c, i) => (
                        <div
                          key={i}
                          className="text-sm text-gray-300 flex items-center gap-2"
                        >
                          <span className="text-red-400">•</span>
                          <span>
                            {typeof c === "string"
                              ? c
                              : `${c.name}${c.character ? ` as ${c.character}` : ""}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Why Recommended */}
                {(item.reason || displayData.reason) && (
                  <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Why This Was Recommended
                    </h4>
                    <p className="text-sm text-blue-200">
                      {item.reason || displayData.reason}
                    </p>
                  </div>
                )}

                {/* Next Picks */}
                {item.nextPicks && item.nextPicks.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-white mb-3">
                      Your Next Picks
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {item.nextPicks.map((p, i) => (
                        <div
                          key={i}
                          className="bg-zinc-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => {
                            // Navigate to this pick's details
                            window.location.href = `#movie-${p.id}`;
                          }}
                        >
                          <img
                            src={p.poster}
                            alt={p.title}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/150x200?text=No+Image";
                            }}
                          />
                          <div className="p-2">
                            <div className="text-xs font-medium text-white truncate">
                              {p.title}
                            </div>
                            {p.providers && p.providers.length > 0 && (
                              <div className="text-[10px] text-gray-400 truncate mt-1">
                                {p.providers.slice(0, 1).join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating */}
                {displayData.rating && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-gray-300">
                      {displayData.rating.toFixed(1)} / 10
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
