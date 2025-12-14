import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
          MovieVerse
        </h1>

        <p className="text-gray-300 mb-12 text-lg md:text-xl leading-relaxed">
          Discover movies, web series, and documentaries personalized to your
          taste. Get intelligent recommendations based on your preferences and
          explore content from your favorite streaming platforms.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 rounded-lg text-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-xl"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="border-2 border-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-600/10 transition-all"
          >
            Sign Up
          </button>
        </div>

        <div className="mt-12 text-gray-400 text-sm">
          <p>🎬 Movies • 📺 Web Series • 📚 Documentaries</p>
        </div>
      </div>
    </div>
  );
}
