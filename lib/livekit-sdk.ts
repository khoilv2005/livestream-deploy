import {
  IngressAudioEncodingPreset,
  IngressClient,
  IngressInput,
  IngressVideoEncodingPreset,
  RoomServiceClient,
  type CreateIngressOptions,
  IngressVideoOptions,
  IngressAudioOptions,
} from "livekit-server-sdk";

import { TrackSource } from "@/lib/livekit-types";

// Kiểm tra các biến môi trường bắt buộc
console.log("LIVEKIT_API_URL:", process.env.LIVEKIT_API_URL!);
if (!process.env.LIVEKIT_API_KEY) {
  throw new Error("LIVEKIT_API_KEY is not defined in environment variables");
}
if (!process.env.LIVEKIT_API_SECRET) {
  throw new Error("LIVEKIT_API_SECRET is not defined in environment variables");
}

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!);

export const createIngressLivekit = async (
  ingressType: IngressInput,
  identity: string,
  username: string
) => {
  const options: CreateIngressOptions = {
    name: username,
    roomName: identity,
    participantName: username,
    participantIdentity: identity,
  };

  if (ingressType === IngressInput.WHIP_INPUT) {
    options.bypassTranscoding = true;
  } else {
    const videoOptions = new IngressVideoOptions();
    videoOptions.source = TrackSource.CAMERA;
    videoOptions.encodingOptions = { value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS, case: "preset" };
    options.video = videoOptions;

    const audioOptions = new IngressAudioOptions();
    audioOptions.source = TrackSource.MICROPHONE;
    audioOptions.encodingOptions = { value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS, case: "preset" };
    options.audio = audioOptions;
  }

  const ingress = await ingressClient.createIngress(ingressType, options);
  return ingress;
};
