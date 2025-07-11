import {db} from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { Following } from "@/app/(browse)/_components/sidebar/following";

export const getRecommendedService = async () => {
    let userId;
    try {
        const self  = await getSelf();
        userId = self.id;
    } catch (error) {
        userId = null;
        console.log("Error getting self:", error);
    }

    let users = [];
    if (userId){
        users = await db.user.findMany({
            where: {
                AND:[
                    { NOT: {
                        id: userId,
                    }
                },
                {
                    NOT:{
                        followers:{
                            some:{
                                followerId: userId
                            }
                        }
                    }
                },
                {
                    NOT: { // Loại trừ những người dùng đã bị người dùng hiện tại (userId) chặn
                            blocked: { // 'blockedBy' trên user được xét, nghĩa là user này nằm trong danh sách bị chặn của ai đó
                                some: {
                                    blockerId: userId // trong đó, người dùng hiện tại (userId) là người chặn (blocker)
                                }
                            }
                        }
                },
                {
                        NOT: { // Loại trừ những người dùng đã chặn người dùng hiện tại (userId)
                            blocking: { // 'blocking' trên user được xét, nghĩa là user này đang chặn ai đó
                                some: {
                                    blockedId: userId // trong đó, người dùng hiện tại (userId) là người bị chặn (blocked)
                                }
                            }
                        }
                }
                ]
                
                
                
            },
            include: {
                stream: {
                    select: {
                        isLive: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            }
        
        });
        return users;

    }
else {
    users = await db.user.findMany({
        include: {
            stream: {
                select: {
                    isLive: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return users;
    }
}