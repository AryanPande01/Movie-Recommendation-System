export default function MovieCard({ movie, reason, onClick }) {
  // Support both legacy shape and TMDB shape
  const title =
    movie.title ||
    movie.name ||
    movie.title_long ||
    movie.original_title ||
    "Untitled";
  const poster =
    movie.poster ||
    movie.cover ||
    movie.poster_path ||
    "https://via.placeholder.com/300x450?text=No+Image";
  const overview = movie.overview || movie.description || movie.synopsis || "";
  const providers = movie.providers || (movie.ott ? [movie.ott] : []);
  const metaLine = movie.genre
    ? `${movie.genre} • ${movie.language || ""}`
    : movie.mediaType || movie.duration
    ? `${movie.mediaType || ""} ${movie.duration ? "• " + movie.duration : ""}`
    : "";

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg overflow-hidden shadow-2xl hover:scale-[1.03] transform transition-all duration-200 border border-zinc-700 hover:border-red-500/50 group"
    >
      <div className="relative">
        <img
          src={poster}
          alt={title}
          className="h-80 w-full object-cover group-hover:brightness-110 transition-all"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />
        {providers && providers.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            {providers.slice(0, 3).map((p, i) => (
              <span
                key={i}
                className="bg-black/80 backdrop-blur-sm text-xs px-2 py-1 rounded text-white border border-white/20"
              >
                {p}
              </span>
            ))}
          </div>
        )}
        {movie.runtime && (
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-xs px-2 py-1 rounded text-white">
            {movie.runtime} min
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-white truncate mb-1">
          {title}
        </h2>
        {metaLine && (
          <p className="text-sm text-gray-400 truncate mb-2">{metaLine}</p>
        )}

        {overview && (
          <p className="text-sm text-gray-300 mt-3 line-clamp-3 leading-relaxed">
            {overview}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          {reason ? (
            <p className="text-xs text-blue-400 line-clamp-1 flex-1 mr-2">
              {reason}
            </p>
          ) : (
            <div />
          )}
          {movie.rating && (
            <div className="flex items-center gap-1 text-xs text-yellow-400">
              <span>⭐</span>
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
