"use client";

import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { useCreatorSidebar } from "@/store/use-creator-sidebar";
import { Hint } from "@/components/ui/hint";
import { Button } from "@/components/ui/button";

export const Toggle = () => {
    const { collapsed, onExpand, onCollapse } = useCreatorSidebar((state) => state);

    const label = collapsed ? "Expand" : "Collapse";
    const Icon = collapsed ? ArrowRightFromLine : ArrowLeftFromLine;

    const onToggle = () => {
        if (collapsed) {
            onExpand();
        } else {
            onCollapse();
        }
    };

    return (
        <>
            {collapsed && (
                <div className="hidden lg:flex w-full items-center justify-center pt-4 mb-4">
                    <Hint label={label} side="right" asChild>
                        <Button onClick={onToggle} className="h-auto p-2 ml-auto" variant="ghost">
                            <ArrowRightFromLine className="h-4 w-4" />
                        </Button>
                    </Hint>
                </div>
            )}
            {!collapsed && (
                <div className="p-3 pl-6 mb-2 flex items-center w-full">
                    <p className="font-semibold text-primary">
                        Creator Studio
                    </p>
                    <Hint label={label} side="right" asChild>
                        <Button onClick={onToggle} className="h-auto p-2 ml-auto" variant="ghost">
                            <ArrowLeftFromLine className="h-4 w-4" />
                        </Button>
                    </Hint>
                </div>
            )}
        </>
    );
};