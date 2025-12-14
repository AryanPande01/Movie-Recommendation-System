import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ParallaxHero from "../components/ParallaxHero";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="bg-black dark:bg-gray-50 min-h-screen text-white dark:text-gray-900 transition-colors">
      <Navbar />
      <ParallaxHero />
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            Welcome to MovieVerse 🎬
          </h1>
          <p className="text-gray-400 dark:text-gray-600 mb-8 text-lg leading-relaxed">
            Discover movies, web series, and documentaries personalized to your
            taste. Get recommendations based on your preferences and explore
            content from your favorite streaming platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/preferences")}
              className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 rounded-lg text-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-xl text-white"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/browse")}
              className="border-2 border-red-600 dark:border-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-600/10 dark:hover:bg-red-600/10 transition-all text-white dark:text-gray-900"
            >
              Browse Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
