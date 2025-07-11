"use client";
import { use, useEffect } from "react";
import {useMediaQuery} from "usehooks-ts";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";

interface ContainerProps {
  children: React.ReactNode;
};

export const Container = ({ children }: ContainerProps) => {
    const matches = useMediaQuery("(max-width: 1024px)");
    const {
        collapsed,
        onCollapse,
        onExpand,
    } = useSidebar((state) => state);

    useEffect(() => {
        if (matches) {
            onCollapse();
        } else {
            onExpand();
        }
    },[matches, onCollapse, onExpand]);

     
    return (
        <div className={cn(
            "flex-1 transition-all duration-300 ease-in-out", // Thêm transition cho mượt
            collapsed ? "ml-[70px]" : "ml-60" // Margin dựa hoàn toàn vào state collapsed
        )}>
            {children}
        </div>
    );
};
