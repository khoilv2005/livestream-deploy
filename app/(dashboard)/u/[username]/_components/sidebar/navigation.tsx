"use client";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
    Fullscreen,
    Key,
    KeyRound,
    MessageSquare,
    Users,
} from "lucide-react";
import { NavigationItem } from "./NavItems";

export const Navigation = () => { 
    const pathname = usePathname();
    const { user } = useUser();
    
    const routes = [
        {
            label: "Stream",
            href: `/u/${user?.username}`,
            icon: Fullscreen,
        },
        {
            label: "Keys",
            href: `/u/${user?.username}/keys`,
            icon: KeyRound,
        },
        {
            label: "Chat",
            href: `/u/${user?.username}/chat`, // Sửa lại đường dẫn đúng
            icon: MessageSquare,
        },
        {
            label: "Community",
            href: `/u/${user?.username}/community`,
            icon: Users,
        }
    ];
    
    return(
        <ul className="space-y-2 px-2 pt-4 lg:pt-0">
            {routes.map((route) => (
                <NavigationItem
                    key={route.label}
                    label={route.label}
                    icon={route.icon}                    
                    href={route.href}
                    isactive={pathname === route.href}
                />
            ))}
        </ul>
    );
};