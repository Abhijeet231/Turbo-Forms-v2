import { IconSunFilled, IconMoonFilled } from "@tabler/icons-react";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button onClick={toggle} className="p-2 rounded-full hover:bg-accent transition-colors">
      {theme === "dark" ? (
        <IconSunFilled className="h-5 w-5" />
      ) : (
        <IconMoonFilled className="h-5 w-5" />
      )}
    </button>
  );
}
