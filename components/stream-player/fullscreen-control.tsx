import { Maximize, Minimize } from "lucide-react";
import { Hint } from "../ui/hint";

interface FullscreenControlProps {
    isFullscreen: boolean;
    onToggle: () => void;
};

export const FullscreenControl = ({
    isFullscreen,
    onToggle,
}: FullscreenControlProps) => {
    const Icon = isFullscreen ? Minimize : Maximize;

    const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
    
    return(
        <div className="flex items-center justify-center gap-4">
            <Hint label={label} asChild>
                <button 
                    onClick={onToggle}
                    aria-label={label}
                    className="text-foreground bg-black/40 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                    <Icon className="h-5 w-5" />
                </button>
            </Hint>
        </div>
    );
};