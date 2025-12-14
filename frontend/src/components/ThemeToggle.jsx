import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check saved theme or default to dark
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = saved === "dark" || (!saved && prefersDark);

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const isDarkNow = document.documentElement.classList.toggle("dark");
    setIsDark(isDarkNow);
    localStorage.setItem("theme", isDarkNow ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
