"use client";

import {
  Participant,
  RemoteTrackPublication,
  RemoteVideoTrack,
  RemoteAudioTrack,
  Track,
} from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { useTracks } from "@livekit/components-react";
import { PauseControl } from "./pause-control";
import { VolumeControl } from "./volume-control";
import { FullscreenControl } from "./fullscreen-control";
import { useEventListener } from "usehooks-ts";

interface LiveVideoProps {
  participant: Participant;
}

export const LiveVideo = ({ participant }: LiveVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoTrackRef = useRef<RemoteVideoTrack | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Update volume and mute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);

  const handleTogglePlay = () => {
    setIsPaused((prev) => !prev);
  };

  const handleToggleMute = () => {
    setMuted((prev) => !prev);
    // Nếu đang muted và volume = 0, thì set volume về 100 khi unmute
    if (muted && volume === 0) {
      setVolume(100);
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else if (wrapperRef.current) {
      wrapperRef.current.requestFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement !== null);
  };

  useEventListener("fullscreenchange", handleFullscreenChange, {
    current: document,
  });

  const videoTracks = useTracks([Track.Source.Camera]).filter(
    (track) => track.participant.identity === participant.identity
  );

  const audioTracks = useTracks([Track.Source.Microphone]).filter(
    (track) => track.participant.identity === participant.identity
  );

  useEffect(() => {
    const pub = videoTracks[0]?.publication as RemoteTrackPublication | undefined;
    const track = pub?.track;

    if (videoRef.current && track && track.kind === "video") {
      const remoteTrack = track as RemoteVideoTrack;
      remoteTrack.attach(videoRef.current);
      videoTrackRef.current = remoteTrack;
    }

    return () => {
      const currentVideoRef = videoRef.current;
      const currentTrackRef = videoTrackRef.current;
      if (currentVideoRef && currentTrackRef) {
        currentTrackRef.detach(currentVideoRef);
      }
    };
  }, [videoTracks]);

  // Handle audio tracks
  useEffect(() => {
    const pub = audioTracks[0]?.publication as RemoteTrackPublication | undefined;
    const track = pub?.track;

    if (videoRef.current && track && track.kind === "audio") {
      track.attach(videoRef.current);
      console.log("Audio track attached");
    }

    return () => {
      if (track && videoRef.current) {
        track.detach(videoRef.current);
        console.log("Audio track detached");
      }
    };
  }, [audioTracks]);

  // Ensure video plays when tracks are available
  useEffect(() => {
    if (videoRef.current && (videoTracks.length > 0 || audioTracks.length > 0)) {
      videoRef.current.play().catch((error) => {
        console.warn("Autoplay prevented:", error);
        // Browser might require user interaction first
      });
    }
  }, [videoTracks, audioTracks]);

  return (
    <div ref={wrapperRef} className="relative h-full flex">
      {/* Video stream */}
      <video
        ref={videoRef}
        className={`w-full h-auto object-contain rounded-md transition-opacity duration-300 ${
          isPaused ? "opacity-0" : "opacity-100"
        }`}
        autoPlay
        playsInline
        muted={muted}
        controls={false}
        onClick={() => {
          // Handle user interaction to enable audio playback
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        }}
      />

      {/* Pause Overlay */}
    {isPaused && (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 pointer-events-none">
        <p className="text-white text-2xl font-semibold">⏸ Paused</p>
    </div>
    )}


      {/* Controls */}
      <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-opacity transition duration-300">
        <div className="absolute bottom-0 right-0 flex h-14 items-center justify-between bg-neutral-900 px-4 w-full z-20">
          {/* Left: Pause */}
          <PauseControl isPlaying={!isPaused} onToggle={handleTogglePlay} />

          {/* Right: Volume + Fullscreen */}
          <div className="flex items-center gap-2">
            <VolumeControl
              value={muted ? 0 : volume}
              onChange={(v) => {
                setVolume(v);
                setMuted(v === 0);
              }}
              onToggle={handleToggleMute}
            />
            <FullscreenControl
              isFullscreen={isFullscreen}
              onToggle={toggleFullscreen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
