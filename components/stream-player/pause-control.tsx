"use client";

import { Pause, Play } from "lucide-react";
import { Hint } from "@/components/hint"; // Optional, remove if not using

interface PauseControlProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const PauseControl = ({ isPlaying, onToggle }: PauseControlProps) => {
  const label = isPlaying ? "Pause stream" : "Resume stream";

  return (
    <Hint label={label} asChild>
      <button
        onClick={onToggle}
        className="text-foreground hover:bg-white/10 p-1.5 rounded-lg"
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </button>
    </Hint>
  );
};
