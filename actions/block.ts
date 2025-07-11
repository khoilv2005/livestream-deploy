"use server";

import { blockUser, unblockUser } from "@/lib/block-service"
import { revalidatePath } from "next/cache";

export const onBlock = async (id: string) => {
    try {
        const blockRelationship = await blockUser(id); 

        revalidatePath("/");
        if (blockRelationship) {
            revalidatePath(`/${blockRelationship.blocked.username}`);
        }
        
        return blockRelationship;

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Không thể chặn người dùng này.");
    }
};

export const onUnblock = async (id: string) => {
    try {
        const unblockRelationship = await unblockUser(id);

        revalidatePath("/");
        if (unblockRelationship) {
            revalidatePath(`/${unblockRelationship.blocked.username}`);
        }

        return unblockRelationship;

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Không thể bỏ chặn người dùng này.");
    }
};