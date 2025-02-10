"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Switch } from "./ui/switch";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme((theme) => (theme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="ms-4 flex items-center">
      <Switch
        id="theme"
        onClick={toggleTheme}
        className="dark:bg-neutral-700 dark:border-neutral-600"
      />
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 ms-2" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ms-2" />
      )}
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}
