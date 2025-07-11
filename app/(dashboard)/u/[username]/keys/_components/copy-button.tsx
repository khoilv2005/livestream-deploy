"use client";

import { Check, CheckCheck, Copy } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
    value?: string;
}

export const CopyButton = ({
    value
}: CopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 2000);
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
        
    };

    const Icon = isCopied ? CheckCheck : Copy;
    return (
        <button
            onClick={handleCopy}
            disabled={!value || isCopied} 
            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}