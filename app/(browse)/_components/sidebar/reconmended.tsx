"use client"
import { User } from "@/lib/generated/prisma/client";
import { useSidebar } from "@/store/use-sidebar";
import { UserItem } from "./user-item";
interface ReconmendedProps {
    // Có thể cân nhắc đổi thành data?: User[] nếu undefined là trạng thái hợp lệ
    data: (User & {
        stream: { isLive: boolean } | null;
    })[];
}
export const Reconmended = ({
    data,
}: ReconmendedProps) => {
    const {collapsed} = useSidebar((state) => state);
    console.log(data.length);
    // Sửa ở đây: Thêm dấu ? sau data trước khi truy cập .length
    const showLabel = !collapsed && data?.length > 0;
    return (
        
        <div>
            {showLabel && (
            <div className="pl-6 mb-4">
                <p className="text-sm text-muted-foreground">
                    Recommended for you
                </p>
            </div>
            )}
            <ul className="space-y-2 px-2">
                {data?.map((user) => (
                    <UserItem key={user.id}
                              username={user.username ?? "Unknown User"}
                              imageUrl={user.imageUrl}
                              isLive={user.stream?.isLive ?? false}
                    />
                ))}

            </ul>
            
        </div>
    )
}

