"use server";

import {
    IngressAudioEncodingPreset,
    IngressInput,
    IngressClient,
    IngressVideoEncodingPreset,
    RoomServiceClient,
    type CreateIngressOptions,
    EncodingOptions,
} from "livekit-server-sdk";
import { TrackSource } from "livekit-server-sdk";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

const roomService = new RoomServiceClient(
    process.env.LIVEKIT_API_URL!,
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
);

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!);
export const resetIngresses = async (hostIdentity: string) => {
    const ingresses = await ingressClient.listIngress({
        roomName: hostIdentity,
    })
    const rooms = await roomService.listRooms([hostIdentity]);
    for (const room of rooms)
    {
        await roomService.deleteRoom(room.name)
    }

    for (const ingress of ingresses){
        if (ingress.ingressId){
            await ingressClient.deleteIngress(ingress.ingressId)
        }
    }
}
export const createIngress = async (ingressType: IngressInput) => {
    const self = await getSelf();
    await resetIngresses(self.id);
    const existingIngresses = await ingressClient.listIngress();
        for (const ingress of existingIngresses) {
            if (ingress.participantIdentity === self.id) {
            await ingressClient.deleteIngress(ingress.ingressId);
        }
    }

    const options: CreateIngressOptions = {
        name: self.username ?? undefined,
        roomName: self.id,
        participantName: self.username ?? undefined,
        participantIdentity: self.id,
    };

    if (ingressType === IngressInput.WHIP_INPUT) {
        options.bypassTranscoding = true;
    } else {
        options.video = {
            source: TrackSource.CAMERA,
            preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
        }as any; 
        options.audio = {
            source: TrackSource.MICROPHONE,
            preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS
        }as any; 
    };

    const ingress = await ingressClient.createIngress(ingressType, options, );
    if (!ingress || !ingress.url || !ingress.streamKey) {
        throw new Error("Failed to create ingress");
    }

    await db.stream.update({
        where: { userId: self.id },
        data: {
            ingressId: ingress.ingressId,
            serverUrl: ingress.url,
            streamKey: ingress.streamKey,
        },
    });

    revalidatePath('/u/$(self.username)/keys');
    return {
        ingressId: ingress.ingressId,
        url: ingress.url,
        streamKey: ingress.streamKey,
    };
};
