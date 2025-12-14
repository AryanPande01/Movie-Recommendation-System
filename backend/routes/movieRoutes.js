import express from "express";
import fetch from "node-fetch";
import History from "../models/History.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const TMDB = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

const LANG = {
  english: "en",
  hindi: "hi",
  marathi: "mr",
  spanish: "es",
  german: "de",
  jerman: "de",
};

// Genre name to TMDB ID mapping
const GENRE_MAP = {
  // Movies
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  romantic: 10749,
  "sci-fi": 878,
  "science fiction": 878,
  thriller: 53,
  war: 10752,
  western: 37,
  fiction: 878,
};

const PROVIDER_MAP = {
  netflix: 8,
  "amazon prime video": 9,
  "prime video": 9,
  amazon: 9,
  disney: 337,
  "disney+": 337,
  hotstar: 337,
  hulu: 15,
  "hbo max": 384,
  hbomax: 384,
};

const PROVIDER_NAME_MAP = {
  8: "Netflix",
  9: "Amazon Prime Video",
  337: "Disney+",
  15: "Hulu",
  384: "HBO Max",
};

const tmdb = async (url, params = {}) => {
  const u = new URL(`${TMDB}${url}`);
  u.searchParams.set("api_key", process.env.TMDB_API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      u.searchParams.set(k, String(v));
    }
  });
  return fetch(u).then((r) => r.json());
};

// Helper to get genre ID
async function getGenreId(mediaType, genreName) {
  if (!genreName) return null;
  
  const normalized = genreName.toLowerCase().trim();
  if (GENRE_MAP[normalized]) {
    return GENRE_MAP[normalized];
  }
  
  // Try fetching from TMDB
  try {
    const list = await tmdb(`/genre/${mediaType}/list`, { language: "en-US" });
    const found = (list.genres || []).find(
      (g) => g.name.toLowerCase() === normalized
    );
    return found ? found.id : null;
  } catch (e) {
    return null;
  }
}

/* ================= RECOMMEND ================= */
router.post("/recommend", protect, async (req, res) => {
  try {
    const { category, language, genre, region = "US" } = req.body;

    if (category === "podcast") {
      return res.json({ results: [] });
    }

    const mediaType =
      category === "series" || category === "tv" || category === "webseries"
        ? "tv"
        : "movie";

    const langCode = LANG[(language || "").toLowerCase()] || undefined;
    const genreId = await getGenreId(mediaType, genre);

    const discoverParams = {
      language: "en-US",
      sort_by: "popularity.desc",
      page: 1,
    };

    if (genreId) {
      discoverParams.with_genres = String(genreId);
    }
    if (langCode) {
      discoverParams.with_original_language = langCode;
    }

    const discover = await tmdb(`/discover/${mediaType}`, discoverParams);
    const results = discover.results || [];

    // Enrich top results with details
    const top = results.slice(0, 20);

    const detailed = await Promise.all(
      top.map(async (item) => {
        try {
          const d = await tmdb(`/${mediaType}/${item.id}`, {
            append_to_response: "credits,watch/providers",
          });

          const providersForRegion =
            d["watch/providers"]?.results?.[region] || null;
          const providerList = [];
          
          if (providersForRegion) {
            ["flatrate", "rent", "buy", "ads"].forEach((k) => {
              if (providersForRegion[k]) {
                providersForRegion[k].forEach((p) => {
                  providerList.push(p.provider_name);
                });
              }
            });
          }

          const cast = (d.credits?.cast || [])
            .slice(0, 10)
            .map((c) => ({
              name: c.name,
              character: c.character || "",
            }));

          const runtime =
            d.runtime || d.episode_run_time?.[0] || null;
          const genres = (d.genres || []).map((g) => g.name);

          // Build recommendation reason
          const reasons = [];
          if (genre && genres.some((g) => g.toLowerCase().includes(genre.toLowerCase()))) {
            reasons.push(`matches your ${genre} preference`);
          }
          if (language) {
            reasons.push(`in ${language}`);
          }
          if (providerList.length > 0) {
            reasons.push(`available on ${providerList.slice(0, 2).join(", ")}`);
          }
          if (reasons.length === 0) {
            reasons.push(`popular ${category}`);
          }

          return {
            id: d.id,
            mediaType,
            title: d.title || d.name,
            overview: d.overview || "",
            runtime,
            poster: d.poster_path ? IMG + d.poster_path : null,
            cast,
            providers: Array.from(new Set(providerList)),
            genres,
            popularity: d.popularity || 0,
            reason: `Recommended because ${reasons.join(", ")}`,
            releaseDate: d.release_date || d.first_air_date || null,
          };
        } catch (e) {
          console.error(`Error fetching details for ${item.id}:`, e.message);
          return null;
        }
      })
    );

    const validResults = detailed.filter((r) => r !== null);

    // Add next picks for each item
    const final = validResults.map((r, i) => ({
      ...r,
      nextPicks: validResults
        .slice(i + 1, i + 4)
        .map((p) => ({
          id: p.id,
          title: p.title,
          poster: p.poster,
          providers: p.providers,
        })),
    }));

    // Save history
    try {
      await History.create({
        userId: req.user.id,
        filters: { category, language, genre, region },
        results: final.slice(0, 12),
      });
    } catch (e) {
      console.warn("Could not save history:", e.message);
    }

    // Update user preferences (non-blocking)
    (async () => {
      try {
        const user = await User.findById(req.user.id);
        if (user) {
          user.preferences = user.preferences || {
            genres: {},
            languages: {},
            providers: {},
          };
          const prefs = user.preferences;

          if (genre) {
            prefs.genres[genre] = (prefs.genres[genre] || 0) + 1;
          }
          if (language) {
            prefs.languages[language] = (prefs.languages[language] || 0) + 1;
          }

          const seenProviders = new Set();
          final.slice(0, 8).forEach((d) => {
            (d.providers || []).slice(0, 3).forEach((p) => {
              if (p) seenProviders.add(p);
            });
          });

          seenProviders.forEach((p) => {
            prefs.providers[p] = (prefs.providers[p] || 0) + 1;
          });

          user.preferences = prefs;
          await user.save();
        }
      } catch (e) {
        console.warn("Could not update user preferences:", e.message);
      }
    })();

    res.json({ results: final });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({
      message: "Recommendation failed",
      error: error.message,
    });
  }
});

/* ================= BROWSE ================= */
router.get("/browse", async (req, res) => {
  try {
    const { category = "movie", language, genre, page = 1 } = req.query;
    const mediaType =
      category === "series" || category === "tv" || category === "webseries"
        ? "tv"
        : "movie";

    const langCode = LANG[(language || "").toLowerCase()] || undefined;
    const genreId = await getGenreId(mediaType, genre);

    const params = {
      language: "en-US",
      sort_by: "popularity.desc",
      page: String(page),
    };

    if (genreId) {
      params.with_genres = String(genreId);
    }
    if (langCode) {
      params.with_original_language = langCode;
    }

    const discover = await tmdb(`/discover/${mediaType}`, params);

    res.json({
      results: (discover.results || []).slice(0, 40).map((m) => ({
        id: m.id,
        mediaType,
        title: m.title || m.name,
        overview: m.overview || "",
        poster: m.poster_path ? IMG + m.poster_path : null,
        popularity: m.popularity || 0,
      })),
      total: discover.total_results || 0,
    });
  } catch (error) {
    console.error("Browse error:", error);
    res.status(500).json({
      message: "Browse failed",
      error: error.message,
    });
  }
});

/* ================= PROVIDER ================= */
router.get("/provider/:name", async (req, res) => {
  try {
    const rawName = req.params.name.toLowerCase();
    const providerId = PROVIDER_MAP[rawName];
    
    if (!providerId) {
      return res.json({ categorized: {}, results: [] });
    }

    const { category = "movie", region = "US" } = req.query;
    const mediaType =
      category === "series" || category === "tv" || category === "webseries"
        ? "tv"
        : "movie";

    // Fetch popular content for the media type
    const popular = await tmdb(`/${mediaType}/popular`, {
      language: "en-US",
      page: 1,
    });

    const items = popular.results || [];

    // Enrich and filter by provider
    const enriched = await Promise.all(
      items.slice(0, 50).map(async (it) => {
        try {
          const details = await tmdb(`/${mediaType}/${it.id}`, {
            append_to_response: "watch/providers,credits",
          });

          const providersForRegion =
            details["watch/providers"]?.results?.[region] || null;
          const providerList = [];

          if (providersForRegion) {
            ["flatrate", "rent", "buy", "ads"].forEach((k) => {
              if (providersForRegion[k]) {
                providersForRegion[k].forEach((p) => {
                  providerList.push(p.provider_name);
                });
              }
            });
          }

          const hasProvider = providerList.some(
            (p) => p.toLowerCase() === rawName || PROVIDER_MAP[p.toLowerCase()] === providerId
          );

          if (!hasProvider) return null;

          return {
            id: details.id,
            mediaType,
            title: details.title || details.name,
            overview: details.overview || "",
            poster: details.poster_path ? IMG + details.poster_path : null,
            providers: Array.from(new Set(providerList)),
            genres: (details.genres || []).map((g) => g.name),
            popularity: details.popularity || 0,
            runtime:
              details.runtime || details.episode_run_time?.[0] || null,
          };
        } catch (e) {
          return null;
        }
      })
    );

    const filtered = enriched.filter((e) => e !== null);

    // Categorize by genre
    const categorized = {};
    filtered.forEach((f) => {
      const genreKey = f.genres[0] || "Other";
      if (!categorized[genreKey]) {
        categorized[genreKey] = [];
      }
      categorized[genreKey].push(f);
    });

    res.json({
      provider: PROVIDER_NAME_MAP[providerId] || req.params.name,
      mediaType,
      total: filtered.length,
      categorized,
      results: filtered,
    });
  } catch (error) {
    console.error("Provider error:", error);
    res.status(500).json({
      message: "Provider fetch failed",
      error: error.message,
    });
  }
});

/* ================= GET MOVIE DETAILS ================= */
router.get("/:mediaType/:id", async (req, res) => {
  try {
    const { mediaType, id } = req.params;
    const region = req.query.region || "US";

    const d = await tmdb(`/${mediaType}/${id}`, {
      append_to_response: "credits,watch/providers",
    });

    const providersForRegion =
      d["watch/providers"]?.results?.[region] || null;
    const providerList = [];

    if (providersForRegion) {
      ["flatrate", "rent", "buy", "ads"].forEach((k) => {
        if (providersForRegion[k]) {
          providersForRegion[k].forEach((p) => {
            providerList.push(p.provider_name);
          });
        }
      });
    }

    const cast = (d.credits?.cast || [])
      .slice(0, 10)
      .map((c) => ({
        name: c.name,
        character: c.character || "",
      }));

    const runtime = d.runtime || d.episode_run_time?.[0] || null;
    const genres = (d.genres || []).map((g) => g.name);

    res.json({
      id: d.id,
      mediaType,
      title: d.title || d.name,
      overview: d.overview || "",
      runtime,
      poster: d.poster_path ? IMG + d.poster_path : null,
      cast,
      providers: Array.from(new Set(providerList)),
      genres,
      releaseDate: d.release_date || d.first_air_date || null,
      rating: d.vote_average || 0,
      full: d,
    });
  } catch (error) {
    console.error("Details error:", error);
    res.status(500).json({
      message: "Could not fetch details",
      error: error.message,
    });
  }
});

export default router;
