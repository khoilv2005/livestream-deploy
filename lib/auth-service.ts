import { currentUser } from "@clerk/nextjs/server";
import {db} from "@/lib/db";

export const getSelf = async () => {
    const self = await currentUser();

    if (!self || !self.username) {
        throw new Error("User not found");
    }

    const user = await db.user.findUnique({
        where: {
            externalUserId: self.id,
        }
    });

    if (!user) {
        throw new Error("User not found in database");
    }

    return user;

}

export const getSelfByUsername = async (username: string) => {
    const self = await currentUser();
    if (!self || !self.username) {
        throw new Error("User not found");
    }
    const user = await db.user.findUnique({
        where: {
            username: username,
        }
    });
    if (!user) {
        throw new Error("User not found in database");
    }
    if (user.username !== self.username) {
        throw new Error("Unauthorized");
    }
    return user;
};