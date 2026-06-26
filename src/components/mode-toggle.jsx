import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative overflow-hidden"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center justify-center"
      >
        {theme === "dark" ? (
          <Sun className="size-[1.1rem]" />
        ) : (
          <Moon className="size-[1.1rem]" />
        )}
      </motion.span>
    </Button>
  );
}
