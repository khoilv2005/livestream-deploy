"use client";

import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTransition } from "react";
import { updateStream } from "@/actions/stream";
import { start } from "repl";
import { on } from "events";
type fieldTypes = "isChatEnabled" | "isChatDelayed" | "isChatFollowersOnly";

interface ToggleCardProps {
    label: string;
    value: boolean; 
    field: fieldTypes;
}

export const ToggleCard = ({
    label,
    value = false,
    field
}: ToggleCardProps
) => {
    const [isPending, startTransition] = useTransition();
    const onChange = () => {
        startTransition(() => {
        updateStream({[field]: !value})
        .then(() => {
            toast.success(`Chat settings updated successfully`);
        })
        .catch((error) => {
            toast.error(`Error updating chat settings: ${error.message}`);
        });
        });
    }
    return (
        <div className="rounded-xl bg-muted p-6">
            <div className="flex items-center justify-between">
                <p className="font-semibold shrink-0">
                    {label}
                </p>
                <div className="space-x-2">
                <Switch
                disabled={isPending}
                onCheckedChange={onChange}
                checked={value}
                >
                    {value ? "On" : "Off"}
                </Switch>
                </div>
            </div>
        </div>
    )
}