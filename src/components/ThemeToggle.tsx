import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      <Sun className="w-5 h-5 text-foreground absolute transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="w-5 h-5 text-foreground absolute transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </button>
  );
};

export default ThemeToggle;
