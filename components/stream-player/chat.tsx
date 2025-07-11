"use client";

import { useRoomContext, useRemoteParticipant } from "@livekit/components-react";
import { Room, RemoteParticipant } from "livekit-client";
import { useEffect, useState } from "react";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar";
import { ChatHeader } from "./chat-header";
import { ChatForm } from "./chat-form";
import { ChatList } from "./chat-list";
import { ChatCommunity } from "./chat-community";

export const ChatToggle = () => {
  const { collapsed, onExpand, onCollapse } = useChatSidebar((state) => state);

  const Icon = collapsed ? ArrowLeftFromLine : ArrowRightFromLine;

  const onToggle = () => {
    if (collapsed) {
      onExpand();
    } else {
      onCollapse();
    }
  };

  const label = collapsed ? "Expand" : "Collapse";

  return (
    <Hint label={label} side="left" asChild>
      <Button
        onClick={onToggle}
        variant="ghost"
        className="h-auto p-2 hover:bg-white/10 hover:text-primary bg-transparent"
      >
        <Icon className="h-4 w-4" />
      </Button>
    </Hint>
  );
};

interface ChatProps {
  viewerName: string;
  hostName: string;
  hostIdentity: string;
  isFollowing: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
  isLive?: boolean; // Thêm prop để kiểm tra stream có live không
}

export const Chat = ({
  viewerName,
  hostName,
  hostIdentity,
  isFollowing,
  isChatEnabled,
  isChatDelayed,
  isChatFollowersOnly,
  isLive = true, // Default true để không break existing code
}: ChatProps) => {
  const { variant } = useChatSidebar((state) => state);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<{ id: string; user: string; content: string; timestamp?: number }[]>([]);
  const room = useRoomContext();
  
  // Kiểm tra xem host có đang live không thông qua LiveKit participant
  const hostParticipant = useRemoteParticipant(hostIdentity);
  const isStreamLive = !!hostParticipant;

  useEffect(() => {
    if (!room) return;
    const handleData = (
      payload: Uint8Array,
      participant?: RemoteParticipant
    ) => {
      if (!participant) return;
      const msg = JSON.parse(new TextDecoder().decode(payload));
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          user: msg.senderName || participant.name || participant.identity, // Ưu tiên senderName, sau đó participant.name, cuối cùng là identity
          content: msg.content,
          timestamp: Date.now(),
        },
      ]);
    };
    room.on("dataReceived", handleData);
    return () => { room.off("dataReceived", handleData); };
  }, [room]);

  if (!isChatEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-2">
        <p className="text-muted-foreground">Chat is disabled</p>
      </div>
    );
  }

  if (!isStreamLive) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-2">
        <p className="text-muted-foreground">Stream is offline</p>
        <p className="text-sm text-muted-foreground mt-2">Chat will be available when the stream goes live</p>
      </div>
    );
  }

  const onSubmit = () => {
    if (!value.trim()) return;
    const msg = JSON.stringify({ 
      content: value,
      senderName: viewerName  // Gửi kèm tên người gửi
    });
    room?.localParticipant?.publishData(new TextEncoder().encode(msg), { reliable: true });
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: viewerName,
        content: value,
        timestamp: Date.now(),
      },
    ]);
    setValue("");
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      {variant === ChatVariant.CHAT && (
        <>
          <ChatList
            messages={messages}
            isHidden={false}
          />
          <ChatForm
            onSubmit={onSubmit}
            value={value}
            onChange={setValue}
            isHidden={false}
            isFollowersOnly={isChatFollowersOnly}
            isFollowing={isFollowing}
            isDelayed={isChatDelayed}
            isStreamLive={isStreamLive}
          />
        </>
      )}
      {variant === ChatVariant.COMMUNITY && (
        <ChatCommunity
          viewerName={viewerName}
          hostName={hostName}
          isHidden={false}
        />
      )}
    </div>
  );
};

export const ChatSkeleton = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-4 w-4 bg-muted rounded" />
      </div>
      <div className="flex-1 p-3 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-x-2">
            <div className="h-6 w-6 bg-muted rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/4 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t">
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  );
};