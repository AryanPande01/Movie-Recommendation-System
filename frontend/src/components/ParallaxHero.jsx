import { useEffect, useState } from "react";

export default function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-[60vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-red-900/50 to-black/50"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920')] bg-cover bg-center opacity-30"></div>
      </div>
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Your Next Favorite Show Awaits
          </h2>
          <p className="text-xl text-gray-200 drop-shadow-md">
            Personalized recommendations just for you
          </p>
        </div>
      </div>
    </div>
  );
}

