import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "@/lib/themeContext";

const STORAGE_KEY = "guc-portfolio-theme-v2";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";

  const savedTheme = localStorage.getItem(STORAGE_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    localStorage.removeItem("guc-portfolio-theme-safe");

    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => {
    function toggleTheme() {
      setTheme((currentTheme) =>
        currentTheme === "dark" ? "light" : "dark"
      );
    }

    return {
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === "dark",
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}