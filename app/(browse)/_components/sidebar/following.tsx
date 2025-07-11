"use client";

import { Follow, Stream, User } from "@/lib/generated/prisma";
import { useSidebar } from "@/store/use-sidebar";
import { UserItem } from "./user-item";

interface FollowingProps {
    data: (Follow & {
        following: User & {
            stream: { isLive: boolean } | null;
        };
    })[];
}

export const Following = ({
    data
} : FollowingProps) => {
    const {collapsed} = useSidebar((state) => state)
    if (!data.length){
        return null;
    }
    return(
        <div>
            {!collapsed && (
                <div className="pl-6 mb-4">
                    <p className="text-sm text-muted-foreground">Following</p>
                </div>
            )}
            <ul className="space-y-2 px-2">
                {data.map((follow) => (
                    <UserItem 
                    key={follow.following.id}
                    username={follow.following.username ?? "Unknown User"}
                    imageUrl={follow.following.imageUrl}
                    isLive={follow.following.stream?.isLive}
                    />
                ))}
            </ul>
        </div>
    )
}