import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Preferences() {
  const navigate = useNavigate();

  const [type, setType] = useState("movie");
  const [language, setLanguage] = useState("english");
  const [genre, setGenre] = useState("romantic");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/movies/recommend", {
        category: type === "tv" ? "series" : type,
        language,
        genre,
        region: "US",
      });

      // Store last recommendations
      localStorage.setItem(
        "last_recommendations",
        JSON.stringify(res.data.results || [])
      );

      navigate("/recommendations");
    } catch (e) {
      console.error(e);
      alert(
        e?.response?.data?.message ||
          "Failed to fetch recommendations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] py-12 px-4">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-xl w-full max-w-md shadow-2xl border border-zinc-700">
          <h2 className="text-3xl font-bold mb-2 text-center text-white">
            Choose Your Preferences
          </h2>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Tell us what you like and we'll recommend the perfect content for
            you
          </p>

          {/* TYPE */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-300 font-medium">
              Content Type
            </label>
            <select
              className="w-full p-3 bg-zinc-800 rounded-lg text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="movie">Movie</option>
              <option value="tv">Web Series</option>
              <option value="documentary">Documentary</option>
            </select>
          </div>

          {/* LANGUAGE */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-300 font-medium">
              Language
            </label>
            <select
              className="w-full p-3 bg-zinc-800 rounded-lg text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="marathi">Marathi</option>
              <option value="spanish">Spanish</option>
              <option value="german">German</option>
            </select>
          </div>

          {/* GENRE */}
          <div className="mb-8">
            <label className="block mb-2 text-gray-300 font-medium">
              Genre
            </label>
            <select
              className="w-full p-3 bg-zinc-800 rounded-lg text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="romantic">Romantic</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="thriller">Thriller</option>
              <option value="action">Action</option>
              <option value="comedy">Comedy</option>
              <option value="drama">Drama</option>
              <option value="horror">Horror</option>
              <option value="adventure">Adventure</option>
              <option value="fantasy">Fantasy</option>
              <option value="documentary">Documentary</option>
            </select>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-red-600 to-red-700 py-3 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-[1.02] shadow-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Getting Recommendations..." : "Get Recommendations"}
          </button>
        </div>
      </div>
    </div>
  );
}
