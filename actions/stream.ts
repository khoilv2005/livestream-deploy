"use server";
import { revalidatePath } from "next/cache"
import { Stream } from "@/lib/generated/prisma";
import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

export const updateStream = async (
    values: Partial<Stream>
) => {
    try {
        const self = await getSelf();
        const selfStream = await db.stream.findUnique({
            where: {
                userId: self.id,
            },
        });
        if (!selfStream) {
            throw new Error("Stream not found");
        }
        const validData ={
            name: values.name,
            isChatEnabled: values.isChatEnabled,
            isChatFollowersOnly: values.isChatFollowersOnly,
            isChatDelayed: values.isChatDelayed,
        };

        const Stream = await db.stream.update({
            where: {
                id: selfStream.id,
            },
            data:{
                ...validData,
            }

        });

        revalidatePath(`/u/${self.username}/chat`);
        revalidatePath(`/u/${self.username}`);
        revalidatePath(`/${self.username}`);

        return Stream;
        
    } catch (error) {
        
    }
}