"use server";

import { v4 } from "uuid";
import { AccessToken } from "livekit-server-sdk";

import { getSelf } from "@/lib/auth-service"
import { getUserById } from "@/lib/user-service";
import { isBlockedByUser } from "@/lib/block-service";

export const createViewerToken = async (hostIdentity: string) => {
    let self;

    try {
        self = await getSelf();
    } catch {
        const id = v4();
        const username = 'guest#${Math.floor(Math.random() * 10000)}';
        self = { id, username };
    }

    const host = await getUserById(hostIdentity);

    if (!host) {
        throw new Error("User not found");
    }

    const isBlocked = await isBlockedByUser(host.id);
    if(isBlocked){
        throw new Error("You are blocked by this user");
    }


    const isHost = self.id === host.id;

    const token  = new AccessToken(
        process.env.LIVEKIT_API_KEY!,
        process.env.LIVEKIT_API_SECRET!,
        {
            identity: isHost ? `Host-${self.id}` : self.id,
            name: self.username ?? "Guest",
        }
    );

    token.addGrant({
        room: host.id,
        roomJoin: true,
        canPublish: false,
        canPublishData: true,
    });

    return await Promise.resolve(token.toJwt());
};